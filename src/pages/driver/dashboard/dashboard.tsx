import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CircleDollarSign, Clock, Star, Navigation2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@chakra-ui/react";
import DriverNavbar from "@/components/driver/dashboard/DriverNavbar";
import RideNotification from "@/components/driver/dashboard/RideNotification";
import { useSocket } from "@/context/SocketContext";
import { showRideMap, hideRideMap } from "@/services/redux/slices/driverRideSlice";

const NOTIFICATION_SOUND = "/uber_tune.mp3";

interface DriverLocation {
  latitude: number;
  longitude: number;
}

interface Customer {
  id: string;
  name: string;
  profileImageUrl?: string;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address: string;
}

interface RideDetails {
  rideId: string;
  estimatedDistance: string;
  estimatedDuration: string;
  fareAmount: number;
  vehicleType: string;
  securityPin: number;
}

interface BookingDetails {
  bookingId: string;
  userId: string;
  pickupLocation: LocationCoordinates;
  dropoffLocation: LocationCoordinates;
  rideDetails: RideDetails;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
}

interface CustomerDetails {
  id: string;
  name: string;
  profileImageUrl?: string;
}

interface DriverRideRequest {
  requestId: string;
  customer: CustomerDetails;
  pickup: LocationCoordinates;
  dropoff: LocationCoordinates;
  ride: RideDetails;
  booking: BookingDetails;
  requestTimeout: number;
  requestTimestamp: string;
}

const DriverDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [showRideRequest, setShowRideRequest] = useState<boolean>(false);
  const [activeRide, setActiveRide] = useState<DriverRideRequest | null>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { socket, isConnected } = useSocket();

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
      audioRef.current.play().catch((e) => console.error("Error playing sound:", e));
    }
  }, []);

  const startCountdown = useCallback((duration: number) => {
    setTimeLeft(Math.floor(duration / 1000));
    if (timeoutRef.current) clearInterval(timeoutRef.current);

    timeoutRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timeoutRef.current) clearInterval(timeoutRef.current);
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
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Unable to fetch your location. Please ensure location services are enabled.",
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      toast({
        title: "Geolocation Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const emitDriverLocation = useCallback(() => {
    if (socket && driverLocation && isOnline && isConnected) {
      socket.emit("driverLocation", {
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
      });
    }
  }, [socket, driverLocation, isOnline, isConnected]);

  useEffect(() => {
    if (!socket) return;

    socket.on("rideRequest", (rideRequest: DriverRideRequest) => {
      if (!rideRequest || !rideRequest.booking) {
        console.error("Invalid ride request data:", rideRequest);
        toast({
          title: "Ride Request Error",
          description: "Invalid ride request data received.",
          variant: "destructive",
        });
        return;
      }
      console.log("rideRequest==-", rideRequest);

      try {
        setActiveRide(rideRequest);
        setShowRideRequest(true);
        playNotificationSound();
        startCountdown(rideRequest.requestTimeout);
      } catch (error) {
        console.error("Error processing ride request:", error);
        toast({
          title: "Ride Request Error",
          description: "Failed to process ride request.",
          variant: "destructive",
        });
      }
    });

    socket.on("error", (error: { message: string; code: string }) => {
      console.error("Socket error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    });

    return () => {
      socket.off("rideRequest");
      socket.off("error");
    };
  }, [socket, playNotificationSound, startCountdown, toast]);

  useEffect(() => {
    let locationInterval: NodeJS.Timeout | null = null;
    let emitInterval: NodeJS.Timeout | null = null;

    if (isOnline && isConnected) {
      updateDriverLocation();
      locationInterval = setInterval(updateDriverLocation, 10000);
      emitInterval = setInterval(emitDriverLocation, 10000);
    }

    return () => {
      if (locationInterval) clearInterval(locationInterval);
      if (emitInterval) clearInterval(emitInterval);
    };
  }, [isOnline, isConnected, updateDriverLocation, emitDriverLocation]);

  useEffect(() => {
    if (!isConnected && isOnline) {
      toast({
        title: "Disconnected",
        description: "Lost connection to the server. Retrying...",
        variant: "destructive",
      });
    } else if (isConnected && isOnline) {
      toast({
        title: "Connected",
        description: "Successfully connected to the server.",
        variant: "default",
      });
    }
  }, [isConnected, isOnline, toast]);

  const handleOnlineChange = useCallback((checked: boolean) => {
    setIsOnline(checked);
    if (!checked) {
      setShowRideRequest(false);
      setActiveRide(null);
      if (socket && isConnected) {
        socket.emit("driverOffline", { driverId: socket.id });
      }
     }
  }, [socket, isConnected]);

  const handleAcceptRide = useCallback(() => {
    if (socket && activeRide && isConnected) {
      console.log(`Emitting rideResponse:${activeRide.ride.rideId}`, {
        requestId: activeRide.requestId,
        rideId: activeRide.ride.rideId,
        accepted: true,
        timestamp: new Date().toISOString(),
      });

      socket.emit(`rideResponse:${activeRide.ride.rideId}`, {
        requestId: activeRide.requestId,
        rideId: activeRide.ride.rideId,
        accepted: true,
        bookingId: activeRide.booking.bookingId,
        timestamp: new Date().toISOString(),
      });

      setShowRideRequest(false);
      console.log("jklhfdajk",activeRide);
      dispatch(showRideMap(activeRide));
      navigate("/driver/rideTracking");

      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }

      toast({
        title: "Ride Accepted",
        description: "Navigate to pickup location.",
        variant: "default",
      });
    } else {
      console.error("Cannot accept ride:", { socket, activeRide, isConnected });
      toast({
        title: "Error",
        description: "Unable to accept ride. Please try again.",
        variant: "destructive",
      });
    }
  }, [socket, activeRide, isConnected, dispatch, navigate, toast]);

  const handleDeclineRide = useCallback(() => {
    if (socket && activeRide && isConnected) {
      console.log(`Emitting rideResponse:${activeRide.ride.rideId}`, {
        requestId: activeRide.requestId,
        rideId: activeRide.ride.rideId,
        accepted: false,
        timestamp: new Date().toISOString(),
      });

      socket.emit(`rideResponse:${activeRide.ride.rideId}`, {
        requestId: activeRide.requestId,
        rideId: activeRide.ride.rideId,
        accepted: false,
        timestamp: new Date().toISOString(),
      });

      socket.emit("cancelRide", {
        bookingId: activeRide.booking.bookingId,
        reason: "Driver declined",
      });

      setShowRideRequest(false);
      setActiveRide(null);

      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }

      toast({
        title: "Ride Declined",
        description: "You have declined the ride request.",
        variant: "destructive",
      });
    }
  }, [socket, activeRide, isConnected, toast]);

  const handleArrived = useCallback(() => {
    if (socket && activeRide && isConnected) {
      socket.emit("driverArrived", {
        bookingId: activeRide.booking.bookingId,
      });

      toast({
        title: "Arrival Notification",
        description: "You have notified the customer of your arrival.",
        variant: "default",
      });
    }
  }, [socket, activeRide, isConnected, toast]);

  const handleCancelRide = useCallback(() => {
    if (socket && activeRide && isConnected) {
      socket.emit("cancelRide", {
        bookingId: activeRide.booking.bookingId,
        reason: "Driver cancelled",
      });

      setActiveRide(null);
      dispatch(hideRideMap());
      navigate("/driver/dashboard");

      toast({
        title: "Ride Cancelled",
        description: "You have cancelled the ride.",
        variant: "destructive",
      });
    }
  }, [socket, activeRide, isConnected, dispatch, navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DriverNavbar />
      <div className="flex-1 p-4 sm:p-6 md:p-8 ml-0 sm:ml-64">
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm concerts-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Driver Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Welcome back, Driver</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${isOnline ? "text-emerald-500" : "text-gray-500"}`}>
                  {isOnline ? "Online" : "Offline"}
                </span>
                <Switch
                  checked={isOnline}
                  onCheckedChange={handleOnlineChange}
                  className="data-[state=checked]:bg-emerald-500"
                  disabled={!isConnected && isOnline}
                />
              </div>
            </div>
            {!isConnected && isOnline && (
              <p className="text-red-500 text-sm mt-2">Disconnected from server. Retrying...</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Earnings</p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">₹2,450</h3>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-emerald-50 rounded-full flex items-center justify-center">
                  <CircleDollarSign className="h-5 w-5 sm:h-

6 sm:w-6 text-emerald-500" />
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

        {showRideRequest && activeRide && (
          <RideNotification
            customer={{
              name: activeRide.customer.name,
              profileImageUrl: activeRide.customer.profileImageUrl,
            }}
            pickup={activeRide.pickup}
            dropoff={activeRide.dropoff}
            ride={activeRide.ride}
            booking={activeRide.booking}
            timeLeft={timeLeft}
            requestTimeout={activeRide.requestTimeout}
            onAccept={handleAcceptRide}
            onDecline={handleDeclineRide}
          />
        )}

        {!activeRide && !showRideRequest && isOnline && (
          <Card className="mb-6">
            <CardContent className="py-8 sm:py-12 text-center">
              <Badge variant="secondary" className="mb-4 bg-emerald-50 text-emerald-500">Online</Badge>
              <h3 className="text-lg font-semibold mb-2">Looking for rides...</h3>
              <p className="text-muted-foreground">Stay online to receive ride requests in your area</p>
            </CardContent>
          </Card>
        )}

        {!activeRide && !showRideRequest && !isOnline && (
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