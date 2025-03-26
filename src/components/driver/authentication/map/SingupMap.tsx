import { useEffect, useRef } from "react";
import L from "leaflet";
import useLocalStorage from "@/hooks/useLocalStorage";
import useGeolocation from "@/hooks/useGeolocation";

export default function Map() {
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [userPosition, setUserPosition] = useLocalStorage("USER_MARKER", {
    latitude: 0,
    longitude: 0, 
  });


  const location = useGeolocation()

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(
        [userPosition.latitude, userPosition.longitude], 
        13
      );

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    setUserPosition({ ...userPosition });

    if (mapRef.current) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([location.latitude, location.longitude]);
      } else {
        userMarkerRef.current = L.marker([location.latitude, location.longitude])
          .addTo(mapRef.current).bindPopup("select your location");
      }
      mapRef.current.setView([location.latitude, location.longitude])
    }

    const el = userMarkerRef.current?.getElement();

    if(el){
        el.style.filter = "hue-rotate(120deg)"
    }


  }, [location,userPosition.latitude, userPosition.longitude]); 

  return <div id="map" style={{ height: "400px", width: "400px" }} />;
}
