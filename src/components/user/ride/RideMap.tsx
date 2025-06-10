import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleMap, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { useJsApiLoader } from "@react-google-maps/api";
import { MessageCircle, Phone, Clock, Car, MapPin, X, Star, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RootState } from "@/services/redux/store";
import { useSocket } from "@/context/SocketContext";
import { hideRideMap } from "@/services/redux/slices/rideSlice";

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

interface RideStatusData {
  ride_id: string;
  status: "searching" | "Accepted" | "Failed" | "cancelled" | "Started";
  message?: string;
  driverId?: string;
  booking?: Booking;
  driverCoordinates?: Coordinates;
  driverDetails?: DriverDetails;
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
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

const defaultCenter = {
  lat: 13.003371,
  lng: 77.589134,
};

const RideTrackingPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const rideMapState = useSelector((state: RootState) => state.RideMap);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [canCancel, setCanCancel] = useState<boolean>(true);
  const [estimatedArrival, setEstimatedArrival] = useState<number>(5);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>(defaultCenter);
  const [zoom, setZoom] = useState<number>(13);
  const [rideStarted, setRideStarted] = useState<boolean>(false);
  const [carIcon, setCarIcon] = useState<google.maps.Icon | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY || "",
    libraries,
  });

  // Initialize carIcon after Google Maps API is loaded
useEffect(() => {
  if (isLoaded && window.google && !carIcon) {
    setCarIcon({
      url: "https://img.icons8.com/color/48/000000/car.png",
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 20) // Center the icon
    });
  }
}, [isLoaded, carIcon]);

  const parseCoordinates = (coords: Coordinates | undefined): Coordinates | null => {
    if (!coords) return null;
    const lat = typeof coords.latitude === "string" ? parseFloat(coords.latitude) : coords.latitude;
    const lng = typeof coords.longitude === "string" ? parseFloat(coords.longitude) : coords.longitude;
    if (isNaN(lat) || isNaN(lng)) {
      console.warn("Invalid coordinates after parsing:", { lat, lng });
      return null;
    }
    return { latitude: lat, longitude: lng };
  };

  const areValidCoordinates = (coords: Coordinates | undefined): boolean => {
    const parsed = parseCoordinates(coords);
    return parsed !== null;
  };

  useEffect(() => {
    if (!rideMapState.isOpen || rideMapState.rideData?.status !== "Accepted") {
      setCanCancel(false);
      localStorage.removeItem("cancelTimerStart");
      return;
    }

    const CANCELLATION_WINDOW = 30 * 1000;
    const savedStartTime = localStorage.getItem("cancelTimerStart");

    if (savedStartTime) {
      const startTime = parseInt(savedStartTime, 10);
      const elapsedTime = Date.now() - startTime;

      if (elapsedTime >= CANCELLATION_WINDOW) {
        setCanCancel(false);
        setTimeLeft(0);
        localStorage.removeItem("cancelTimerStart");
        return;
      }

      const remainingTime = CANCELLATION_WINDOW - elapsedTime;
      setTimeLeft(Math.ceil(remainingTime / 1000));
      setCanCancel(true);
    } else {
      if (canCancel) {
        const newStartTime = Date.now();
        localStorage.setItem("cancelTimerStart", newStartTime.toString());
        setTimeLeft(30);
        setCanCancel(true);
      } else {
        return;
      }
    }

    const timer = setInterval(() => {
      const currentStartTime = localStorage.getItem("cancelTimerStart");
      if (!currentStartTime) {
        clearInterval(timer);
        setCanCancel(false);
        return;
      }

      const elapsed = Date.now() - parseInt(currentStartTime, 10);
      const remaining = CANCELLATION_WINDOW - elapsed;

      if (remaining <= 0) {
        clearInterval(timer);
        setCanCancel(false);
        setTimeLeft(0);
        localStorage.removeItem("cancelTimerStart");
        return;
      }

      setTimeLeft(Math.ceil(remaining / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [rideMapState.isOpen, rideMapState.rideData?.status, canCancel]);

  useEffect(() => {
    if (!rideMapState.isOpen) {
      navigate("/");
    }
  }, [rideMapState.isOpen, navigate]);

  useEffect(() => {
    if (mapRef.current) {
      const { offsetHeight, offsetWidth } = mapRef.current;
      console.log("Map container dimensions:", { width: offsetWidth, height: offsetHeight });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !rideMapState.rideData) {
      console.log("Map not loaded or ride data missing:", { isLoaded, rideData: rideMapState.rideData });
      return;
    }

    const driverCoords = parseCoordinates(rideMapState.rideData.driverCoordinates);
    const pickupCoords = parseCoordinates(rideMapState.rideData.booking?.pickupCoordinates);
    const dropoffCoords = parseCoordinates(rideMapState.rideData.booking?.dropoffCoordinates);

    if (!driverCoords || (!pickupCoords && !dropoffCoords)) {
      setCenter(defaultCenter);
      console.warn("Invalid coordinates, using default center:", defaultCenter);
      return;
    }

    const fetchRoute = async (origin: Coordinates, destination: Coordinates) => {
      const directionsService = new google.maps.DirectionsService();
      try {
        const result = await directionsService.route({
          origin: { lat: origin.latitude, lng: origin.longitude },
          destination: { lat: destination.latitude, lng: destination.longitude },
          travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirections(result);

        const bounds = result.routes[0].bounds;
        if (bounds) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const latDiff = Math.abs(ne.lat() - sw.lat());
          const lngDiff = Math.abs(ne.lng() - sw.lng());
          const maxDiff = Math.max(latDiff, lngDiff);
          const newZoom = Math.min(15, Math.max(10, 13 - Math.floor(Math.log2(maxDiff * 100))));
          setZoom(newZoom);
        }

        setCenter({
          lat: (origin.latitude + destination.latitude) / 2,
          lng: (origin.longitude + destination.longitude) / 2,
        });
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    if (rideStarted && dropoffCoords) {
      fetchRoute(driverCoords, dropoffCoords);
    } else if (pickupCoords) {
      fetchRoute(driverCoords, pickupCoords);
    }
  }, [
    isLoaded,
    rideMapState.rideData,
    rideMapState.rideData?.driverCoordinates,
    rideMapState.rideData?.booking?.pickupCoordinates,
    rideMapState.rideData?.booking?.dropoffCoordinates,
    rideStarted,
  ]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("rideStatus", (data: RideStatusData) => {
      console.log("Socket rideStatus data:", data);
      if (data.status === "cancelled" || data.status === "Failed") {
        dispatch(hideRideMap());
        localStorage.removeItem("cancelTimerStart");
      } else if (data.status === "Started") {
        setRideStarted(true);
        setCanCancel(false);
        localStorage.removeItem("cancelTimerStart");
      }
    });

    socket.on("driverStartRide", (driverLocation: Coordinates) => {
      console.log("driverStartRide driverLocation:", driverLocation);
      setRideStarted(true);
      setCanCancel(false);
      localStorage.removeItem("cancelTimerStart");
      const driverCoords = parseCoordinates(driverLocation);
      if (driverCoords && rideMapState.rideData?.booking?.dropoffCoordinates) {
        const dropoffCoords = parseCoordinates(rideMapState.rideData.booking.dropoffCoordinates);
        if (dropoffCoords) {
          setCenter({
            lat: (driverCoords.latitude + dropoffCoords.latitude) / 2,
            lng: (driverCoords.longitude + dropoffCoords.longitude) / 2,
          });
        }
      }
    });

    return () => {
      socket.off("rideStatus");
      socket.off("driverStartRide");
    };
  }, [socket, isConnected, dispatch, rideMapState.rideData]);

  const handleCancelRide = () => {
    if (socket && isConnected && rideMapState.rideData) {
      socket.emit("cancelRide", { rideId: rideMapState.rideData.ride_id });
      dispatch(hideRideMap());
      localStorage.removeItem("cancelTimerStart");
    }
  };

  const handleCallDriver = () => {
    if (rideMapState.rideData?.booking?.driver.driverNumber) {
      window.open(`tel:${rideMapState.rideData.booking.driver.driverNumber}`);
    }
  };

  const handleMessageDriver = () => {
    console.log("Opening chat with driver...");
    // Implement messaging functionality
  };

  if (!rideMapState.isOpen || !rideMapState.rideData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    console.log("Google Maps API not loaded. Load error:", loadError);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map... {loadError ? `Error: ${loadError.message}` : ""}</p>
        </div>
      </div>
    );
  }

  const { rideData } = rideMapState;
  const driver = rideData.booking?.driver;
  const driverDetails = rideData.driverDetails;
  const driverCoords = parseCoordinates(rideData.driverCoordinates);
  const pickupCoords = parseCoordinates(rideData.booking?.pickupCoordinates);
  const dropoffCoords = parseCoordinates(rideData.booking?.dropoffCoordinates);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {rideStarted ? "Ride in Progress" : "Driver Found"}
              </h1>
              <p className="text-sm text-gray-600">Arriving in {estimatedArrival} minutes</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            ID: {rideData.ride_id.slice(0, 8)}
          </Badge>
        </div>
      </div>

      <div className="bg-white shadow-md px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Navigation className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {rideStarted ? "En route to destination" : "Driver is on the way"}
              </p>
              <p className="text-sm text-gray-600">{estimatedArrival} mins away</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{rideStarted ? "Dropoff at" : "Pickup at"}</p>
            <p className="font-medium text-gray-900 text-sm max-w-32 truncate">
              {rideStarted ? rideData.booking?.dropoffLocation : rideData.booking?.pickupLocation}
            </p>
          </div>
        </div>
      </div>

      <div
        ref={mapRef}
        className="relative w-full h-[50vh] rounded-xl overflow-hidden shadow-xl bg-gray-200"
      >
        {isLoaded ? (
          <>
            <GoogleMap
              center={center}
              zoom={zoom}
              mapContainerStyle={mapContainerStyle}
              options={mapOptions}
            >
              {driverCoords && (
                <Marker
                  position={{
                    lat: driverCoords.latitude,
                    lng: driverCoords.longitude,
                  }}
                  icon={carIcon}
                  label="Driver"
                />
              )}
              {!rideStarted && pickupCoords && (
                <Marker
                  position={{
                    lat: pickupCoords.latitude,
                    lng: pickupCoords.longitude,
                  }}
                  label="Pickup"
                />
              )}
              {rideStarted && dropoffCoords && (
                <Marker
                  position={{
                    lat: dropoffCoords.latitude,
                    lng: dropoffCoords.longitude,
                  }}
                  label="Dropoff"
                />
              )}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-600">
                {driverCoords && (rideStarted ? dropoffCoords : pickupCoords)
                  ? "Live driver tracking"
                  : "Waiting for valid location data"}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">Loading map...</p>
          </div>
        )}
      </div>

      <div className="bg-white px-4 py-6 space-y-6">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={driver?.driverProfile}
                  alt={driver?.driverName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/api/placeholder/64/64";
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{driver?.driverName}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">
                      {driverDetails?.rating || "4.8"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {rideData.booking?.vehicleModel || driverDetails?.vehicleModel} •{" "}
                  {driverDetails?.color || "White"}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  Vehicle #{driverDetails?.number || "KA01AB1234"}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-12 h-12 rounded-full p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                  onClick={handleMessageDriver}
                >
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                </Button>
                <Button
                  size="sm"
                  className="w-12 h-12 rounded-full p-0 bg-green-500 hover:bg-green-600"
                  onClick={handleCallDriver}
                >
                  <Phone className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {!rideStarted && (
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mb-3">
                  <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Your Ride PIN</p>
                </div>
                <div className="text-4xl font-bold text-blue-700 tracking-wider mb-2 font-mono">
                  {rideData.booking?.pin}
                </div>
                <p className="text-xs text-gray-600">Share this PIN with your driver to start the ride</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Car className="w-5 h-5 mr-2 text-blue-600" />
              Trip Details
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 mb-1">Pickup</p>
                  <p className="font-medium text-gray-900 text-sm leading-tight">
                    {rideData.booking?.pickupLocation || "Current Location"}
                  </p>
                </div>
              </div>
              <div className="border-l-2 border-dashed border-gray-300 ml-1.5 h-4"></div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 mb-1">Dropoff</p>
                  <p className="font-medium text-gray-900 text-sm leading-tight">
                    {rideData.booking?.dropoffLocation || "Destination"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Distance</p>
                  <p className="font-semibold text-gray-900">{rideData.booking?.distance || "5.2 km"}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-900">{rideData.booking?.duration || "15 mins"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {canCancel && rideMapState.rideData?.status === "Accepted" && (
          <Card className="border-red-200 bg-red-50 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Cancel ride</p>
                    <p className="text-sm text-red-600">Available for {timeLeft} seconds</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancelRide}
                  className="bg-red-600 hover:bg-red-700 shadow-sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RideTrackingPage;