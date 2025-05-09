// ```typescript
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PhoneCall, MessageSquare, Navigation, MapPin } from 'lucide-react';
import { Feature, LineString, GeoJSON } from 'geojson';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3JpYmluIiwiYSI6ImNtOW56MnEzNDB0a3gycXNhdGppZGVjY2kifQ.e5Wf0msIvOjm7tXjFXP0dA';

interface ActiveRideMapProps {
  booking: {
    ride_id: string;
    user_id: string;
    pickupCoordinates: { latitude: number; longitude: number };
    dropoffCoordinates: { latitude: number; longitude: number };
    pickupLocation: string;
    dropoffLocation: string;
    distance: string;
    vehicleModel: string;
    price: number;
    status: string;
    pin: number;
    _id: string;
    date: string;
  };
  driverLocation: { latitude: number; longitude: number };
  customer: {
    name: string;
    avatar: string;
    rating: number;
  };
  onArrived: () => void;
  onCancelRide: () => void;
}

const ActiveRideMap: React.FC<ActiveRideMapProps> = ({
  booking,
  driverLocation,
  customer,
  onArrived,
  onCancelRide,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const pickupMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [eta, setEta] = useState<string>('Calculating...');
  const [routeDistance, setRouteDistance] = useState<string>('');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [driverLocation.longitude, driverLocation.latitude],
      zoom: 14,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    driverMarkerRef.current = new mapboxgl.Marker({ color: '#10b981' })
      .setLngLat([driverLocation.longitude, driverLocation.latitude])
      .addTo(map);

    pickupMarkerRef.current = new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat([booking.pickupCoordinates.longitude, booking.pickupCoordinates.latitude])
      .addTo(map);

    map.on('load', () => {
      updateRoute(map);

      const bounds = new mapboxgl.LngLatBounds()
        .extend([driverLocation.longitude, driverLocation.latitude])
        .extend([booking.pickupCoordinates.longitude, booking.pickupCoordinates.latitude]);

      map.fitBounds(bounds, { padding: 100 });
    });

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (driverMarkerRef.current && driverLocation) {
      driverMarkerRef.current.setLngLat([driverLocation.longitude, driverLocation.latitude]);

      if (mapRef.current && mapRef.current.loaded()) {
        updateRoute(mapRef.current);
      }
    }
  }, [driverLocation]);

  const updateRoute = async (map: mapboxgl.Map) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${driverLocation.longitude},${driverLocation.latitude};${booking.pickupCoordinates.longitude},${booking.pickupCoordinates.latitude}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        const durationMinutes = Math.round(route.duration / 60);
        setEta(durationMinutes <= 1 ? '1 min' : `${durationMinutes} mins`);

        const distanceKm = (route.distance / 1000).toFixed(1);
        setRouteDistance(`${distanceKm} km`);

        const routeSource = map.getSource('route');
        const routeData: Feature<LineString> = {
          type: 'Feature',
          properties: {},
          geometry: route.geometry as LineString,
        };

        if (routeSource) {
          (routeSource as mapboxgl.GeoJSONSource).setData(routeData);
        } else {
          map.addSource('route', {
            type: 'geojson',
            data: routeData as GeoJSON,
          });

          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#10b981',
              'line-width': 6,
              'line-opacity': 0.8,
            },
          });
        }
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 min-h-[400px]" ref={mapContainerRef} />

      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Pickup: {eta}</span>
            <Button size="sm" variant="ghost" className="text-emerald-500">
              <Navigation className="h-4 w-4 mr-1" /> Navigate
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12 border-2 border-emerald-200">
              <AvatarImage src={customer.avatar} alt={customer.name} />
              <AvatarFallback>{customer.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="font-medium">{customer.name}</p>
              <p className="text-sm text-gray-500">PIN: {booking.pin}</p>
            </div>

            <div className="flex gap-2">
              <Button size="icon" variant="outline" className="rounded-full h-10 w-10">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full h-10 w-10">
                <PhoneCall className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">PICKUP</p>
                <p className="text-sm font-medium">{booking.pickupLocation}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={onCancelRide}
              variant="outline"
              className="flex-1"
            >
              Cancel Ride
            </Button>
            <Button
              onClick={onArrived}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              I've Arrived
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveRideMap;