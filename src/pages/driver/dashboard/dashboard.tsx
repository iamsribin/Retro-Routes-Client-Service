import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { CircleDollarSign, Clock, Star, Navigation2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@chakra-ui/react';
import DriverNavbar from '@/components/driver/dashboard/DriverNavbar';
import RideNotification from '@/components/driver/dashboard/RideNotification';
import ActiveRideMap from '@/components/driver/dashboard/ActiveRideMap';

const NOTIFICATION_SOUND = '/uber_tune.mp3';
const SOCKET_URL = 'http://localhost:3000';

interface DriverLocation {
  latitude: number;
  longitude: number;
}

interface Booking {
  ride_id: string;
  user_id: string;
  pickupCoordinates: { latitude: number; longitude: number };
  dropoffCoordinates: { latitude: number; longitude: number };
  pickupLocation: string;
  dropoffLocation: string;
  distance: string;
  vehicleModel: string;
  price: number;
  status: string;
  pin: number;
  _id: string;
  date: string;
}

interface RideRequestData {
  pickup: string;
  dropoff: string;
  customerName: string;
  customerLocation: [number, number];
  bookingId: string;
  timeout: number;
  customerAvatar: string;
  customerRating: number;
  distance: string;
  amount: number;
  booking: Booking;
}

const DriverDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [showRideRequest, setShowRideRequest] = useState<boolean>(false);
  const [activeRide, setActiveRide] = useState<RideRequestData | null>(null);
  const [isRideAccepted, setIsRideAccepted] = useState<boolean>(false);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.error('Error playing sound:', e));
    }
  }, []);

  const startCountdown = useCallback((duration: number) => {
    setTimeLeft(Math.floor(duration / 1000));
    if (timeoutRef.current) clearInterval(timeoutRef.current);

    timeoutRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timeoutRef.current) clearInterval(timeoutRef.current);
          handleDeclineRide();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const updateDriverLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Location Error',
            description: 'Unable to fetch your location. Please ensure location services are enabled.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      toast({
        title: 'Geolocation Error',
        description: 'Geolocation is not supported by your browser.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  const emitDriverLocation = useCallback(() => {
    if (socket && driverLocation && isOnline) {
      socket.emit('driverLocation', {
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
      });
    }
  }, [socket, driverLocation, isOnline]);

  const initializeSocket = useCallback(() => {
    const token = localStorage.getItem('driverToken');
    const refreshToken = localStorage.getItem('DriverRefreshToken');

    if (!token || !refreshToken) {
      console.error('Missing authentication tokens');
      toast({
        title: 'Authentication Error',
        description: 'Please log in again to continue.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return null;
    }             

    const newSocket = io(SOCKET_URL, {
      query: { token, refreshToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      setConnectionError(null);
      toast({
        title: 'Connected',
        description: 'Successfully connected to the server.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setConnectionError(error.message);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to the server. Retrying...',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    });

    newSocket.on('tokens-updated', (data) => {
      localStorage.setItem('driverToken', data.token);
      localStorage.setItem('DriverRefreshToken', data.refreshToken);
      console.log('Tokens updated');
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      toast({
        title: 'Socket Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    });

    newSocket.on('location-updated', (data) => {
      console.log('Location update confirmed:', data);
    });

    newSocket.on('rideRequest', (rideRequest) => {
      console.log('Ride request received:', JSON.stringify(rideRequest, null, 2));
      
      if (!rideRequest || !rideRequest.booking) {
        console.error('Invalid ride request data:', rideRequest);
        toast({
          title: 'Ride Request Error',
          description: 'Invalid ride request data received.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      try {
        const customerName = rideRequest.customer?.name || 'Customer';
        const formattedRideRequest: RideRequestData = {
          pickup: rideRequest.pickup || rideRequest.booking.pickupLocation || 'Unknown',
          dropoff: rideRequest.dropoff || rideRequest.booking.dropoffLocation || 'Unknown',
          customerName,
          customerLocation: rideRequest.customer?.location || [
            rideRequest.booking.pickupCoordinates?.latitude || 0,
            rideRequest.booking.pickupCoordinates?.longitude || 0,
          ],
          bookingId: rideRequest.bookingId || rideRequest.booking.ride_id || '',
          timeout: rideRequest.timeout || 30000,
          customerAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}`,
          customerRating: rideRequest.customer?.rating || 4.8,
          distance: rideRequest.distance || (rideRequest.booking.distance ? rideRequest.booking.distance + ' km' : 'Unknown'),
          amount: rideRequest.amount || rideRequest.booking.price || 0,
          booking: {
            ...rideRequest.booking,
            pickupCoordinates: rideRequest.booking.pickupCoordinates || { latitude: 0, longitude: 0 },
            dropoffCoordinates: rideRequest.booking.dropoffCoordinates || { latitude: 0, longitude: 0 },
            distance: rideRequest.booking.distance || '0',
            price: rideRequest.booking.price || 0,
            pin: rideRequest.booking.pin || 0,
          },
        };

        console.log('Formatted ride request:', JSON.stringify(formattedRideRequest, null, 2));
        
        setActiveRide(formattedRideRequest);
        setShowRideRequest(true);
        playNotificationSound();
        startCountdown(formattedRideRequest.timeout);
      } catch (error) {
        console.error('Error processing ride request:', error);
        toast({
          title: 'Ride Request Error',
          description: 'Failed to process ride request.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    });

    return newSocket;
  }, [playNotificationSound, startCountdown, toast]);
  

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let locationInterval: NodeJS.Timeout | null = null;
    let emitInterval: NodeJS.Timeout | null = null;

    if (isOnline) {
      if (!socket) {
        const newSocket = initializeSocket();
        setSocket(newSocket);
      }

      updateDriverLocation();
      locationInterval = setInterval(updateDriverLocation, 10000);
      emitInterval = setInterval(emitDriverLocation, 10000);
    }

    return () => {
      if (locationInterval) clearInterval(locationInterval);
      if (emitInterval) clearInterval(emitInterval);
      if (socket && !isOnline) {
        console.log('Disconnecting socket');
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [isOnline, socket, initializeSocket, updateDriverLocation, emitDriverLocation]);

  const handleOnlineChange = useCallback((checked: boolean) => {
    setIsOnline(checked);
    if (!checked) {
      setShowRideRequest(false);
      setActiveRide(null);
      setIsRideAccepted(false);
      setConnectionError(null);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [socket]);

  const handleAcceptRide = useCallback(() => {
    console.log("accept==", activeRide);
    console.log("socket==",socket);
  
    if (socket && activeRide) {
      socket.emit('rideResponse', {
        ride_id: activeRide.bookingId, 
        accepted: true,
      });
  
      setShowRideRequest(false);
      setIsRideAccepted(true);
  
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
  
      toast({
        title: 'Ride Accepted',
        description: 'Navigate to pickup location.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [socket, activeRide, toast]);
  
  const handleDeclineRide = useCallback(() => {
    if (socket && activeRide) {
      socket.emit('rideResponse', {
        ride_id: activeRide.bookingId,
        accepted: false,
      });
    }
  }, [socket, activeRide]);
  const handleArrived = useCallback(() => {
    if (socket && activeRide) {
      socket.emit('driverArrived', {
        bookingId: activeRide.bookingId,
      });

      toast({
        title: 'Arrival Notification',
        description: 'You have notified the customer of your arrival.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [socket, activeRide, toast]);

  const handleCancelRide = useCallback(() => {
    if (socket && activeRide) {
      socket.emit('cancelRide', {
        bookingId: activeRide.bookingId,
        reason: 'Driver cancelled',
      });

      setActiveRide(null);
      setIsRideAccepted(false);

      toast({
        title: 'Ride Cancelled',
        description: 'You have cancelled the ride.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [socket, activeRide, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DriverNavbar />
      <div className="flex-1 p-4 sm:p-6 md:p-8 ml-0 sm:ml-64">
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Driver Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Welcome back, Driver</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${isOnline ? 'text-emerald-500' : 'text-gray-500'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                <Switch
                  checked={isOnline}
                  onCheckedChange={handleOnlineChange}
                  className="data-[state=checked]:bg-emerald-500"
                  disabled={!!connectionError && isOnline}
                />
              </div>
            </div>
            {connectionError && (
              <p className="text-red-500 text-sm mt-2">Connection error: {connectionError}</p>
            )}
          </div>
        </div>

        {!isRideAccepted && !activeRide && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Today's Earnings</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">₹2,450</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-emerald-50 rounded-full flex items-center justify-center">
                    <CircleDollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed Rides</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">8</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-wasabi-50 rounded-full flex items-center justify-center">
                    <Navigation2 className="h-5 w-5 sm:h-6 sm:w-6 text-wasabi-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Online Hours</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">6.5h</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-egyptian-50 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-egyptian-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rating</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">4.8</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-khaki-50 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-khaki-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showRideRequest && activeRide && (
          <RideNotification
            customer={{
              name: activeRide.customerName,
              avatar: activeRide.customerAvatar,
              rating: activeRide.customerRating,
            }}
            ride={{
              pickup: activeRide.pickup,
              dropoff: activeRide.dropoff,
              distance: activeRide.distance,
              amount: activeRide.amount,
              bookingId: activeRide.bookingId,
              timeout: activeRide.timeout,
            }}
            timeLeft={timeLeft}
            onAccept={handleAcceptRide}
            onDecline={handleDeclineRide}
          />
        )}

        {isRideAccepted && activeRide && driverLocation && (
          <div className="h-[calc(100vh-220px)]">
            <ActiveRideMap
              booking={activeRide.booking}
              driverLocation={driverLocation}
              customer={{
                name: activeRide.customerName,
                avatar: activeRide.customerAvatar,
                rating: activeRide.customerRating,
              }}
              onArrived={handleArrived}
              onCancelRide={handleCancelRide}
            />
          </div>
        )}

        {!activeRide && !showRideRequest && !isRideAccepted && isOnline && (
          <Card className="mb-6">
            <CardContent className="py-8 sm:py-12 text-center">
              <Badge variant="secondary" className="mb-4 bg-emerald-50 text-emerald-500">Online</Badge>
              <h3 className="text-lg font-semibold mb-2">Looking for rides...</h3>
              <p className="text-muted-foreground">Stay online to receive ride requests in your area</p>
            </CardContent>
          </Card>
        )}

        {!activeRide && !showRideRequest && !isRideAccepted && !isOnline && (
          <Card className="mb-6">
            <CardContent className="py-8 sm:py-12 text-center">
              <Badge variant="secondary" className="mb-4">Offline</Badge>
              <h3 className="text-lg font-semibold mb-2">You're currently offline</h3>
              <p className="text-muted-foreground mb-6">Go online to start receiving ride requests</p>
              <Button onClick={() => setIsOnline(true)} className="bg-emerald-500 hover:bg-emerald-600">
                Go Online
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;