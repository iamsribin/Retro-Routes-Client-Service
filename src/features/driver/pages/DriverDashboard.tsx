import React, { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "@/shared/components/ui/switch";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@chakra-ui/react";
import DriverNavbar from "../components/DriverNavbar";
// import { useSocket } from "@/context/socket-context";
import { RootState } from "@/shared/services/redux/store";
// import { setOnline } from "@/shared/services/redux/slices/driverAuthSlice";
import { CircleDollarSign, Clock, Navigation2, Star } from "lucide-react";
import { showNotification } from "@/shared/services/redux/slices/notificationSlice";
import { useLoading } from "@/shared/hooks/useLoading";
import { postData } from "@/shared/services/api/api-service";
import DriverApiEndpoints from "@/constants/driver-api-end-pontes";
import { ResponseCom } from "@/shared/types/commonTypes";
import { useNotification } from "@/shared/hooks/useNotificatiom";

const DriverDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  // const { socket, isConnected } = useSocket();
  const { showLoading, hideLoading } = useLoading();
  const { onNotification, offNotification } = useNotification();
  

  const driverId = useSelector((state: RootState) => state.user.id);
  const isOnline = useSelector((state: RootState) => state.user.isOnline);
  const isOpen = useSelector((state: RootState) => state.driverRideMap.isOpen);
  const rideData = useSelector((state: RootState) => state.driverRideMap.rideData);

  const OnlineTimestamp = useSelector(
    (state: RootState) => state.user.OnlineTimestamp
  );

// hideLoading(); 

  const handleOnlineChange = useCallback(
    async (checked: boolean) => {
      if(rideData){
onNotification("alert", "You can't go offline while you're on a ride.");
      return;
      }
      showLoading({
        isLoading: true,
        loadingMessage: "please wait updating your online status",
        loadingType: "default",
      });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const request = {
                       online: checked,
                driverId,
                onlineTimestamp: OnlineTimestamp,
                location: {
                  lat: latitude,
                  lng: longitude,
                },
            }
            try {
              const data = await postData<ResponseCom["data"]>(DriverApiEndpoints.HANDLE_ONLINE_CHANGE,request)
                // const { data } = await axiosDriver.post("/handle-online-change", {
                //            online: checked,
                // driverId,
                // onlineTimestamp: OnlineTimestamp,
                // location: {
                //   lat: latitude,
                //   lng: longitude,
                // }
                // });

              if (data.status === 200) {
                // if (!checked) {
                //   if (socket && isConnected) {
                //     socket.emit("driverOffline", { driverId: socket.id });
                //   }
                // }
                // dispatch(setOnline({ onlineStatus: checked }));
              }
            } catch (err) {
              console.error("Failed to update status", err);
              dispatch(
                showNotification({
                  type: "error",
                  message: "Failed to update driver status",
                  data: null,
                  navigate: "",
                })
              );
            } finally {
              hideLoading();
            }
          },
          (error) => {
            hideLoading()
            console.error("Location access denied or error", error);
            dispatch(
              showNotification({
                type: "error",
                message: "Please enable location access",
                data: null,
                navigate: "",
              })
            );
          }
        );
      } else {
        hideLoading();
        dispatch(
          showNotification({
            type: "error",
            message: "Geolocation is not supported by your browser",
            data: null,
            navigate: "",
          })
        );
      }
    },
    [dispatch,OnlineTimestamp]
  );

  // const handleAcceptRide = useCallback(() => {
  //   if (socket && activeRide && isConnected) {
  //     socket.emit(`rideResponse:${activeRide.ride.rideId}`, {
  //       requestId: activeRide.requestId,
  //       rideId: activeRide.ride.rideId,
  //       accepted: true,
  //       bookingId: activeRide.booking.bookingId,
  //       estimateTime: activeRide.booking.rideDetails.estimatedDuration,
  //       timestamp: new Date().toISOString(),
  //     });

  //     activeRide.status = "accepted";
  //     setShowRideRequest(false);
  //     dispatch(showRideMap(activeRide));
  //     navigate("/driver/rideTracking");

  //     if (timeoutRef.current) clearInterval(timeoutRef.current);

  //     toast({
  //       title: "Ride Accepted",
  //       description: "Navigate to pickup location.",
  //       variant: "default",
  //     });
  //   } else {
  //     toast({
  //       title: "Error",
  //       description: "Unable to accept ride. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // }, [socket, activeRide, isConnected, dispatch, navigate, toast]);

  // const handleDeclineRide = useCallback(() => {
  //   if (socket && activeRide && isConnected) {
  //     socket.emit(`rideResponse:${activeRide.ride.rideId}`, {
  //       requestId: activeRide.requestId,
  //       rideId: activeRide.ride.rideId,
  //       accepted: false,
  //       timestamp: new Date().toISOString(),
  //     });

  //     socket.emit("cancelRide", {
  //       bookingId: activeRide.booking.bookingId,
  //       reason: "Driver declined",
  //     });

  //     setShowRideRequest(false);
  //     setActiveRide(null);

  //     if (timeoutRef.current) clearInterval(timeoutRef.current);

  //     toast({
  //       title: "Ride Declined",
  //       description: "You have declined the ride request.",
  //       variant: "destructive",
  //     });
  //   }
  // }, [socket, activeRide, isConnected, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DriverNavbar />
      <div className="flex-1 p-4 sm:p-6 md:p-8 ml-0 sm:ml-64">
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Driver Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">Welcome back, Driver</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium ${
                  isOnline ? "text-emerald-500" : "text-gray-500"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
              <Switch
                checked={isOnline}
                onCheckedChange={handleOnlineChange}
                className="data-[state=checked]:bg-emerald-500"
                // disabled={!isConnected && isOnline}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Today's Earnings
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">₹2,450</h3>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-emerald-50 rounded-full flex items-center justify-center">
                  <CircleDollarSign
                    className="h-5 w-5 sm:h-

6 sm:w-6 text-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed Rides
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">8</h3>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-wasabi-50 rounded-full flex items-center justify-center">
                  <Navigation2 className="h-5 w-5 sm:h-6 sm:w-6 text-wasabi-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Online Hours
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">6.5h</h3>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-egyptian-50 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-egyptian-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Rating
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">4.8</h3>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-khaki-50 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-khaki-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* {showRideRequest && activeRide && (
          <RideNotification
            customer={{
              id: activeRide.customer.id,
              name: activeRide.customer.name,
              profileImageUrl: activeRide.customer.profileImageUrl,
            }}
            pickup={activeRide.pickup}
            dropoff={activeRide.dropoff}
            ride={activeRide.ride}
            booking={activeRide.booking}
            timeLeft={timeLeft}
            requestTimeout={activeRide.requestTimeout}
            onAccept={handleAcceptRide}
            onDecline={handleDeclineRide}
          />
        )} */}

        {!isOpen && isOnline && (
          <Card className="mb-6">
            <CardContent className="py-8 sm:py-12 text-center">
              <Badge
                variant="secondary"
                className="mb-4 bg-emerald-50 text-emerald-500"
              >
                Online
              </Badge>
              <h3 className="text-lg font-semibold mb-2">
                Looking for rides...
              </h3>
              <p className="text-muted-foreground">
                Stay online to receive ride requests in your area
              </p>
            </CardContent>
          </Card>
        )}

        {!isOpen && !isOnline && (
          <Card className="mb-6">
            <CardContent className="py-8 sm:py-12 text-center">
              <Badge variant="secondary" className="mb-4">
                Offline
              </Badge>
              <h3 className="text-lg font-semibold mb-2">
                You're currently offline
              </h3>
              <p className="text-muted-foreground mb-6">
                Go online to start receiving ride requests
              </p>
              <Button
                onClick={() => handleOnlineChange(true)}
                className="bg-emerald-500 hover:bg-emerald-600"
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
