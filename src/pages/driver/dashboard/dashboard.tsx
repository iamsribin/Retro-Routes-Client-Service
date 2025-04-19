import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { CircleDollarSign, Clock, MapPin, Star, Navigation2 } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DriverNavbar from '@/components/driver/dashboard/DriverNavbar';
import RideNotification from '@/components/driver/dashboard/RideNotification';
import ActiveRideMap from '@/components/driver/dashboard/ActiveRideMap';
import ApiEndpoints from "@/constants/api-end-points";
import axiosDriver from "@/services/axios/driverAxios";



const DriverDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [activeRide, setActiveRide] = useState<{
    pickup: string;
    dropoff: string;
    customerName: string;
    customerLocation: [number, number];
  } | null>(null);
  const [driverLocation, setDriverLocation] = useState<[number, number] | null>(null);
  const dispatch = useDispatch()
  const getDriverId = useCallback(() => {
    return localStorage.getItem('driverId') || '';
  }, []);

  const updateDriverLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverLocation([longitude, latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const sendDriverStatus = useCallback(async (online: boolean) => {
    if (!online) {
      setShowRideRequest(false);
      setActiveRide(null);
      return;
    }

    const driverId = getDriverId();
    if (!driverLocation || !driverId) return;

    try {
        const response = await axiosDriver(dispatch).post(
          ApiEndpoints.DRIVER_ONLINE_STATUS+ `?driverId=${driverId}`,
          {
            online,
            location: {
              longitude: driverLocation[0],
              latitude: driverLocation[1],
            },
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('Error updating driver status:', error);
      }
      
  }, [driverLocation, getDriverId]);

  useEffect(() => {
    if (isOnline) {
      updateDriverLocation();
      const interval = setInterval(updateDriverLocation, 30000); // Update every 30s
      return () => clearInterval(interval);
    }
  }, [isOnline, updateDriverLocation]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    if (isOnline) {
      ws = new WebSocket('ws://your-server-url/ride-requests');
      ws.onmessage = (event) => {
        const rideRequest = JSON.parse(event.data);
        setShowRideRequest(true);
        setActiveRide({
          pickup: rideRequest.pickup,
          dropoff: rideRequest.dropoff,
          customerName: rideRequest.customer.name,
          customerLocation: rideRequest.customer.location,
        });
      };
      ws.onclose = () => console.log('WebSocket closed');
    }
    return () => ws?.close();
  }, [isOnline]);

  const handleOnlineChange = (checked: boolean) => {
    setIsOnline(checked);
    sendDriverStatus(checked);
  };

  const handleAcceptRide = () => {
    setShowRideRequest(false);
    if (activeRide) {
      setActiveRide(activeRide); // Ensure activeRide is set
    }
  };

  const handleDeclineRide = () => {
    setShowRideRequest(false);
    setActiveRide(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DriverNavbar />
      
      <div className="flex-1 p-4 sm:p-6 md:p-8 ml-0 sm:ml-64"> {/* Added margin-left for laptop view */}
        {/* Header Section */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Driver Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Welcome back, Driver</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                <Switch
                  checked={isOnline}
                  onCheckedChange={handleOnlineChange}
                  className="data-[state=checked]:bg-emerald"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        {!activeRide && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Today's Earnings</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">₹2,450</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-emerald/10 rounded-full flex items-center justify-center">
                    <CircleDollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-emerald" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed Rides</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">8</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-wasabi/10 rounded-full flex items-center justify-center">
                    <Navigation2 className="h-5 w-5 sm:h-6 sm:w-6 text-wasabi" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Online Hours</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">6.5h</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-egyptian/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-egyptian" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rating</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">4.8</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-khaki/10 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-khaki" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Status Section */}
        {activeRide ? (
          <ActiveRideMap 
            pickup={activeRide.pickup}
            dropoff={activeRide.dropoff}
            customerName={activeRide.customerName}
            customerLocation={activeRide.customerLocation}
            driverLocation={driverLocation}
          />
        ) : showRideRequest && activeRide ? (
          <RideNotification
            customer={{
              name: activeRide.customerName,
              avatar: `https://ui-avatars.com/api/?name=${activeRide.customerName}`,
              rating: 4.83,
            }}
            ride={{
              pickup: activeRide.pickup,
              dropoff: activeRide.dropoff,
              distance: "4.5 km",
              amount: 250,
            }}
            onAccept={handleAcceptRide}
            onDecline={handleDeclineRide}
          />
        ) : isOnline ? (
          <Card className="mb-6">
            <CardContent className="py-8 sm:py-12 text-center">
              <Badge variant="secondary" className="mb-4">Online</Badge>
              <h3 className="text-lg font-semibold mb-2">Looking for rides...</h3>
              <p className="text-muted-foreground">
                Stay online to receive ride requests in your area
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="py-8 sm:py-12 text-center">
              <Badge variant="secondary" className="mb-4">Offline</Badge>
              <h3 className="text-lg font-semibold mb-2">You're currently offline</h3>
              <p className="text-muted-foreground mb-6">
                Go online to start receiving ride requests
              </p>
              <Button 
                onClick={() => setIsOnline(true)}
                className="bg-emerald hover:bg-emerald/90"
              >
                Go Online
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;