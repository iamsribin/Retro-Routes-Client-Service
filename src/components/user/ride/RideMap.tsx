import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PhoneCall, MessageSquare, Navigation, Car, MapPin, Clock, Send, X } from 'lucide-react';
import { Feature, LineString, GeoJSON } from 'geojson';
import { hideRideMap } from '@/services/redux/slices/rideSlice';
import { RootState } from '@/services/redux/store';
import { useSocket } from '@/context/SocketContext';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3JpYmluIiwiYSI6ImNtOW56MnEzNDB0a3gycXNhdGppZGVjY2kifQ.e5Wf0msIvOjm7tXjFXP0dA';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Booking {
  date: string;
  distance: string;
  driver: {
    driverName: string;
    driverNumber: string;
    driverProfile: string;
    driver_id: string;
  };
  driverCoordinates: Coordinates;
  dropoffCoordinates: Coordinates;
  dropoffLocation: string;
  duration: string;
  pickupCoordinates: Coordinates;
  pickupLocation: string;
  pin: number;
  price: number;
  ride_id: string;
  status: string;
  user: {
    userName: string;
    userProfile: string;
    user_id: string;
    number: string;
  };
  vehicleModel: string;
  _id: string;
  __v: number;
}

interface DriverDetails {
  cancelledRides: number;
  color: string;
  driverId: string;
  driverImage: string;
  driverName: string;
  mobile: number;
  number: string;
  rating: number;
  vehicleModel: string;
}

interface RideStatusData {
  ride_id: string;
  status: 'searching' | 'Accepted' | 'Failed' | 'cancelled' | 'Started';
  message?: string;
  driverId?: string;
  booking?: Booking;
  driverCoordinates?: Coordinates;
  driverDetails?: DriverDetails;
}

interface Message {
  sender: 'driver' | 'user';
  content: string;
  timestamp: string;
}

const RideTrackingPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const userDriverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const userPickupMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const userDropoffMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [arrivalTime, setArrivalTime] = useState<string>('Calculating...');
  const [tripDistance, setTripDistance] = useState<string>('');
  const [isTripStarted, setIsTripStarted] = useState<boolean>(false);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'info' | 'messages'>('info');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [canCancelTrip, setCanCancelTrip] = useState<boolean>(true);
  const [cancelTimeLeft, setCancelTimeLeft] = useState<number>(30);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { isOpen, rideData } = useSelector((state: RootState) => state.RideMap);

  useEffect(() => {
    if (!isOpen || rideData?.status !== 'Accepted') {
      setCanCancelTrip(false);
      localStorage.removeItem('cancelTimerStart');
      return;
    }

    const CANCELLATION_WINDOW = 30 * 1000;
    const savedStartTime = localStorage.getItem('cancelTimerStart');

    if (savedStartTime) {
      const startTime = parseInt(savedStartTime, 10);
      const elapsedTime = Date.now() - startTime;

      if (elapsedTime >= CANCELLATION_WINDOW) {
        setCanCancelTrip(false);
        setCancelTimeLeft(0);
        localStorage.removeItem('cancelTimerStart');
        return;
      }

      const remainingTime = CANCELLATION_WINDOW - elapsedTime;
      setCancelTimeLeft(Math.ceil(remainingTime / 1000));
      setCanCancelTrip(true);
    } else {
      if (canCancelTrip) {
        const newStartTime = Date.now();
        localStorage.setItem('cancelTimerStart', newStartTime.toString());
        setCancelTimeLeft(30);
        setCanCancelTrip(true);
      }
    }

    const timer = setInterval(() => {
      const currentStartTime = localStorage.getItem('cancelTimerStart');
      if (!currentStartTime) {
        clearInterval(timer);
        setCanCancelTrip(false);
        return;
      }

      const elapsed = Date.now() - parseInt(currentStartTime, 10);
      const remaining = CANCELLATION_WINDOW - elapsed;

      if (remaining <= 0) {
        clearInterval(timer);
        setCanCancelTrip(false);
        setCancelTimeLeft(0);
        localStorage.removeItem('cancelTimerStart');
        return;
      }

      setCancelTimeLeft(Math.ceil(remaining / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, rideData?.status, canCancelTrip]);

  useEffect(() => {
    if (!isOpen) {
      navigate('/');
    }
  }, [isOpen, navigate]);

  useEffect(() => {
    if (!socket || !isConnected || !rideData) return;

    socket.on('rideStatus', (data: RideStatusData) => {
      if (data.status === 'cancelled' || data.status === 'Failed') {
        dispatch(hideRideMap());
        localStorage.removeItem('cancelTimerStart');
      } else if (data.status === 'Started') {
        setIsTripStarted(true);
        setCanCancelTrip(false);
        localStorage.removeItem('cancelTimerStart');
      }
    });

    socket.on('driverStartRide', (driverLocation: Coordinates) => {
      setIsTripStarted(true);
      setCanCancelTrip(false);
      localStorage.removeItem('cancelTimerStart');
    });

    socket.on('receiveMessage', (data: { sender: 'driver' | 'user'; message: string; timestamp: string }) => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: data.sender,
          content: data.message,
          timestamp: data.timestamp,
        },
      ]);
    });

    return () => {
      socket.off('rideStatus');
      socket.off('driverStartRide');
      socket.off('receiveMessage');
    };
  }, [socket, isConnected, dispatch, rideData]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const parseCoords = (coords: Coordinates | undefined): Coordinates | null => {
    if (!coords) return null;
    const lat = typeof coords.latitude === 'string' ? parseFloat(coords.latitude) : coords.latitude;
    const lng = typeof coords.longitude === 'string' ? parseFloat(coords.longitude) : coords.longitude;
    if (isNaN(lat) || isNaN(lng)) {
      console.warn('Invalid coordinates:', { lat, lng });
      return null;
    }
    return { latitude: lat, longitude: lng };
  };

  const createVehicleIcon = (): HTMLElement => {
    const el = document.createElement('div');
    el.className = 'vehicle-marker';
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
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1 1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    `;
    return el;
  };

  useEffect(() => {
    if (!mapContainerRef.current || !rideData || mapInstanceRef.current) return;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/navigation-day-v1',
        center: [rideData.driverCoordinates.longitude, rideData.driverCoordinates.latitude],
        zoom: 12,
        attributionControl: false,
        interactive: false, // Disable map scrolling and interaction
      });

      mapInstanceRef.current = map;

      map.on('load', () => {
        setMapReady(true);

        const driverCoords = parseCoords(rideData.driverCoordinates);
        if (driverCoords && userDriverMarkerRef.current) {
          userDriverMarkerRef.current.remove();
        }
        if (driverCoords) {
          userDriverMarkerRef.current = new mapboxgl.Marker({
            element: createVehicleIcon(),
            anchor: 'center',
          })
            .setLngLat([driverCoords.longitude, driverCoords.latitude])
            .addTo(map);
        }

        const pickupCoords = parseCoords(rideData.booking?.pickupCoordinates);
        if (!isTripStarted && pickupCoords && userPickupMarkerRef.current) {
          userPickupMarkerRef.current.remove();
        }
        if (!isTripStarted && pickupCoords) {
          userPickupMarkerRef.current = new mapboxgl.Marker({
            color: '#ef4444',
            scale: 0.8,
          })
            .setLngLat([pickupCoords.longitude, pickupCoords.latitude])
            .addTo(map);
        }

        const dropoffCoords = parseCoords(rideData.booking?.dropoffCoordinates);
        if (dropoffCoords && userDropoffMarkerRef.current) {
          userDropoffMarkerRef.current.remove();
        }
        if (dropoffCoords) {
          userDropoffMarkerRef.current = new mapboxgl.Marker({
            color: '#3b82f6',
            scale: 0.8,
          })
            .setLngLat([dropoffCoords.longitude, dropoffCoords.latitude])
            .addTo(map);
        }

        adjustMapBounds(map);
        fetchTripRoute(map);
      });

      map.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          setMapReady(false);
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [rideData, isTripStarted]);

  useEffect(() => {
    const driverCoords = parseCoords(rideData?.driverCoordinates);
    if (userDriverMarkerRef.current && driverCoords && mapInstanceRef.current && mapReady) {
      userDriverMarkerRef.current.setLngLat([driverCoords.longitude, driverCoords.latitude]);
      fetchTripRoute(mapInstanceRef.current);
    }
  }, [rideData?.driverCoordinates, mapReady]);

  const adjustMapBounds = (map: mapboxgl.Map) => {
    if (!rideData) return;

    const driverCoords = parseCoords(rideData.driverCoordinates);
    if (!driverCoords) return;

    const bounds = new mapboxgl.LngLatBounds().extend([driverCoords.longitude, driverCoords.latitude]);

    const pickupCoords = parseCoords(rideData.booking?.pickupCoordinates);
    if (!isTripStarted && pickupCoords) {
      bounds.extend([pickupCoords.longitude, pickupCoords.latitude]);
    }

    const dropoffCoords = parseCoords(rideData.booking?.dropoffCoordinates);
    if (dropoffCoords) {
      bounds.extend([dropoffCoords.longitude, dropoffCoords.latitude]);
    }

    map.fitBounds(bounds, {
      padding: { top: 50, bottom: 300, left: 50, right: 50 },
      maxZoom: 15,
    });
  };

  const fetchTripRoute = async (map: mapboxgl.Map) => {
    if (!rideData || !mapReady) return;

    try {
      const driverCoords = parseCoords(rideData.driverCoordinates);
      if (!driverCoords) return;

      let destinationCoords;
      if (!isTripStarted && rideData.booking?.pickupCoordinates) {
        const pickupCoords = parseCoords(rideData.booking.pickupCoordinates);
        if (pickupCoords) {
          destinationCoords = `${pickupCoords.longitude},${pickupCoords.latitude}`;
        }
      } else if (isTripStarted && rideData.booking?.dropoffCoordinates) {
        const dropoffCoords = parseCoords(rideData.booking.dropoffCoordinates);
        if (dropoffCoords) {
          destinationCoords = `${dropoffCoords.longitude},${dropoffCoords.latitude}`;
        }
      } else {
        return;
      }

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${driverCoords.longitude},${driverCoords.latitude};${destinationCoords}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        const durationMinutes = Math.round(route.duration / 60);
        setArrivalTime(durationMinutes <= 1 ? '1 min' : `${durationMinutes} mins`);

        const distanceKm = (route.distance / 1000).toFixed(1);
        setTripDistance(`${distanceKm} km`);

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
              'line-color': isTripStarted ? '#3b82f6' : '#10b981',
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

  const handleCancelTrip = () => {
    if (socket && isConnected && rideData) {
      socket.emit('cancelRide', { rideId: rideData.ride_id });
      dispatch(hideRideMap());
      localStorage.removeItem('cancelTimerStart');
    }
  };

  const handleCallDriver = () => {
    if (rideData?.booking?.driver.driverNumber) {
      window.open(`tel:${rideData.booking.driver.driverNumber}`);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !socket || !isConnected || !rideData) return;

    const timestamp = new Date().toISOString();
    const message: Message = {
      sender: 'user',
      content: messageInput.trim(),
      timestamp,
    };

    socket.emit('sendMessage', {
      rideId: rideData.ride_id,
      driverId: rideData.booking?.driver.driver_id,
      sender: 'user',
      message: messageInput.trim(),
      timestamp,
    });

    setChatMessages((prev) => [...prev, message]);
    setMessageInput('');
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
                <Button size="sm" variant="ghost" className="text-emerald-500 p-1 h-8">
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveSection('info')}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeSection === 'info'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Trip Info
              </button>
              <button
                onClick={() => setActiveSection('messages')}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeSection === 'messages'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Messages
              </button>
            </div>
          </CardHeader>

          <CardContent className="px-4 pb-4 space-y-4">
            {activeSection === 'info' && (
              <>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-emerald-200 flex-shrink-0">
                    <AvatarImage src={rideData.booking?.driver.driverProfile} alt={rideData.booking?.driver.driverName} />
                    <AvatarFallback className="text-sm">{rideData.booking?.driver.driverName[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{rideData.booking?.driver.driverName}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Vehicle: {rideData.booking?.vehicleModel || rideData.driverDetails?.vehicleModel}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                      onClick={() => setActiveSection('messages')}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                      onClick={handleCallDriver}
                    >
                      <PhoneCall className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {!isTripStarted && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-sm mb-3">Your Ride PIN:</h3>
                    <div className="text-2xl font-bold text-blue-700 tracking-wider mb-2 font-mono">
                      {rideData.booking?.pin}
                    </div>
                    <p className="text-xs text-gray-600">Share this PIN with your driver to start the ride</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Distance:</span>
                    <span className="font-medium">{rideData.booking?.distance || '5.2 km'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium">{rideData.booking?.duration || '15 mins'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Fare:</span>
                    <span className="font-medium">₹{rideData.booking?.price}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">PICKUP</p>
                      <p className="text-sm font-medium leading-tight">{rideData.booking?.pickupLocation || 'Current Location'}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">DROP-OFF</p>
                      <p className="text-sm font-medium leading-tight">{rideData.booking?.dropoffLocation || 'Destination'}</p>
                    </div>
                  </div>
                </div>

                {canCancelTrip && rideData?.status === 'Accepted' && (
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleCancelTrip}
                      className="flex-1 bg-red-500 hover:bg-red-600 h-12"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel Ride ({cancelTimeLeft}s)
                    </Button>
                  </div>
                )}
              </>
            )}

            {activeSection === 'messages' && (
              <div className="space-y-4">
                <div className="h-40 sm:h-48 overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-3">
                  {chatMessages.length === 0 && (
                    <p className="text-center text-gray-500 text-sm">No messages yet.</p>
                  )}
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg text-sm ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
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
                      if (e.key === 'Enter' && messageInput.trim()) {
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
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RideTrackingPage;