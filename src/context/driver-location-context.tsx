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
import { LocationCoordinates } from "../shared/types/commonTypes";

interface DriverLocationContextType {
  driverLocation: LocationCoordinates | null;
}

const DriverLocationContext = createContext<DriverLocationContextType>({
  driverLocation: null,
});

export const useDriverLocation = () => useContext(DriverLocationContext);

interface Props {
  children: ReactNode;
}

export const DriverLocationProvider: React.FC<Props> = ({ children }) => {
  const [driverLocation, setDriverLocation] =
    useState<LocationCoordinates | null>(null);
  const { socket, isConnected } = useSocket();

  const libraries: "places"[] = ["places"];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries,
  });

  const isOnline = useSelector((state: RootState) => state.driver.isOnline);
  const driverId = useSelector((state: RootState) => state.driver.driverId);

  useEffect(() => {
    let watchId: number;

    if (!navigator.geolocation) {
      toast({
        title: "Location Error",
        description: "Enable the location permission",
        variant: "destructive",
      });
    }
    console.log("isOnline", isOnline);
    // latitude:11.072035,
    // longitude: 76.074005,
    // 11.050994, 76.071157
    // latitude:11.050994,
    // longitude: 76.071157,

    if (isOnline && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const coords = {
    // latitude:11.050994,
    // longitude: 76.071157,
      latitude: 11.2488242,
       longitude: 75.783924
          };
          if (isLoaded) {
            const address = await geocodeLatLng(
              coords.latitude,
              coords.longitude
            );
            const fullLocation: LocationCoordinates = {
              ...coords,
              address,
            };

            setDriverLocation(fullLocation);
            console.log("driver coords", fullLocation);

            if (socket && isConnected) {
              socket.emit("driverLocation", {
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
          maximumAge: 10000,
          timeout: 10000,
        }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isOnline, socket, driverId, isConnected]);

  return (
    <DriverLocationContext.Provider value={{ driverLocation }}>
      {children}
    </DriverLocationContext.Provider>
  );
};
