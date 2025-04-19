import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from "@/components/ui/card";
import { MessageSquare, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ActiveRideMapProps {
  pickup: string;
  dropoff: string;
  customerName: string;
  customerLocation: [number, number];
  driverLocation: [number, number] | null;
}

const ActiveRideMap: React.FC<ActiveRideMapProps> = ({ 
  pickup, 
  dropoff, 
  customerName,
  customerLocation,
  driverLocation,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: driverLocation || customerLocation,
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers
    if (driverLocation) {
      new mapboxgl.Marker({ color: '#10B981' })
        .setLngLat(driverLocation)
        .addTo(map.current);
    }

    new mapboxgl.Marker({ color: '#EF4444' })
      .setLngLat(customerLocation)
      .addTo(map.current);

    // Draw route if driver location is available
    if (driverLocation) {
      const getRoute = async () => {
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${driverLocation[0]},${driverLocation[1]};${customerLocation[0]},${customerLocation[1]}?geometries=geojson&access_token=${mapboxToken}`
        );
        const json = await query.json();
        const data = json.routes[0];
        const route = data.geometry.coordinates;

        map.current?.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route,
            },
          },
        });

        map.current?.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#10B981', 'line-width': 4 },
        });

        // Fit map to bounds
        const bounds = new mapboxgl.LngLatBounds();
        route.forEach((coord: [number, number]) => bounds.extend(coord));
        map.current?.fitBounds(bounds, { padding: 50 });
      };

      getRoute();
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, driverLocation, customerLocation]);

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 right-4 z-10">
        <Card className="p-4 bg-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-base sm:text-lg">{customerName}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">En route to pickup</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald" />
              <p className="flex-1 text-sm">{pickup}</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 mt-2 rounded-full bg-red-500" />
              <p className="flex-1 text-sm">{dropoff}</p>
            </div>
          </div>
        </Card>
      </div>
      <div className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-8rem)] w-full rounded-lg overflow-hidden">
        <input 
          type="text"
          placeholder="Enter your Mapbox token"
          className="absolute top-0 left-1/2 -translate-x-1/2 z-20 p-2 border rounded w-11/12 sm:w-1/2 text-sm"
          onChange={(e) => setMapboxToken(e.target.value)}
          value={mapboxToken}
        />
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
};

export default ActiveRideMap;