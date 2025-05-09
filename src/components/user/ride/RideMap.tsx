import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { io, Socket } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, PhoneCall, Clock, LocateFixed, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Player } from '@lottiefiles/react-lottie-player';

// Set your Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN';

interface DriverInfo {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  vehicleInfo?: {
    model: string;
    color: string;
    plateNumber: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
}

interface BookingDetails {
  ride_id: string;
  pickupLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  dropoffLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  status: string;
  price: number;
  distance: string;
  estimatedTime?: string;
  pin?: number;
}

const RideMap: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const dropoffMarkerRef = useRef<mapboxgl.Marker | null>(null);
  
  const [rideStatus, setRideStatus] = useState<string>('waiting');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [eta, setEta] = useState<string>('Calculating...');
  const [routeDistance, setRouteDistance] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('Connecting to your driver...');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Initialize from the navigation state
  useEffect(() => {
    if (!state) {
      navigate('/ride', { replace: true });
      return;
    }

    const { pickup, dropoff, customerLocation, bookingId } = state;
    
    setBookingDetails({
      ride_id: bookingId,
      pickupLocation: {
        address: pickup,
        latitude: customerLocation[1],
        longitude: customerLocation[0]
      },
      dropoffLocation: {
        address: dropoff,
        latitude: customerLocation[1] + 0.05, // This is a placeholder - should be real coordinates
        longitude: customerLocation[0] + 0.05
      },
      status: 'accepted',
      price: 0, // Will be updated from socket
      distance: '0', // Will be updated from socket
    });

    // Initialize socket connection
    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Initialize the map once we have booking details
  useEffect(() => {
    if (!bookingDetails || !mapContainerRef.current) return;
    
    initializeMap();
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [bookingDetails]);

  // Update the route whenever driver location changes
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.loaded() || !driverInfo || !bookingDetails) return;
    
    updateDriverMarker();
    updateRoute();
  }, [driverInfo]);

  const initializeSocket = () => {
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      query: {
        token: localStorage.getItem('userToken'),
        refreshToken: localStorage.getItem('refreshToken'),
      },
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      
      // Request the current driver location and ride details
      if (state?.bookingId) {
        socketRef.current?.emit('getRideDetails', { ride_id: state.bookingId });
      }
    });

    socketRef.current.on('rideDetails', (data: {
      driver: DriverInfo;
      booking: BookingDetails;
    }) => {
      setDriverInfo(data.driver);
      setBookingDetails({
        ...bookingDetails,
        ...data.booking,
        status: data.booking.status || 'accepted',
        price: data.booking.price || 0,
        distance: data.booking.distance || '0',
        pin: data.booking.pin || Math.floor(1000 + Math.random() * 9000)
      });
      
      setRideStatus(data.booking.status || 'accepted');
      
      if (data.booking.status === 'cancelled') {
        setIsModalOpen(true);
        setLoadingMessage('Your ride has been cancelled.');
      }
    });

    socketRef.current.on('driverLocationUpdate', (data: {
      driverId: string;
      location: { latitude: number; longitude: number };
    }) => {
      if (driverInfo && driverInfo.id === data.driverId) {
        setDriverInfo({
          ...driverInfo,
          location: data.location
        });
      }
    });

    socketRef.current.on('rideStatusUpdate', (data: {
      ride_id: string;
      status: string;
      message?: string;
    }) => {
      if (data.ride_id === bookingDetails?.ride_id) {
        setRideStatus(data.status);
        
        if (data.status === 'arrived') {
          toast({
            title: "Driver has arrived",
            description: "Your driver is waiting at the pickup location.",
            duration: 5000,
          });
        } else if (data.status === 'cancelled') {
          setIsModalOpen(true);
          setLoadingMessage(data.message || 'Your ride has been cancelled.');
        } else if (data.status === 'completed') {
          navigate('/ride-completed', { 
            state: { 
              bookingDetails,
              driverInfo,
            },
            replace: true
          });
        }
      }
    });

    socketRef.current.on('tokens-updated', ({ token, refreshToken }) => {
      localStorage.setItem('userToken', token);
      localStorage.setItem('refreshToken', refreshToken);
    });

    socketRef.current.on('error', (message: string) => {
      console.error('Socket error:', message);
      toast({
        title: "Connection Error",
        description: message,
        variant: "destructive",
        duration: 5000,
      });
    });
  };

  const initializeMap = () => {
    if (!bookingDetails || !mapContainerRef.current) return;
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [bookingDetails.pickupLocation.longitude, bookingDetails.pickupLocation.latitude],
      zoom: 14,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // Add user marker
    userMarkerRef.current = new mapboxgl.Marker({ color: '#3b82f6' })
      .setLngLat([bookingDetails.pickupLocation.longitude, bookingDetails.pickupLocation.latitude])
      .addTo(map);
    
    // Add dropoff marker
    dropoffMarkerRef.current = new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat([bookingDetails.dropoffLocation.longitude, bookingDetails.dropoffLocation.latitude])
      .addTo(map);

    // Add route layer when map loads
    map.on('load', () => {
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 6,
          'line-opacity': 0.8
        }
      });

      // If we already have driver info, update the driver marker
      if (driverInfo) {
        updateDriverMarker();
        updateRoute();
      }
    });
  };

  const updateDriverMarker = () => {
    if (!driverInfo || !mapRef.current) return;

    if (!driverMarkerRef.current) {
      // Create driver marker if it doesn't exist
      driverMarkerRef.current = new mapboxgl.Marker({ color: '#10b981' })
        .setLngLat([driverInfo.location.longitude, driverInfo.location.latitude])
        .addTo(mapRef.current);
    } else {
      // Update existing marker position
      driverMarkerRef.current.setLngLat([driverInfo.location.longitude, driverInfo.location.latitude]);
    }
  };

  const updateRoute = async () => {
    if (!mapRef.current || !driverInfo || !bookingDetails) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${driverInfo.location.longitude},${driverInfo.location.latitude};${bookingDetails.pickupLocation.longitude},${bookingDetails.pickupLocation.latitude}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        // Update ETA
        const durationMinutes = Math.round(route.duration / 60);
        setEta(durationMinutes <= 1 ? '1 min' : `${durationMinutes} mins`);

        // Update distance
        const distanceKm = (route.distance / 1000).toFixed(1);
        setRouteDistance(`${distanceKm} km`);

        // Update route on map
        if (mapRef.current.getSource('route')) {
          (mapRef.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          });
        }

        // Fit the map to show the entire route
        const bounds = new mapboxgl.LngLatBounds()
          .extend([driverInfo.location.longitude, driverInfo.location.latitude])
          .extend([bookingDetails.pickupLocation.longitude, bookingDetails.pickupLocation.latitude]);

        mapRef.current.fitBounds(bounds, { padding: 100 });
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const handleCancelRide = () => {
    if (!bookingDetails) return;
    
    socketRef.current?.emit('cancelRide', { 
      ride_id: bookingDetails.ride_id 
    });
    
    toast({
      title: "Cancellation requested",
      description: "We're processing your cancellation request.",
      duration: 3000,
    });
  };

  const handleContactDriver = () => {
    // Implement in-app messaging or call
    toast({
      title: "Contact feature",
      description: "This feature will be available soon.",
      duration: 3000,
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/ride', { replace: true });
  };

  // Show loading state
  if (!bookingDetails || !mapRef.current) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Player
          autoplay
          loop
          src="https://lottie.host/6d218af1-a90d-49b2-b56e-7ba126e3ac68/mNvXamDXCm.json"
          style={{ height: '120px', width: '120px' }}
        />
        <p className="mt-4 text-xl font-semibold text-gray-700">{loadingMessage}</p>
      </div>
    );
  }

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ride Cancelled</h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm mb-4">
              {loadingMessage || "Your ride has been cancelled. Please book a new ride."}
            </p>
            <div className="flex justify-center mb-4">
              <Player
                autoplay
                loop
                src="https://lottie.host/6d218af1-a90d-49b2-b56e-7ba126e3ac68/mNvXamDXCm.json"
                style={{ height: '80px', width: '80px' }}
              />
            </div>
            <Button
              onClick={closeModal}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Book a new ride
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col h-screen">
        {/* Map container */}
        <div className="relative flex-1" ref={mapContainerRef} />

        {/* Ride info card */}
        <Card className="m-4 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                <span>Arriving in: {eta}</span>
              </div>
              <div className="text-sm text-gray-500">
                {routeDistance} away
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {driverInfo && (
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-14 w-14 border-2 border-blue-200">
                  <AvatarImage src={driverInfo.avatar || "/placeholder-avatar.png"} alt={driverInfo.name} />
                  <AvatarFallback>{driverInfo.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="font-medium">{driverInfo.name}</p>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm ml-1">{driverInfo.rating.toFixed(1)}</span>
                  </div>
                  {driverInfo.vehicleInfo && (
                    <p className="text-sm text-gray-600">
                      {driverInfo.vehicleInfo.color} {driverInfo.vehicleInfo.model} • {driverInfo.vehicleInfo.plateNumber}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="rounded-full h-10 w-10"
                    onClick={handleContactDriver}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="rounded-full h-10 w-10"
                    onClick={handleContactDriver}
                  >
                    <PhoneCall className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4 mb-4">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <LocateFixed className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">PICKUP LOCATION</p>
                  <p className="text-sm font-medium">{bookingDetails.pickupLocation.address}</p>
                </div>
              </div>
            </div>

            {bookingDetails.pin && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-500 font-medium">SHARE WITH DRIVER</p>
                <p className="text-2xl font-bold text-center text-blue-700">PIN: {bookingDetails.pin}</p>
              </div>
            )}

            <div className="flex gap-4">
              {rideStatus !== 'arrived' && (
                <Button
                  onClick={handleCancelRide}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel Ride
                </Button>
              )}
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  if (mapRef.current) {
                    mapRef.current.flyTo({
                      center: [bookingDetails.pickupLocation.longitude, bookingDetails.pickupLocation.latitude],
                      zoom: 16
                    });
                  }
                }}
              >
                Show Pickup Point
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RideMap;