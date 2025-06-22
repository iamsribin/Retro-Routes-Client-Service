import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PhoneCall,
  MessageSquare,
  Navigation,
  Car,
  Clock,
  Send,
  X,
  Image,
  Camera,
} from "lucide-react";
import { Feature, LineString } from "geojson";
import { hideRideMap } from "@/services/redux/slices/driverRideSlice";
import { RootState } from "@/services/redux/store";
import { useSocket } from "@/context/SocketContext";
import driverAxios from "@/services/axios/driverAxios";
import { toast } from "sonner";
import Webcam from "react-webcam";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESSTOKEN;

const videoConstraints = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: "environment",
};

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Customer {
  id: string;
  name: string;
  profileImageUrl: string;
}

interface Ride {
  rideId: string;
  securityPin: string;
  estimatedDistance: string;
  estimatedDuration: string;
  fareAmount: number;
  vehicleType: string;
}

interface Booking {
  bookingId: string;
}

interface RideData {
  customer: Customer;
  ride: Ride;
  booking: Booking;
  pickup: Coordinates;
  dropoff: Coordinates;
}

interface Message {
  sender: "driver" | "user";
  content: string;
  timestamp: string;
  type: "text" | "image";
  fileUrl?: string;
}

const ActiveRideMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const pickupMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const dropoffMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam | null>(null);

  const [arrivalTime, setArrivalTime] = useState<string>("Calculating...");
  const [tripDistance, setTripDistance] = useState<string>("");
  const [isTripStarted, setIsTripStarted] = useState<boolean>(false);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<"info" | "messages">("info");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<"camera" | "file" | null>(null);
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");
  const [driverLocation, setDriverLocation] = useState<Coordinates | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { isOpen, rideData } = useSelector((state: RootState) => state.driverRideMap);

  const formik = useFormik<{
    selectedImage: string | File | null;
  }>({
    initialValues: {
      selectedImage: null,
    },
    onSubmit: async (values, { resetForm }) => {
      if (!socket || !isConnected || !rideData || !values.selectedImage) return;

      try {
        let file: File;
        if (typeof values.selectedImage === "string") {
          const response = await fetch(values.selectedImage);
          const blob = await response.blob();
          file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
        } else {
          file = values.selectedImage;
        }

        const formData = new FormData();
        formData.append("file", file);

        const data = await driverAxios(dispatch).post("/uploadChatFile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (data.data.fileUrl) {
          const timestamp = new Date().toISOString();
          socket.emit("sendMessage", {
            rideId: rideData.ride.rideId,
            sender: "driver",
            message: "",
            timestamp,
            userId: rideData.customer.id,
            type: "image",
            fileUrl: data.data.fileUrl,
          });

          setChatMessages((prev) => [
            ...prev,
            {
              sender: "driver",
              content: "",
              timestamp,
              type: "image",
              fileUrl: data.data.fileUrl,
            },
          ]);

          toast.success("Image sent successfully");
          resetForm();
          setImageSource(null);
        } else {
          toast.error("Failed to upload image");
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      navigate("/driver/dashboard");
    }
  }, [isOpen, navigate]);

  useEffect(() => {
    let watchId: number;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting initial location:", error);
          setDriverLocation({ latitude: 9.9516447, longitude: 76.3100864 });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error watching location:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
      );
    } else {
      setDriverLocation({ latitude: 9.9516447, longitude: 76.3100864 });
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    if (!socket || !isConnected || !rideData) return;

    socket.on("receiveMessage", (data: {
      sender: "driver" | "user";
      message: string;
      timestamp: string;
      type: "text" | "image";
      fileUrl?: string;
    }) => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: data.sender,
          content: data.message,
          timestamp: data.timestamp,
          type: data.type,
          fileUrl: data.fileUrl,
        },
      ]);
      if (activeSection !== "messages") {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, isConnected, activeSection, rideData]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const parseCoords = (coords: Coordinates | undefined): Coordinates | null => {
    if (!coords) return null;
    const lat = typeof coords.latitude === "string" ? parseFloat(coords.latitude) : coords.latitude;
    const lng = typeof coords.longitude === "string" ? parseFloat(coords.longitude) : coords.longitude;
    if (isNaN(lat) || isNaN(lng)) {
      console.warn("Invalid coordinates:", { lat, lng });
      return null;
    }
    return { latitude: lat, longitude: lng };
  };

  const createVehicleIcon = (): HTMLElement => {
    const el = document.createElement("div");
    el.className = "vehicle-marker";
    el.innerHTML = `
      <div style="
        width: 32px;
        height: 32px;
        background: #10b981;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v1c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    `;
    return el;
  };

  useEffect(() => {
    if (!mapContainerRef.current || !driverLocation || !rideData || mapInstanceRef.current) return;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/navigation-day-v1",
        center: [driverLocation.longitude, driverLocation.latitude],
        zoom: 12,
        attributionControl: false,
        interactive: false,
      });

      mapInstanceRef.current = map;

      map.on("load", () => {
        setMapReady(true);

        if (driverMarkerRef.current) {
          driverMarkerRef.current.remove();
        }
        driverMarkerRef.current = new mapboxgl.Marker({
          element: createVehicleIcon(),
          anchor: "center",
        })
          .setLngLat([driverLocation.longitude, driverLocation.latitude])
          .addTo(map);

        const pickupCoords = parseCoords(rideData.pickup);
        if (!isTripStarted && pickupCoords && pickupMarkerRef.current) {
          pickupMarkerRef.current.remove();
        }
        if (!isTripStarted && pickupCoords) {
          pickupMarkerRef.current = new mapboxgl.Marker({
            color: "#ef4444",
            scale: 0.8,
          })
            .setLngLat([pickupCoords.longitude, pickupCoords.latitude])
            .addTo(map);
        }

        const dropoffCoords = parseCoords(rideData.dropoff);
        if (dropoffCoords && dropoffMarkerRef.current) {
          dropoffMarkerRef.current.remove();
        }
        if (dropoffCoords) {
          dropoffMarkerRef.current = new mapboxgl.Marker({
            color: "#3b82f6",
            scale: 0.8,
          })
            .setLngLat([dropoffCoords.longitude, dropoffCoords.latitude])
            .addTo(map);
        }

        adjustMapBounds(map);
        fetchTripRoute(map);
      });

      map.on("error", (e) => {
        console.error("Mapbox error:", e);
      });

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          setMapReady(false);
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [driverLocation, rideData, isTripStarted]);

  useEffect(() => {
    if (driverMarkerRef.current && driverLocation && mapInstanceRef.current && mapReady) {
      driverMarkerRef.current.setLngLat([driverLocation.longitude, driverLocation.latitude]);
      fetchTripRoute(mapInstanceRef.current);
    }
  }, [driverLocation, mapReady]);

  const adjustMapBounds = (map: mapboxgl.Map) => {
    if (!driverLocation || !rideData) return;

    const bounds = new mapboxgl.LngLatBounds().extend([driverLocation.longitude, driverLocation.latitude]);

    const pickupCoords = parseCoords(rideData.pickup);
    if (!isTripStarted && pickupCoords) {
      bounds.extend([pickupCoords.longitude, pickupCoords.latitude]);
    }

    const dropoffCoords = parseCoords(rideData.dropoff);
    if (dropoffCoords) {
      bounds.extend([dropoffCoords.longitude, dropoffCoords.latitude]);
    }

    map.fitBounds(bounds, {
      padding: { top: 50, bottom: 300, left: 50, right: 50 },
      maxZoom: 15,
    });
  };

  const fetchTripRoute = async (map: mapboxgl.Map) => {
    if (!driverLocation || !rideData || !mapReady) return;

    try {
      let destinationCoords;
      if (!isTripStarted && rideData.pickup) {
        const pickupCoords = parseCoords(rideData.pickup);
        if (pickupCoords) {
          destinationCoords = `${pickupCoords.longitude},${pickupCoords.latitude}`;
        }
      } else if (isTripStarted && rideData.dropoff) {
        const dropoffCoords = parseCoords(rideData.dropoff);
        if (dropoffCoords) {
          destinationCoords = `${dropoffCoords.longitude},${dropoffCoords.latitude}`;
        }
      } else {
        return;
      }

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${driverLocation.longitude},${driverLocation.latitude};${destinationCoords}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        const durationMinutes = Math.round(route.duration / 60);
        setArrivalTime(durationMinutes <= 1 ? "1 min" : `${durationMinutes} mins`);

        const distanceKm = (route.distance / 1000).toFixed(1);
        setTripDistance(`${distanceKm} km`);

        const routeSource = map.getSource("route");
        const routeData: Feature<LineString> = {
          type: "Feature",
          properties: {},
          geometry: route.geometry as LineString,
        };

        if (routeSource) {
          (routeSource as mapboxgl.GeoJSONSource).setData(routeData);
        } else {
          map.addSource("route", {
            type: "geojson",
            data: routeData,
          });

          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": isTripStarted ? "#3b82f6" : "#10b981",
              "line-width": 5,
              "line-opacity": 0.8,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const handlePinSubmit = () => {
    if (!rideData) return;

    const correctPin = rideData.ride.securityPin.toString();

    if (enteredPin === correctPin) {
      setPinError("");
      setIsTripStarted(true);

      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.remove();
        pickupMarkerRef.current = null;
      }

      if (socket && isConnected && driverLocation) {
        socket.emit("rideStarted", {
          bookingId: rideData.booking.bookingId,
          userId: rideData.customer.id,
          driverLocation,
        });
      }

      if (mapInstanceRef.current && mapReady) {
        setTimeout(() => {
          adjustMapBounds(mapInstanceRef.current!);
          fetchTripRoute(mapInstanceRef.current!);
        }, 500);
      }
    } else {
      setPinError("Invalid PIN. Please try again.");
    }
  };

  const handleCompleteRide = () => {
    if (socket && rideData && isConnected) {
      socket.emit("rideCompleted", {
        bookingId: rideData.booking.bookingId,
      });
    }
    dispatch(hideRideMap());
    navigate("/driver/dashboard");
  };

  const handleCallCustomer = () => {
    // Implement call functionality if customer number is available
    // Example: window.open(`tel:${rideData.customer.number}`);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !socket || !isConnected || !rideData) return;

    const timestamp = new Date().toISOString();

    socket.emit("sendMessage", {
      rideId: rideData.ride.rideId,
      sender: "driver",
      message: messageInput.trim(),
      timestamp,
      userId: rideData.customer.id,
      type: "text",
    });

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "driver",
        content: messageInput.trim(),
        timestamp,
        type: "text",
      },
    ]);

    setMessageInput("");
  };

  const startCamera = () => {
    setIsCameraOpen(true);
    toast.info("Camera opened successfully");
  };

  const stopCamera = () => {
    setIsCameraOpen(false);
  };

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageDataUrl = webcamRef.current.getScreenshot();
      if (imageDataUrl) {
        formik.setFieldValue("selectedImage", imageDataUrl);
        setImageSource("camera");
        setIsCameraOpen(false);
      } else {
        toast.error("Failed to capture image. Please try again.");
      }
    }
  }, [formik]);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    formik.setFieldValue("selectedImage", file);
    setImageSource("file");
    event.target.value = "";
  };

  const clearImageSelection = () => {
    if (typeof formik.values.selectedImage !== "string" && formik.values.selectedImage) {
      URL.revokeObjectURL(URL.createObjectURL(formik.values.selectedImage));
    }
    formik.setFieldValue("selectedImage", null);
    setImageSource(null);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  if (!rideData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p>Loading ride data...</p>
        </div>
      </div>
    );
  }

  const getTripTitle = () => {
    return isTripStarted ? `Drop-off: ${arrivalTime}` : `Pickup: ${arrivalTime}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="relative flex-1 min-h-0">
        <div ref={mapContainerRef} className="w-full h-full" />
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 bg-white shadow-lg max-h-[50vh] overflow-y-auto">
        <Card className="border-0 rounded-t-xl shadow-none">
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-base sm:text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isTripStarted ? (
                  <Car className="h-4 w-4 text-blue-500" />
                ) : (
                  <Clock className="h-4 w-4 text-emerald-500" />
                )}
                <span className="truncate">{getTripTitle()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{tripDistance}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-emerald-500 p-1 h-8"
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveSection("info")}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeSection === "info"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Trip Info
              </button>
              <button
                onClick={() => {
                  setActiveSection("messages");
                  setUnreadCount(0);
                }}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeSection === "messages"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Messages
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </CardHeader>
<CardContent className="px-4 pb-4 space-y-4">
  {activeSection === "info" && (
    <>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-emerald-200 flex-shrink-0">
          <AvatarImage src={rideData.customer.profileImageUrl} alt={rideData.customer.name} />
          <AvatarFallback className="text-sm">{rideData.customer.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm sm:text-base truncate">{rideData.customer.name}</p>
          <p className="text-xs sm:text-sm text-gray-500">Vehicle: {rideData.ride.vehicleType}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full h-8 w-8 sm:h-10 sm:w-10 relative"
            onClick={() => {
              setActiveSection("messages");
              setUnreadCount(0);
            }}
            aria-label={`Messages with ${unreadCount} unread messages`}
          >
            <MessageSquare className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
            onClick={handleCallCustomer}
          >
            <PhoneCall className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isTripStarted && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-sm mb-3">Enter 6-digit PIN to start ride:</h3>
          <div className="flex gap-2 mb-3 items-center">
            <Input
              type="text"
              placeholder="Enter PIN"
              value={enteredPin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setEnteredPin(value);
                setPinError("");
              }}
              className="w-32 text-center text-lg font-mono"
              maxLength={6}
            />
            <Button
              onClick={handlePinSubmit}
              className="bg-green-600 hover:bg-green-700 h-10 px-2"
              disabled={enteredPin.length !== 6}
            >
              Start Ride
            </Button>
          </div>
          {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Distance:</span>
          <span className="font-medium">{rideData.ride.estimatedDistance}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Duration:</span>
          <span className="font-medium">{rideData.ride.estimatedDuration}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Fare:</span>
          <span className="font-medium">₹{rideData.ride.fareAmount}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-3 items-start">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">PICKUP</p>
            <p className="text-sm font-medium leading-tight">{rideData.pickup.address || "Pickup Location"}</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">DROP-OFF</p>
            <p className="text-sm font-medium leading-tight">{rideData.dropoff.address || "Drop-off Location"}</p>
          </div>
        </div>
      </div>

      {isTripStarted && (
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleCompleteRide}
            className="flex-1 bg-blue-500 hover:bg-blue-600 h-12"
          >
            Complete Ride
          </Button>
        </div>
      )}
    </>
  )}
  {activeSection === "messages" && (
    <div className="space-y-4">
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg p-6 w-full max-w-sm">
            <Button
              onClick={stopCamera}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full rounded-lg"
              onUserMediaError={(error) => {
                console.error("Webcam error:", error);
                toast.error("Failed to access camera. Please check permissions and try again.");
                stopCamera();
              }}
            />
            <div className="flex justify-center gap-2 mt-3">
              <Button
                onClick={captureImage}
                className="bg-blue-600 hover:bg-blue-600"
              >
                Capture
              </Button>
            </div>
          </div>
        </div>
      )}
      {formik.values.selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <form onSubmit={formik.handleSubmit}>
            <div className="relative bg-white rounded-lg p-6 w-full max-w-sm">
              <Button
                onClick={clearImageSelection}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
              <img
                src={
                  typeof formik.values.selectedImage === "string"
                    ? formik.values.selectedImage
                    : URL.createObjectURL(formik.values.selectedImage)
                }
                alt="Preview"
                className="w-full rounded-lg max-h-[50vh] object-contain"
              />
              <div className="flex justify-center gap-2 mt-3">
                {imageSource === "camera" && (
                  <Button
                    type="button"
                    onClick={() => {
                      clearImageSelection();
                      startCamera();
                    }}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Retake
                  </Button>
                )}
                {imageSource === "file" && (
                  <Button
                    type="button"
                    onClick={triggerFileInput}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Choose Another
                  </Button>
                )}
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={formik.isSubmitting}
                >
                  Send
                </Button>
              </div>
            </div>
          </form>
          <input
            ref={fileInputRef}
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      )}
      <div className="h-40 sm:h-48 overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-3">
        {chatMessages.length === 0 && (
          <p className="text-center text-gray-500 text-sm">No messages yet.</p>
        )}
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "driver" ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[70%]">
              {message.type === "text" && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.sender === "driver" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "driver" ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
              {message.type === "image" && message.fileUrl && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={message.fileUrl}
                    alt="Shared content"
                    className="max-w-[200px] h-auto rounded-lg"
                  />
                  <p
                    className={`text-xs mt-1 text-right ${
                      message.sender === "driver" ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex gap-2">
        <Input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-10"
          onKeyPress={(e) => {
            if (e.key === "Enter" && messageInput.trim()) {
              handleSendMessage();
            }
          }}
        />
        <Button
          onClick={handleSendMessage}
          className="h-10 bg-green-600 hover:bg-green-700"
          disabled={!messageInput.trim() || !isConnected}
        >
          <Send className="h-4 w-4" />
        </Button>
        <Button
          onClick={startCamera}
          className="h-10 w-10 bg-blue-600 hover:bg-blue-700 p-0"
          disabled={!!formik.values.selectedImage || isCameraOpen}
        >
          <Camera className="h-4 w-4" />
        </Button>
        <div className="relative">
          <Button
            asChild
            variant="ghost"
            className="h-10 w-10 p-0"
            disabled={!!formik.values.selectedImage || isCameraOpen}
          >
            <label htmlFor="file-input">
              <Image className="h-4 w-4" />
              <span className="sr-only">Choose image</span>
            </label>
          </Button>
          <input
            ref={fileInputRef}
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
            disabled={!!formik.values.selectedImage || isCameraOpen}
          />
        </div>
      </div>
    </div>
  )}
</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActiveRideMap;