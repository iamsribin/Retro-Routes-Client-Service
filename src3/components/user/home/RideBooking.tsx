import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useJsApiLoader } from "@react-google-maps/api";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NotificationDialog from "@/hooks/useNotificationDialog";
import axiosUser from "@/services/axios/userAxios";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "@/context/SocketContext";
import { showNotification } from "@/services/redux/slices/notificationSlice";
import { showRideMap } from "@/services/redux/slices/rideSlice";
import { RootState } from "@/services/redux/store";

interface BackendVehicle {
  vehicleModel: string;
  image: string;
  basePrice: number;
  pricePerKm: number;
  eta: string;
  features: string[];
}

interface VehicleOption {
  id: string;
  name: string;
  image: string;
  price: number;
  pricePerKm: number;
  eta: string;
  features: string[];
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Booking {
  date: string;
  distance: string;
  driver: {
    driverName: string;
    driverNumber: string;
    driverProfile: string;
    driver_id: string;
  };
  driverCoordinates: Coordinates;
  dropoffCoordinates: Coordinates;
  dropoffLocation: string;
  duration: string;
  pickupCoordinates: Coordinates;
  pickupLocation: string;
  pin: number;
  price: number;
  ride_id: string;
  status: string;
  user: {
    userName: string;
    userProfile: string;
    user_id: string;
    number: string;
  };
  vehicleModel: string;
  _id: string;
  __v: number;
}

interface DriverDetails {
  cancelledRides: number;
  color: string;
  driverId: string;
  driverImage: string;
  driverName: string;
  mobile: number;
  number: string;
  rating: number;
  vehicleModel: string;
}

interface Message {
  sender: "driver" | "user";
  content: string;
  timestamp: string;
  type: "text" | "image";
  fileUrl?: string;
}

interface RideStatusData {
  ride_id: string;
  status: "searching" | "Accepted" | "DriverComingToPickup" | "RideStarted" | "RideFinished" | "Failed" | "cancelled";
  message?: string;
  driverId?: string;
  booking: Booking;
  driverCoordinates?: Coordinates;
  driverDetails?: DriverDetails;
  chatMessages: Message[];
}

interface ScheduledRide {
  date: Date | null;
  time: string;
}

interface NotificationState {
  open: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

const libraries: ("places")[] = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions: google.maps.MapOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

const Ride: React.FC = () => {
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 13.003371,
    lng: 77.589134,
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState<number>(13);
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [rideStatus, setRideStatus] = useState<RideStatusData | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<{
    distance: string;
    duration: string;
    distanceInKm: number;
  } | null>(null);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [useCurrentLocationAsPickup, setUseCurrentLocationAsPickup] =
    useState<boolean>(false);
  const [showVehicleSheet, setShowVehicleSheet] = useState<boolean>(false);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [scheduledRide, setScheduledRide] = useState<ScheduledRide>({
    date: null,
    time: "",
  });
  const [driverDirections, setDriverDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    type: "info",
    title: "",
    message: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const { socket, isConnected } = useSocket();
  const { user } = useSelector((state: RootState) => ({
    user: state.user,
  }));

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries,
  });

  useEffect(() => {
    const setupSocketListeners = () => {
      if (!socket || !isConnected) return;

      socket.on("rideStatus", (data: RideStatusData) => {    
        console.log("RideStatusData",data);
            
        setIsSearching(false);
        setShowVehicleSheet(false);
        setRideStatus(data);
        const notificationType = getNotificationType(data.status);
        const navigateTo = data.status === "Accepted" ? "/ride-tracking" : undefined;

        dispatch(
          showNotification({
            type: notificationType,
            message: data.message || `Ride status: ${data.status}`,
            data: { rideId: data.ride_id, driverId: data.driverId },
            navigate: navigateTo,
          })
        );

        if (data.status === "Accepted" && data.driverCoordinates && data.booking?.pickupCoordinates) {
          dispatch(showRideMap(data));
          // fetchDriverRoute(data.driverCoordinates, {
          //   lat: data.booking.pickupCoordinates.latitude,
          //   lng: data.booking.pickupCoordinates.longitude,
          // });
        }
      });

      socket.on("error", (error: { message: string; code: string }) => {
        setNotification({
          open: true,
          type: "error",
          title: "Error",
          message: error.message,
        });
      });
    };

    const getUserLocation = () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setCenter({ lat: latitude, lng: longitude });

          if (useCurrentLocationAsPickup) {
            setOrigin("Current Location");
            if (originRef.current) originRef.current.value = "Current Location";
          }
        },
        (error) => {
          setNotification({
            open: true,
            type: "error",
            title: "Location Error",
            message: "Unable to get your current location",
          });
        }
      );
    };

    setupSocketListeners();
    getUserLocation();

    return () => {
      if (socket && isConnected) {
        socket.off("rideStatus");
        socket.off("error");
      }
    };
  }, [socket, isConnected, dispatch, navigate, useCurrentLocationAsPickup, userLocation]);

  useEffect(() => {
    if (useCurrentLocationAsPickup && userLocation) {
      setOrigin("Current Location");
      if (originRef.current) originRef.current.value = "Current Location";
    } else if (!useCurrentLocationAsPickup && origin === "Current Location") {
      setOrigin("");
      if (originRef.current) originRef.current.value = "";
    }
  }, [useCurrentLocationAsPickup, userLocation]);

  const getNotificationType = (status: RideStatusData["status"]): "success" | "error" | "info" => {
    switch (status) {
      case "Accepted":
        return "success";
      case "Failed":
        return "error";
      default:
        return "info";
    }
  };

  const fetchVehicles = async (distanceInKm: number) => {
    try {
      const response = await axiosUser(dispatch).get("/vehicles");
      if (response.data.message === "Failed") {
        throw new Error("Could not fetch vehicle options");
      }

      const data: BackendVehicle[] = response.data.message;
      const fetchedVehicles: VehicleOption[] = data.map((vehicle) => ({
        id: vehicle.vehicleModel.toLowerCase(),
        name: vehicle.vehicleModel,
        image: vehicle.image,
        price: Math.ceil(vehicle.basePrice + vehicle.pricePerKm * distanceInKm),
        pricePerKm: vehicle.pricePerKm,
        eta: vehicle.eta,
        features: vehicle.features,
      }));

      setVehicles(fetchedVehicles);
      setShowVehicleSheet(true);
    } catch (error) {
      setNotification({
        open: true,
        type: "error",
        title: "Vehicle Data Error",
        message: "Could not fetch vehicle options. Please try again.",
      });
    }
  };

  const fetchRoute = async () => {
    if (!origin || !destination || !userLocation) {
      setNotification({
        open: true,
        type: "error",
        title: "Missing Information",
        message: "Please enter valid pickup and dropoff locations",
      });
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const originLocation = useCurrentLocationAsPickup && userLocation
      ? new google.maps.LatLng(userLocation.lat, userLocation.lng)
      : origin;

    try {
      const result = await directionsService.route({
        origin: originLocation,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirections(result);
      const route = result.routes[0];
      if (route?.legs[0]) {
        const distanceInMeters = route.legs[0].distance?.value ?? 0;
        setDistanceInfo({
          distance: route.legs[0].distance?.text ?? "Unknown",
          duration: route.legs[0].duration?.text ?? "Unknown",
          distanceInKm: distanceInMeters / 1000,
        });
        await fetchVehicles(distanceInMeters / 1000);
      }
    } catch (error) {
      console.log("Route Error==", error);

      setNotification({
        open: true,
        type: "error",
        title: "Route Error",
        message: "Could not calculate the route",
      });
    }
  };

  const handleSearchCabs = async () => {
    if (!destination || (useCurrentLocationAsPickup && !userLocation) || (!useCurrentLocationAsPickup && !origin)) {
      setNotification({
        open: true,
        type: "error",
        title: "Missing Information",
        message: "Please enter required location details",
      });
      return;
    }
    await fetchRoute();
  };

  const geocodeLatLng = async (lat: number, lng: number): Promise<string> => {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error("Geocoding failed"));
        }
      });
    });
  };

  const handleBookRide = async () => {
    if (!origin || !destination || !userLocation || !selectedVehicle || !distanceInfo) {
      setNotification({
        open: true,
        type: "error",
        title: "Booking Error",
        message: "Please select a vehicle and ensure all locations are set",
      });
      return;
    }

    // if (isScheduled && (!scheduledRide.date || !scheduledRide.time)) {
    //   setNotification({
    //     open: true,
    //     type: "error",
    //     title: "Booking Error",
    //     message: "Please select both date and time for scheduled ride",
    //   });
    //   return;
    // }

    setIsSearching(true);
    // setRideStatus({
    //   ride_id: "",
    //   status: "searching",
    //   message: "Searching for available drivers...",
    // });

    try {
      if (!socket || !isConnected) {
        throw new Error("Socket not connected");
      }

      const pickupLat = directions?.routes[0]?.legs[0]?.start_location?.lat() ?? userLocation.lat;
      const pickupLng = directions?.routes[0]?.legs[0]?.start_location?.lng() ?? userLocation.lng;
      const dropoffLat = directions?.routes[0]?.legs[0]?.end_location?.lat() ?? userLocation.lat + 0.05;
      const dropoffLng = directions?.routes[0]?.legs[0]?.end_location?.lng() ?? userLocation.lng + 0.05;

      let pickupAddress = origin;
      let dropoffAddress = destination;

      if (useCurrentLocationAsPickup) {
        try {
          pickupAddress = await geocodeLatLng(pickupLat, pickupLng);
        } catch (error) {
          console.error("Failed to geocode pickup location:", error);
          pickupAddress = "Current Location";
        }
      }

      try {
        dropoffAddress = await geocodeLatLng(dropoffLat, dropoffLng);
      } catch (error) {
        console.error("Failed to geocode dropoff location:", error);
      }

      const selectedVehicleData = vehicles.find((v) => v.id === selectedVehicle);
      const vehicleModel = selectedVehicleData?.name ?? "Standard";

      const bookingData = {
        pickupLocation: {
          address: pickupAddress,
          latitude: pickupLat,
          longitude: pickupLng,
        },
        dropOffLocation: {
          address: dropoffAddress,
          latitude: dropoffLat,
          longitude: dropoffLng,
        },
        vehicleModel,
        isScheduled,
        scheduledDateTime: isScheduled ? scheduledRide : null,
        userName: user.user,
        estimatedPrice: selectedVehicleData?.price ?? 0,
        estimatedDuration: distanceInfo.duration,
        distanceInfo: {
          distance: distanceInfo.distance,
          distanceInKm: distanceInfo.distanceInKm
        },
        mobile: user.mobile,
        profile: user.profile
      };

      socket.emit("requestRide", bookingData);
    } catch (error) {
      console.log("booking error",error);
      
      setNotification({
        open: true,
        type: "error",
        title: "Booking Error",
        message: "Failed to send ride request. Please try again.",
      });
      setIsSearching(false);
      handleClear();
    }
  };

  const handleClear = () => {
    setOrigin("");
    setDestination("");
    setRideStatus(null);
    setIsSearching(false);
    setDirections(null);
    setDriverDirections(null);
    setDistanceInfo(null);
    setVehicles([]);
    setSelectedVehicle(null);
    setShowVehicleSheet(false);
    if (originRef.current) originRef.current.value = "";
    if (destinationRef.current) destinationRef.current.value = "";
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Map...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-blue-800">Find Your Ride</h1>
        <p className="text-gray-600 mt-2">Safe, reliable rides to your destination</p>
      </header>

      <div className="relative">
        <div className="h-[75vh] w-full rounded-xl overflow-hidden shadow-xl">
          <GoogleMap
            center={center}
            zoom={zoom}
            mapContainerStyle={mapContainerStyle}
            options={mapOptions}
            onLoad={(mapInstance) => setMap(mapInstance)}
          >
            {userLocation && !directions && !driverDirections && (
              <Marker position={userLocation} />
            )}
            {driverDirections ? (
              <DirectionsRenderer directions={driverDirections} />
            ) : directions ? (
              <DirectionsRenderer directions={directions} />
            ) : null}
            {rideStatus?.driverCoordinates && (
              <Marker
                position={{
                  lat: rideStatus.driverCoordinates.latitude,
                  lng: rideStatus.driverCoordinates.longitude,
                }}
                label="Driver"
              />
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
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Pickup Location
                </label>
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
                        setOrigin("Current Location");
                        if (originRef.current) originRef.current.value = "Current Location";
                      }
                    }}
                  >
                    <GpsFixedIcon className="text-white h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Dropoff Location
              </label>
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
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      Distance: {distanceInfo.distance}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      Duration: {distanceInfo.duration}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    * Prices are estimates and may vary based on route, traffic, and weather conditions.
                  </p>
                </div>
              )}
            </SheetHeader>

            <div className="grid gap-4 pb-16">
              {vehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className={`cursor-pointer transition-all ${
                    selectedVehicle === vehicle.id
                      ? "border-2 border-blue-500 shadow-md"
                      : "border border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-14 h-14 object-contain"
                        />
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
                      style={{ height: "30px", width: "30px" }}
                    />
                  </div>
                ) : (
                  `Book ${
                    selectedVehicle
                      ? vehicles.find((v) => v.id === selectedVehicle)?.name ?? "Ride"
                      : "Ride"
                  }`
                )}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <NotificationDialog
          open={notification.open}
          onOpenChange={(open: boolean) =>
            setNotification((prev) => ({ ...prev, open }))
          }
          type={notification.type}
          title={notification.title}
          message={notification.message}
        />
      </div>
    </div>
  );
};

export default Ride;
