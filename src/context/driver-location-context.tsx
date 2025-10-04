import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/shared/services/redux/store";
import { toast } from "@/shared/hooks/use-toast";
import { useSocket } from "@/context/socket-context";
import { geocodeLatLng } from "@/shared/utils/locationToAddress";
import { useJsApiLoader } from "@react-google-maps/api";
import { Coordinates } from "../shared/types/commonTypes";

interface DriverLocationContextType {
  driverLocation: Coordinates | null;
}

const DriverLocationContext = createContext<DriverLocationContextType>({
  driverLocation: null,
});

export const useDriverLocation = () => useContext(DriverLocationContext);

interface Props {
  children: ReactNode;
}

export const DriverLocationProvider: React.FC<Props> = ({ children }) => {
  const [driverLocation, setDriverLocation] = useState<Coordinates | null>(
    null
  );
  const { socket, isConnected } = useSocket();

  const libraries: "places"[] = ["places"];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries,
  });

  const isOnline = useSelector((state: RootState) => state.driver.isOnline);
  const driverId = useSelector((state: RootState) => state.driver.driverId);
  const rideData = useSelector(
    (state: RootState) => state.driverRideMap.rideData
  );
  const role = useSelector((state: RootState) => state.driver.role);

  useEffect(() => {
    let watchId: number;

    if (!navigator.geolocation) {
      toast({
        title: "Location Error",
        description: "Enable the location permission",
        variant: "destructive",
      });
    }

    if (isOnline && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const coords = {
          latitude: position.coords.latitude, 
          longitude: position.coords.longitude,
          // latitude:11.050929,
          // longitude:76.071014 
          };
          if (isLoaded) {
          //  11.050929, 76.071014
            // const address = await geocodeLatLng(
            //   coords.latitude,
            //   coords.longitude
            // );
            // const fullLocation: Coordinates = {
            //   ...coords,
            // };

            setDriverLocation(coords);
            console.log("driver coords", coords);

            if (socket && isConnected && rideData) {
              socket.emit("location:update:ride_driver", {
                driverId,
                userId:rideData.customer.userId,
                ...coords,
              });
            }else if (socket && isConnected) {
              socket.emit("location:update", {
                driverId,
                ...coords,
              });
            }
          }
        },
        (error) => {
          console.error("Error watching location:", error);
          toast({
            title: "Location Error",
            description:
              "Unable to fetch your location. Please enable location services.",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          // maximumAge: 10000,
          // timeout: 10000,
        }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isOnline, socket, driverId, isConnected]);

  useEffect(() => {
    if (isOnline && socket && role === "Driver") {
      const interval = setInterval(() => {
        socket.emit("ping");
      }, 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [isOnline, socket, role]);

  return (
    <DriverLocationContext.Provider value={{ driverLocation }}>
      {children}
    </DriverLocationContext.Provider>
  );
}; 
