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

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface DriverLocationContextType {
  driverLocation: Location | null;
}

const DriverLocationContext = createContext<DriverLocationContextType>({
  driverLocation: null,
});

export const useDriverLocation = () => useContext(DriverLocationContext);

interface Props {
  children: ReactNode;
}

export const DriverLocationProvider: React.FC<Props> = ({ children }) => {
  const [driverLocation, setDriverLocation] = useState<Location | null>(null);
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

    if (isOnline && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          if (isLoaded) {

            
            const address = await geocodeLatLng(
              coords.latitude,
              coords.longitude
            );
            const fullLocation: Location = {
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
