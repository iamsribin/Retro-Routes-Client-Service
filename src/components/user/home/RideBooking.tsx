import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { useJsApiLoader } from '@react-google-maps/api';
import { Player } from '@lottiefiles/react-lottie-player';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useToast } from '@/components/ui/use-toast';

// Vehicle type definition
interface VehicleOption {
  id: string;
  name: string;
  image: string;
  price: number;
  eta: string;
  features: string[];
}

interface RideStatusData {
  ride_id: string;
  status: 'searching' | 'accepted' | 'Failed' | 'cancelled';
  message?: string;
  driverId?: string;
  booking?: any;
  driverLocation?: { lat: number; lng: number };
}

interface ScheduledRide {
  date: Date | null;
  time: string;
}

const Ride: React.FC = () => {
  const [center, setCenter] = useState({ lat: 13.003371, lng: 77.589134 });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(13);
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [rideStatus, setRideStatus] = useState<RideStatusData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [useCurrentLocationAsPickup, setUseCurrentLocationAsPickup] = useState(false);
  const [showVehicleSheet, setShowVehicleSheet] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledRide, setScheduledRide] = useState<ScheduledRide>({
    date: null,
    time: '',
  });
  const [driverDirections, setDriverDirections] = useState<google.maps.DirectionsResult | null>(null);
  
  const originRef = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  const { toast } = useToast();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ['places'],
  });

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_GATEWAY_URL_SOCKET, {
      query: {
        token: localStorage.getItem('userToken'),
        refreshToken: localStorage.getItem('refreshToken'),
      },
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('rideStatus', (data: RideStatusData) => {
      setRideStatus(data);
      console.log("data===", data);
      
      if (data.status === 'accepted') {
        setIsSearching(false);
        toast({
          title: 'Ride Accepted',
          description: 'A driver has accepted your ride request!',
          variant: 'default',
        });

        // If driver location is provided, fetch route from driver to pickup
        if (data.driverLocation && userLocation) {
          fetchDriverRoute(data.driverLocation, userLocation);
        }

        navigate('/ride-tracking', {
          state: {
            booking: data.booking,
            driverId: data.driverId,
            userLocation: userLocation,
            driverLocation: data.driverLocation,
          },
        });
      } else if (data.status === 'Failed' || data.status === 'cancelled') {
        console.log("Failed...");
        
        setIsSearching(false);
        setShowVehicleSheet(false);
        toast({
          title: 'Ride Request Failed',
          description: data.message || 'Unable to find a driver',
          variant: 'destructive',
        });
      } else if (data.status === 'searching') {
        toast({
          title: 'Searching for Drivers',
          description: 'Looking for available drivers...',
          variant: 'default',
        });
      }
    });

    socketRef.current.on('tokens-updated', ({ token, refreshToken }) => {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    });

    socketRef.current.on('error', (message: string) => {
      setIsSearching(false);
      setShowVehicleSheet(false);
      toast({
        title: 'Connection Error',
        description: message,
        variant: 'destructive',
      });
    });

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setCenter({ lat: latitude, lng: longitude });
          
          if (useCurrentLocationAsPickup) {
            setOrigin('Current Location');
            if (originRef.current) originRef.current.value = 'Current Location';
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Location Error',
            description: 'Unable to get your current location',
            variant: 'destructive',
          });
        }
      );
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('rideStatus');    
        socketRef.current.off('tokens-updated');
        socketRef.current.off('error');
        socketRef.current.disconnect(); 
      }
    };
  }, [navigate, toast, useCurrentLocationAsPickup]);

  useEffect(() => {
    if (useCurrentLocationAsPickup && userLocation) {
      setOrigin('Current Location');
      if (originRef.current) originRef.current.value = 'Current Location';
    } else if (!useCurrentLocationAsPickup && origin === 'Current Location') {
      setOrigin('');
      if (originRef.current) originRef.current.value = '';
    }
  }, [useCurrentLocationAsPickup, userLocation]);

  const fetchRoute = async () => {    
    if (!origin || !destination || !userLocation) return;

    const directionsService = new google.maps.DirectionsService();
    
    try {
      let originLocation: google.maps.LatLng | string = origin;
      if (origin === 'Current Location' && userLocation) {
        originLocation = new google.maps.LatLng(userLocation.lat, userLocation.lng);
      }

      const result = await directionsService.route({
        origin: originLocation,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      
      setDirections(result);
      
      const route = result.routes[0];
      if (route && route.legs[0]) {
        setDistanceInfo({
          distance: route.legs[0].distance?.text || 'Unknown',
          duration: route.legs[0].duration?.text || 'Unknown',
        });
        
        const distance = route.legs[0].distance?.value || 0;
        const basePrice = Math.max(5, Math.ceil(distance / 1000) * 2);
        
        setVehicles([
          {
            id: 'standard',
            name: 'Standard',
            image: '/api/placeholder/80/80',
            price: basePrice,
            eta: '2-5 min',
            features: ['Up to 4 passengers', 'Air conditioning', 'Economy vehicle']
          },
          {
            id: 'comfort',
            name: 'Comfort',
            image: '/api/placeholder/80/80',
            price: Math.ceil(basePrice * 1.4),
            eta: '3-7 min',
            features: ['Up to 4 passengers', 'Premium vehicle', 'Extra legroom']
          },
          {
            id: 'premium',
            name: 'Premium',
            image: '/api/placeholder/80/80',
            price: Math.ceil(basePrice * 2),
            eta: '5-10 min',
            features: ['Up to 4 passengers', 'Luxury vehicle', 'Professional driver']
          },
          {
            id: 'xl',
            name: 'XL',
            image: '/api/placeholder/80/80',
            price: Math.ceil(basePrice * 1.7),
            eta: '4-8 min',
            features: ['Up to 6 passengers', 'SUV or minivan', 'Extra space for luggage']
          }
        ]);
        
        setShowVehicleSheet(true);
      }
    } catch (error) {
      console.error('Directions request failed:', error);
      toast({
        title: 'Route Error',
        description: 'Could not calculate the route',
        variant: 'destructive',
      });
    }
  };

  const fetchDriverRoute = async (driverLocation: { lat: number; lng: number }, pickupLocation: { lat: number; lng: number }) => {
    const directionsService = new google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin: driverLocation,
        destination: pickupLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      
      setDriverDirections(result);
    } catch (error) {
      console.error('Driver route request failed:', error);
      toast({
        title: 'Route Error',
        description: 'Could not calculate driver route',
        variant: 'destructive',
      });
    }
  };

  const handleSearchCabs = async () => {
    if ((useCurrentLocationAsPickup && !userLocation) || !destination) {
      toast({
        title: 'Missing Information',
        description: 'Please enter dropoff location and ensure your current location is available',
        variant: 'destructive',
      });
      return;
    }

    if (!useCurrentLocationAsPickup && (!origin || !destination)) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both pickup and dropoff locations',
        variant: 'destructive',
      });
      return;
    }

    await fetchRoute();
  };

  const handleScheduleToggle = () => {
   

 setIsScheduled(!isScheduled);
    if (!isScheduled) {
      setScheduledRide({ date: null, time: '' });
    }
  };

  const handleBookRide = () => {
    if (!origin || !destination || !userLocation || !selectedVehicle) {
      toast({
        title: 'Booking Error',
        description: 'Please select a vehicle type and ensure all locations are set',
        variant: 'destructive',
      });
      return;
    }

    if (isScheduled && (!scheduledRide.date || !scheduledRide.time)) {
      toast({
        title: 'Booking Error',
        description: 'Please select both date and time for scheduled ride',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    setRideStatus({
      ride_id: '',
      status: 'searching',
      message: 'Searching for available drivers...'
    });

    try {
      let pickupLat = userLocation.lat;
      let pickupLng = userLocation.lng;

      if (directions && origin !== 'Current Location' && directions.routes[0]?.legs[0]?.start_location) {
        pickupLat = directions.routes[0].legs[0].start_location.lat();
        pickupLng = directions.routes[0].legs[0].start_location.lng();
      }

      let dropoffLat = userLocation.lat + 0.05;
      let dropoffLng = userLocation.lng + 0.05;

      if (directions && directions.routes[0]?.legs[0]?.end_location) {
        dropoffLat = directions.routes[0].legs[0].end_location.lat();
        dropoffLng = directions.routes[0].legs[0].end_location.lng();
      }

      const vehicleModel = vehicles.find(v => v.id === selectedVehicle)?.name || 'Standard';

      const bookingData = {
        pickupLocation: { 
          address: origin, 
          latitude: pickupLat, 
          longitude: pickupLng 
        },
        dropoffLocation: { 
          address: destination, 
          latitude: dropoffLat, 
          longitude: dropoffLng 
        },
        vehicleModel: vehicleModel,
        isScheduled,
        scheduledDateTime: isScheduled ? {
          date: scheduledRide.date,
          time: scheduledRide.time
        } : null
      };

      socketRef.current?.emit('requestRide', bookingData);
    } catch (error) {
      toast({
        title: 'Booking Error',
        description: 'Failed to send ride request. Please try again.',
        variant: 'destructive',
      });
      setIsSearching(false);
      handleClear();
    }
  };

  const handleClear = () => {
    setOrigin('');
    setDestination('');
    setRideStatus(null);
    setIsSearching(false);
    setDirections(null);
    setDriverDirections(null);
    setDistanceInfo(null);
    setVehicles([]);
    setSelectedVehicle(null);
    setShowVehicleSheet(false);
    if (originRef.current) originRef.current.value = '';
    if (destinationRef.current) destinationRef.current.value = '';
  };

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen">Loading Map...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-blue-800">Find Your Ride</h1>
        <p className="text-gray-600 mt-2">Safe, reliable rides to your destination</p>
      </div>

      <div className="relative">
        <div className="h-[75vh] w-full rounded-xl overflow-hidden shadow-xl">
          <GoogleMap
            center={center}
            zoom={zoom}
            mapContainerStyle={{
              width: '100%',
              height: '100%',
            }}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            {userLocation && !directions && !driverDirections && <Marker position={userLocation} />}
            {driverDirections ? (
              <DirectionsRenderer directions={driverDirections} />
            ) : directions ? (
              <DirectionsRenderer directions={directions} />
            ) : null}
            {rideStatus?.driverLocation && (
              <Marker position={rideStatus.driverLocation} label="Driver" />
            )}
          </GoogleMap>
        </div>

        <div className="absolute top-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4 md:w-96 md:left-4 md:right-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch 
                id="use-current-location"
                checked={useCurrentLocationAsPickup}
                onCheckedChange={setUseCurrentLocationAsPickup}
              />
              <Label htmlFor="use-current-location" className="text-sm font-medium">
                Use my current location as pickup
              </Label>
            </div>
            
            {!useCurrentLocationAsPickup && (
              <div className="w-full">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Pickup Location</label>
                <div className="flex gap-2">
                  <Autocomplete className="w-full">
                    <Input
                      type="text"
                      ref={originRef}
                      placeholder="Enter pickup location"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="border-2 focus:border-blue-500"
                    />
                  </Autocomplete>
                  <Button
                    size="icon"
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => {
                      if (userLocation) {
                        setOrigin('Current Location');
                        if (originRef.current) originRef.current.value = 'Current Location';
                      }
                    }}
                  >
                    <GpsFixedIcon className="text-white h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Dropoff Location</label>
              <Autocomplete className="w-full">
                <Input
                  type="text"
                  ref={destinationRef}
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="border-2 focus:border-blue-500"
                />
              </Autocomplete>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <Switch 
                  id="schedule-ride"
                  checked={isScheduled}
                  onCheckedChange={handleScheduleToggle}
                />
                <Label htmlFor="schedule-ride" className="text-sm font-medium">
                  Schedule for later
                </Label>
              </div>

              {isScheduled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !scheduledRide.date && "text-muted-foreground"
                          )}
                        >
                          {scheduledRide.date ? format(scheduledRide.date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={scheduledRide.date || undefined}
                          onSelect={(date) => setScheduledRide((prev:any) => ({ ...prev, date }))}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Time</Label>
                    <Input
                      type="time"
                      value={scheduledRide.time}
                      onChange={(e) => setScheduledRide(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                className="w-3/4 h-10 bg-blue-600 hover:bg-blue-700 font-medium"
                onClick={handleSearchCabs}
                disabled={
                  (useCurrentLocationAsPickup && (!userLocation || !destination)) || 
                  (!useCurrentLocationAsPickup && (!origin || !destination)) || 
                  isSearching
                }
              >
                <DirectionsCarIcon className="mr-2 h-5 w-5" />
                Find Rides
              </Button>
              <Button
                className="w-1/4 h-10 bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
                onClick={handleClear}
                disabled={isSearching}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        <Sheet open={showVehicleSheet} onOpenChange={setShowVehicleSheet}>
          <SheetContent side="bottom" className="h-[70vh] rounded-t-xl max-w-2xl mx-auto">
            <SheetHeader className="text-left mb-4">
              <SheetTitle className="text-2xl">Choose Your Ride</SheetTitle>
              {distanceInfo && (
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                    Distance: {distanceInfo.distance}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                    Duration: {distanceInfo.duration}
                  </Badge>
                </div>
              )}
            </SheetHeader>
            
            <div className="grid gap-4 pb-16">
              {vehicles.map((vehicle) => (
                <Card 
                  key={vehicle.id}
                  className={`cursor-pointer transition-all ${
                    selectedVehicle === vehicle.id 
                      ? 'border-2 border-blue-500 shadow-md' 
                      : 'border border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={vehicle.image} alt={vehicle.name} className="w-14 h-14 object-contain" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{vehicle.name}</p>
                        <p className="text-sm text-gray-500">{vehicle.eta}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {vehicle.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-bold">${vehicle.price}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 max-w-2xl mx-auto">
              <Button
                className="w-full h-14 text-lg font-medium bg-blue-600 hover:bg-blue-700"
                onClick={handleBookRide}
                disabled={!selectedVehicle || isSearching}
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <span>Finding Driver</span>
                    <Player
                      autoplay
                      loop
                      src="https://lottie.host/6d218af1-a90d-49b2-b56e-7ba126e3ac68/mNvXamDXCm.json"
                      style={{ height: '30px', width: '30px' }}
                    />
                  </div>
                ) : (
                  `Book ${selectedVehicle ? vehicles.find(v => v.id === selectedVehicle)?.name : 'Ride'}`
                )}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Ride;