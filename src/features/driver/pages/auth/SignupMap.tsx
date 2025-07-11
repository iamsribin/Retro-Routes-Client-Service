import { useEffect, useRef } from "react";
import L from "leaflet";
import useLocalStorage from "@/shared/hooks/useLocalStorage";
import { MapProps } from "../../components/auth/type";

export default function SignupMap({ latitude, longitude, onLocationChange }: MapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const userMarkerRef = useRef<L.Marker | null>(null);

    const [userPosition, setUserPosition] = useLocalStorage("USER_MARKER", {
        latitude: latitude,
        longitude: longitude,
    });

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map("map").setView(
                [latitude, longitude],
                4
            );

            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapRef.current);

            mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng;
                setUserPosition({ latitude: lat, longitude: lng });
                onLocationChange(lat, lng, true);
            });
        }
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            if (userMarkerRef.current) {
                userMarkerRef.current.setLatLng([latitude, longitude]);
            } else {
                userMarkerRef.current = L.marker([latitude, longitude])
                    .addTo(mapRef.current)
                    .bindPopup("Select your location");
            }
            mapRef.current.setView([latitude, longitude]);

            const el = userMarkerRef.current?.getElement();
            if (el) {
                el.style.filter = "hue-rotate(120deg)";
            }

            setUserPosition({ latitude, longitude });
            onLocationChange(latitude, longitude, true);
        }
    }, [latitude, longitude]);

    return <div id="map" style={{ height: "400px", width: "400px" }} />;
}