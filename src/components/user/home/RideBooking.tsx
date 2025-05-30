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
import { useDispatch } from "react-redux";
import { useSocket } from "@/context/SocketContext";
import { showNotification } from "@/services/redux/slices/notificationSlice";
import { showRideMap } from "@/services/redux/slices/rideSlice";

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

interface RideStatusData {
  ride_id: string;
  status: "searching" | "Accepted" | "Failed" | "cancelled";
  message?: string;
  driverId?: string;
  booking?: unknown;
  pickupCoordinates?: { latitude: number; longitude: number };
  driverCoordinates?: { latitude: number; longitude: number };
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
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (socket && isConnected) {
      socket.on("rideStatus", (data: RideStatusData) => {
        console.log("Received rideStatus event:", data);
        setIsSearching(false);
        setShowVehicleSheet(false);
        setRideStatus(data);

        let notificationType: "success" | "error" | "info";
        let navigateTo: string | undefined;

        switch (data.status) {
          case "Accepted":
          dispatch(
          showRideMap({
           userPickupLocation: data.pickupCoordinates|| null,
           driverLocation: data.driverCoordinates || null,
           data: data
          })
        );
            notificationType = "success";
            navigateTo = "/ride-tracking";
            break;
          case "Failed":
            notificationType = "error";
            break;
          default:
            notificationType = "info";
        }

        dispatch(
          showNotification({
            type: notificationType,
            message: data.message || `Ride status: ${data.status}`,
            data: { rideId: data.ride_id, driverId: data.driverId },
            navigate: navigateTo,
          })
        );

        if (data.status === "Accepted" && data.driverCoordinates && userLocation) {
          fetchDriverRoute(data.driverCoordinates, {
            lat: userLocation.lat,
            lng: userLocation.lng,
          });
        }
      });

      socket.on("error", (error: { message: string; code: string }) => {
        console.error("Socket error:", error);
        setNotification({
          open: true,
          type: "error",
          title: "Error",
          message: error.message,
        });
      });
    }

    if (navigator.geolocation) {
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
          console.error("Error getting location:", error);
          setNotification({
            open: true,
            type: "error",
            title: "Location Error",
            message: "Unable to get your current location",
          });
        }
      );
    }

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

  const fetchVehicles = async (distanceInKm: number) => {
    try {
      const response = await axiosUser(dispatch).get("/vehicles");
      console.log(response.data);

      if (response.data.message === "Failed") {
        setNotification({
          open: true,
          type: "error",
          title: "Vehicle Data Error",
          message: "Could not fetch vehicle options. Please try again.",
        });
        return;
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
      console.error("Failed to fetch vehicles:", error);
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

    try {
      let originLocation: google.maps.LatLng | string = origin;
      if (origin === "Current Location" && userLocation) {
        originLocation = new google.maps.LatLng(
          userLocation.lat,
          userLocation.lng
        );
      }

      const result = await directionsService.route({
        origin: originLocation,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirections(result);

      const route = result.routes[0];
      if (route && route.legs[0]) {
        setDistanceInfo({
          distance: route.legs[0].distance?.text ?? "Unknown",
          duration: route.legs[0].duration?.text ?? "Unknown",
        });

        const distanceInMeters = route.legs[0].distance?.value ?? 0;
        const distanceInKm = distanceInMeters / 1000;

        await fetchVehicles(distanceInKm);
      }
    } catch (error) {
      console.error("Directions request failed:", error);
      setNotification({
        open: true,
        type: "error",
        title: "Route Error",
        message: "Could not calculate the route",
      });
    }
  };

const fetchDriverRoute = async (
  driverLocation: { latitude: number; longitude: number },
  pickupLocation: { lat: number; lng: number }
) => {
  console.log("driverLocation:", driverLocation);

  const directionsService = new google.maps.DirectionsService();

  try {
    const result = await directionsService.route({
      origin: {
        lat: Number(driverLocation.latitude),
        lng: Number(driverLocation.longitude),
      },
      destination: pickupLocation,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDriverDirections(result);
  } catch (error) {
    console.error("Driver route request failed:", error);
    setNotification({
      open: true,
      type: "error",
      title: "Route Error",
      message: "Could not calculate driver route",
    });
  }
};



  const handleSearchCabs = async () => {
    if ((useCurrentLocationAsPickup && !userLocation) || !destination) {
      setNotification({
        open: true,
        type: "error",
        title: "Missing Information",
        message:
          "Please enter dropoff location and ensure your current location is available",
      });
      return;
    }

    if (!useCurrentLocationAsPickup && (!origin || !destination)) {
      setNotification({
        open: true,
        type: "error",
        title: "Missing Information",
        message: "Please enter both pickup and dropoff locations",
      });
      return;
    }

    await fetchRoute();
  };

  const handleScheduleToggle = () => {
    setIsScheduled((prev) => !prev);
    if (!isScheduled) {
      setScheduledRide({ date: null, time: "" });
    }
  };

  const handleBookRide = () => {
    if (!origin || !destination || !userLocation || !selectedVehicle) {
      setNotification({
        open: true,
        type: "error",
        title: "Booking Error",
        message: "Please select a vehicle type and ensure all locations are set",
      });
      return;
    }

    if (isScheduled && (!scheduledRide.date || !scheduledRide.time)) {
      setNotification({
        open: true,
        type: "error",
        title: "Booking Error",
        message: "Please select both date and time for scheduled ride",
      });
      return;
    }

    setIsSearching(true);
    setRideStatus({
      ride_id: "",
      status: "searching",
      message: "Searching for available drivers...",
    });

    try {
      if (!socket || !isConnected) {
        throw new Error("Socket not connected");
      }

      let pickupLat = userLocation.lat;
      let pickupLng = userLocation.lng;

      if (
        directions &&
        origin !== "Current Location" &&
        directions.routes[0]?.legs[0]?.start_location
      ) {
        pickupLat = directions.routes[0].legs[0].start_location.lat();
        pickupLng = directions.routes[0].legs[0].start_location.lng();
      }

      let dropoffLat = userLocation.lat + 0.05;
      let dropoffLng = userLocation.lng + 0.05;

      if (directions && directions.routes[0]?.legs[0]?.end_location) {
        dropoffLat = directions.routes[0].legs[0].end_location.lat();
        dropoffLng = directions.routes[0].legs[0].end_location.lng();
      }

      const vehicleModel =
        vehicles.find((v) => v.id === selectedVehicle)?.name ?? "Standard";

      const bookingData = {
        pickupLocation: {
          address: origin,
          latitude: pickupLat,
          longitude: pickupLng,
        },
        dropoffLocation: {
          address: destination,
          latitude: dropoffLat,
          longitude: dropoffLng,
        },
        vehicleModel,
        isScheduled,
        scheduledDateTime: isScheduled
          ? {
              date: scheduledRide.date,
              time: scheduledRide.time,
            }
          : null,
      };

      console.log("Emitting requestRide:", bookingData);
      socket.emit("requestRide", bookingData);
    } catch (error) {
      console.error("Error booking ride:", error);
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
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-blue-800">Find Your Ride</h1>
        <p className="text-gray-600 mt-2">
          Safe, reliable rides to your destination
        </p>
      </div>

      <div className="relative">
        <div className="h-[75vh] w-full rounded-xl overflow-hidden shadow-xl">
          <GoogleMap
            center={center}
            zoom={zoom}
            mapContainerStyle={{
              width: "100%",
              height: "100%",  
            }}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
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
              <Label
                htmlFor="use-current-location"
                className="text-sm font-medium"
              >
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
                        if (originRef.current)
                          originRef.current.value = "Current Location";
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
                  (useCurrentLocationAsPickup &&
                    (!userLocation || !destination)) ||
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
          <SheetContent
            side="bottom"
            className="h-[70vh] rounded-t-xl max-w-2xl mx-auto"
          >
            <SheetHeader className="text-left mb-4">
              <SheetTitle className="text-2xl">Choose Your Ride</SheetTitle>
              {distanceInfo && (
                <div className="flex items-center gap-4 text-sm">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-800 border-blue-200"
                  >
                    Distance: {distanceInfo.distance}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-800 border-blue-200"
                  >
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
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
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
                      ? vehicles.find((v) => v.id === selectedVehicle)?.name ??
                        "Ride"
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