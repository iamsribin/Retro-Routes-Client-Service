/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { toast } from "sonner";
import "./SignupMap.scss";
mapboxgl.accessToken = import.meta.env.VITE_MPBOX_ACCESS_TOKEN;

interface MapProps {
  latitude: number;
  longitude: number;
  handleGeolocation: (lat: number, lng: number, status: any) => void;
  isGeolocationActive: boolean;
}

const SignupMap = ({
  latitude,
  longitude,
  handleGeolocation,
  isGeolocationActive,
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [lng, setLng] = useState(longitude);
  const [lat, setLat] = useState(latitude);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (isGeolocationActive) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLng(longitude);
            setLat(latitude);
            setZoom(15);
            handleGeolocation(latitude, longitude, true);

            if (marker.current) {
              marker.current.setLngLat([longitude, latitude]);
            }

            if (map.current) {
              map.current.flyTo({
                center: [longitude, latitude],
                zoom: 15,
              });
            }
          },
          (error) => {
            toast.error(error.message);
          }
        );
      } else {
        toast.error("No location service");
      }
    }
  }, [isGeolocationActive, handleGeolocation]);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current || "",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    marker.current = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([lng, lat])
      .addTo(map.current);

    marker.current.on("dragend", () => {
      if (marker.current) {
        const lngLat = marker.current.getLngLat();
        const newLng = lngLat.lng;
        const newLat = lngLat.lat;

        setLng(newLng);
        setLat(newLat);
        handleGeolocation(newLat, newLng, true);
      }
    });

    map.current.on("dblclick", handleMapDoubleClick);

    map.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      setLng(lng);
      setLat(lat);
      handleGeolocation(lat, lng, true);

      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
      }
    });
  }, []);

  useEffect(() => {
    if (map.current && marker.current) {
      marker.current.setLngLat([longitude, latitude]);
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: zoom,
      });
      setLng(longitude);
      setLat(latitude);
    }
  }, [latitude, longitude]);

  const handleMapDoubleClick = (e: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = e.lngLat;
    setLng(lng);
    setLat(lat);
    setZoom(15);
    handleGeolocation(lat, lng, true);

    if (marker.current) {
      marker.current.setLngLat([lng, lat]);
    }
  };

  return <div ref={mapContainer} className="map-container" />;
};

export default SignupMap;
