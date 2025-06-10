
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PhoneCall, MessageSquare, Navigation, Car, MapPin, Clock } from 'lucide-react';
import { Feature, LineString, GeoJSON } from 'geojson';
import { hideRideMap } from '@/services/redux/slices/driverRideSlice';
import { RootState } from "@/services/redux/store";
import { useSocket } from '@/context/SocketContext';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3JpYmluIiwiYSI6ImNtOW56MnEzNDB0a3gycXNhdGppZGVjY2kifQ.e5Wf0msIvOjm7tXjFXP0dA';

const ActiveRideMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const pickupMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const dropoffMarkerRef = useRef<mapboxgl.Marker | null>(null);
  
  const [eta, setEta] = useState<string>('Calculating...');
  const [routeDistance, setRouteDistance] = useState<string>('');
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [rideStarted, setRideStarted] = useState<boolean>(false);
  const [driverBearing, setDriverBearing] = useState<number>(0);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { isOpen, rideData } = useSelector((state: RootState) => state.driverRideMap);

  console.log("active ride===", { isOpen, rideData });

  useEffect(() => {
    if (!isOpen) {
      navigate('/driver/dashboard');
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
          const { latitude, longitude, heading } = position.coords;
          const newLocation = { latitude, longitude };
          
          if (heading !== null && !isNaN(heading)) {
            setDriverBearing(heading);
          }
          
          setDriverLocation(newLocation);
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

  const createCarIcon = (bearing: number = 0): HTMLElement => {
    const el = document.createElement('div');
    el.className = 'car-marker';
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
        transform: rotate(${bearing}deg);
        transition: transform 0.3s ease;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1 1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    `;
    return el;
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !driverLocation || !rideData || mapRef.current) return;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/navigation-day-v1',
        center: [driverLocation.longitude, driverLocation.latitude],
        zoom: 12,
        attributionControl: false
      });

      mapRef.current = map;

      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      map.on('load', () => {
        setMapLoaded(true);
        
        // Add driver marker with car icon
        if (driverMarkerRef.current) {
          driverMarkerRef.current.remove();
        }
        driverMarkerRef.current = new mapboxgl.Marker({
          element: createCarIcon(driverBearing),
          anchor: 'center'
        })
          .setLngLat([driverLocation.longitude, driverLocation.latitude])
          .addTo(map);

        // Add pickup marker only if ride hasn't started
        if (!rideStarted) {
          if (pickupMarkerRef.current) {
            pickupMarkerRef.current.remove();
          }
          pickupMarkerRef.current = new mapboxgl.Marker({ 
            color: '#ef4444',
            scale: 0.8
          })
            .setLngLat([rideData.pickup.longitude, rideData.pickup.latitude])
            .addTo(map);
        }

        // Add dropoff marker
        if (rideData.dropoff && dropoffMarkerRef.current) {
          dropoffMarkerRef.current.remove();
        }
        if (rideData.dropoff) {
          dropoffMarkerRef.current = new mapboxgl.Marker({ 
            color: '#3b82f6',
            scale: 0.8
          })
            .setLngLat([rideData.dropoff.longitude, rideData.dropoff.latitude])
            .addTo(map);
        }

        // Fit bounds to show all markers
        fitMapBounds(map);
        
        // Update route
        updateRoute(map);
      });

      map.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [driverLocation, rideData, rideStarted]);

  // Update driver marker position and rotation
  useEffect(() => {
    if (driverMarkerRef.current && driverLocation && mapRef.current && mapLoaded) {
      driverMarkerRef.current.setLngLat([driverLocation.longitude, driverLocation.latitude]);
      
      const element = driverMarkerRef.current.getElement();
      const carIcon = element.querySelector('div') as HTMLElement;
      if (carIcon) {
        carIcon.style.transform = `rotate(${driverBearing}deg)`;
      }
      
      updateRoute(mapRef.current);
    }
  }, [driverLocation, driverBearing, mapLoaded]);

  const fitMapBounds = (map: mapboxgl.Map) => {
    if (!driverLocation || !rideData) return;

    const bounds = new mapboxgl.LngLatBounds()
      .extend([driverLocation.longitude, driverLocation.latitude]);

    if (!rideStarted && rideData.pickup) {
      bounds.extend([rideData.pickup.longitude, rideData.pickup.latitude]);
    }

    if (rideData.dropoff) {
      bounds.extend([rideData.dropoff.longitude, rideData.dropoff.latitude]);
    }

    map.fitBounds(bounds, { 
      padding: { top: 50, bottom: 300, left: 50, right: 50 },
      maxZoom: 15
    });
  };

  const updateRoute = async (map: mapboxgl.Map) => {
    if (!driverLocation || !rideData || !mapLoaded) return;

    try {
      let destinationCoords;
      
      if (!rideStarted) {
        destinationCoords = `${rideData.pickup.longitude},${rideData.pickup.latitude}`;
      } else if (rideStarted && rideData.dropoff) {
        destinationCoords = `${rideData.dropoff.longitude},${rideData.dropoff.latitude}`;
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
              'line-color': rideStarted ? '#3b82f6' : '#10b981',
              'line-width': 5,
              'line-opacity': 0.8,
            },
          });
        }
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const handlePinSubmit = () => {
    if (!rideData) return;
    
    const correctPin = rideData.ride.securityPin.toString();
    
    if (enteredPin === correctPin) {
      setPinError('');
      setRideStarted(true);
      
      // Remove pickup marker when ride starts
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.remove();
        pickupMarkerRef.current = null;
      }

      if (socket && isConnected) {
        socket.emit("rideStarted", {
          bookingId: rideData.booking.bookingId,
          userId: rideData.customer.id,
          driverLocation:driverLocation,
        });
      }

      if (mapRef.current && mapLoaded) {
        setTimeout(() => {
          fitMapBounds(mapRef.current!);
          updateRoute(mapRef.current!);
        }, 500);
      }

    } else {
      setPinError('Invalid PIN. Please try again.');
    }
  };

  const handleCompleteRide = () => {
    if (socket && rideData && isConnected) {
      socket.emit("rideCompleted", {
        bookingId: rideData.booking.bookingId,
      });
    }
    dispatch(hideRideMap());
    navigate('/driver/dashboard');
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

  const getStatusTitle = () => {
    return rideStarted ? `Drop-off: ${eta}` : `Pickup: ${eta}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Map Container */}
      <div className="relative flex-1 min-h-0">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {/* Loading indicator */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Card */}
      <div className="flex-shrink-0 bg-white shadow-lg max-h-[50vh] overflow-y-auto">
        <Card className="border-0 rounded-t-xl shadow-none">
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-base sm:text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                {rideStarted ? (
                  <Car className="h-4 w-4 text-blue-500" />
                ) : (
                  <Clock className="h-4 w-4 text-emerald-500" />
                )}
                <span className="truncate">{getStatusTitle()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{routeDistance}</span>
                <Button size="sm" variant="ghost" className="text-emerald-500 p-1 h-8">
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-4 pb-4 space-y-4">
            {/* Customer Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-emerald-200 flex-shrink-0">
                <AvatarImage src={rideData.customer.profileImageUrl || ''} alt={rideData.customer.name} />
                <AvatarFallback className="text-sm">{rideData.customer.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base truncate">{rideData.customer.name}</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Vehicle: {rideData.ride.vehicleType}
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Button size="icon" variant="outline" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                  <PhoneCall className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* PIN Verification Section */}
            {!rideStarted && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-sm mb-3">Enter 6-digit PIN to start ride:</h3>
                <div className="flex gap-2 mb-3 items-center">
                  <Input
                    type="text"
                    placeholder="Enter PIN"
                    value={enteredPin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setEnteredPin(value);
                      setPinError('');
                    }}
                    className="w-32 text-center text-lg font-mono"
                    maxLength={6}
                  />
                  <Button 
                    onClick={handlePinSubmit}
                    className="bg-emerald-500 hover:bg-emerald-600 h-10 px-4"
                    disabled={enteredPin.length !== 6}
                  >
                    Start Ride
                  </Button>
                </div>
                {pinError && (
                  <p className="text-red-500 text-sm">{pinError}</p>
                )}
              </div>
            )}

            {/* Trip Details */}
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

            {/* Location Details */}
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">PICKUP</p>
                  <p className="text-sm font-medium leading-tight">{rideData.pickup.address}</p>
                </div>
              </div>

              {rideData.dropoff && (
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium">DROP-OFF</p>
                    <p className="text-sm font-medium leading-tight">{rideData.dropoff.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {rideStarted && (
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleCompleteRide}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 h-12"
                >
                  Complete Ride
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActiveRideMap;