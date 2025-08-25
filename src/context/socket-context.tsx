import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, store } from "@/shared/services/redux/store";
import { userLogout } from "@/shared/services/redux/slices/userAuthSlice";
import { driverLogout } from "@/shared/services/redux/slices/driverAuthSlice";
import { adminLogout } from "@/shared/services/redux/slices/adminAuthSlice";
import { showNotification } from "@/shared/services/redux/slices/notificationSlice";
import { useNavigate } from "react-router-dom";
import {
  setPaymentStatus,
  showRideMap as showRideMapUser,
} from "@/shared/services/redux/slices/rideSlice";
import {
  showRideRequestNotification,
  hideRideMap as hideRideMapDriver,
  showRideMap as showRideMapDriver,
  hideRideRequestNotification,
} from "@/shared/services/redux/slices/driverRideSlice";
import {
  RideRequest,
} from "@/shared/types/driver/ridetype";
import { useLoading } from "@/shared/hooks/useLoading";
import { getItem, setItem } from "@/shared/utils/localStorage";
import { handleLogout } from "@/shared/utils/handleLogout";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = (): SocketContextType => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

const SOCKET_URL = import.meta.env.VITE_API_REALTIME_SERVICE;

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const user = useSelector((state: RootState) => state.user);
  const driver = useSelector((state: RootState) => state.driver);
  const admin = useSelector((state: RootState) => state.admin);
  const role = user.role || driver.role || admin.role;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectionInfo = useMemo(() => {
    if (role === "User") {
      return {
        id: user.user_id,
        token: getItem("token"),
        refreshToken: getItem("refreshToken"),
      };
    }
    if (role === "Driver") {
      return {
        id: driver.driverId,
        token: getItem("token"),
        refreshToken: getItem("refreshToken"),
      };
    }
    if (role === "Admin") {
      return {
        id: admin._id,
        token: getItem("token"),
        refreshToken: getItem("refreshToken"),
      };
    }
    return { id: undefined, token: null, refreshToken: null };
  }, [role, user.user_id, driver.driverId, admin._id]);

  useEffect(() => {
    const activeRoles = [user.role, driver.role, admin.role].filter(
      Boolean
    ).length;
    if (activeRoles > 1) {
      console.error("Multiple roles detected. Logging out.");
      dispatch(userLogout());
      dispatch(driverLogout());
      dispatch(adminLogout());
      navigate("/login");
      return;
    }

    if (!role || !connectionInfo.id || !SOCKET_URL || !connectionInfo.token) {
      console.warn("Missing connection details. Disconnecting socket.");
      socket?.disconnect();
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      query: {
        token: connectionInfo.token,
        refreshToken: connectionInfo.refreshToken || "",
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketInstance.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });
    setSocket(socketInstance);

    // Event handlers
    const handleConnect = () => {
      console.log(`${role} socket connected: ${connectionInfo.id}`);
      setIsConnected(true);
    };

    const handleTokensUpdated = ({
      token,
      refreshToken,
    }: {
      token: string;
      refreshToken: string;
    }) => {
      setItem("token", token);
      setItem("refreshToken", refreshToken);
      // if (role === "User") {
      // } else if (role === "Driver") {
      //   setItem("token", token);
      //   setItem("refreshToken", refreshToken);
      // } else if (role === "Admin") {
      //   setItem("token", token);
      //   setItem("refreshToken", refreshToken);
      // }
    };

    const handleError = (error: string) => {
      console.error("Socket error:", error);
      setIsConnected(false);
      dispatch(
        showNotification({ type: "error", message: `Socket error: ${error}` })
      );
    };

    const handleDisconnect = () => {
      console.log(`${role} socket disconnected: ${connectionInfo.id}`);
      setIsConnected(false);
    };

    const handleUserBlocked = () => {
      console.log(
        `User-blocked event received for ${role}: ${connectionInfo.id}`
      );
      dispatch(
        showNotification({
          type: "admin-blocked",
          message: "Your account has been blocked by an admin.",
          navigate: "/login",
        })
      );
      if (role === "User") handleLogout("User",dispatch)
      else if (role === "Driver") handleLogout("Driver",dispatch)
      else if (role === "Admin") handleLogout("Admin",dispatch)
      navigate("/login");
    };

    const handleRideCompleted = ({
      bookingId,
      userId,
      role: rideRole,
    }: any) => {
      if (rideRole === "user") {
        dispatch(setPaymentStatus("pending"));
        navigate("/payment");
      }
    };

    const handleCanceled = (data: any) => {
      if (data.user) {
        dispatch(hideRideMapDriver());
        dispatch(
          showNotification({ type: "success", message: `Ride canceled` })
        );
      } else {
        dispatch(hideRideMapDriver());
        dispatch(
          showNotification({
            type: "info",
            message: `Ride canceled by user. You're now offline. Enable online and start ride.`,
          })
        );
      }
    };

    const handleRideRequestAccept = (data: any) => {
      hideLoading();

      const latestNotificationData: RideRequest | null =
        store.getState().driverRideMap.notificationData;

      dispatch(
        showRideMapDriver({
          ...latestNotificationData,
          status: "accepted",
        } as any)
      );

      navigate("/driver/ride-tracking");
      dispatch(hideRideRequestNotification());
    };

    // add inside SocketProvider useEffect after socketInstance created:
    const handleRideRequest = (rideRequest: RideRequest) => {
      if (!rideRequest || !rideRequest.bookingDetails.bookingId) {
        dispatch(
          showNotification({
            type: "error",
            message: "Invalid ride request data",
            data: null,
            navigate: "",
          })
        );
        return;
      }

      dispatch(showRideRequestNotification(rideRequest));

      // you can also trigger sound here globally
      const audio = new Audio("/uber_tune.mp3");
      audio.play().catch(() => {});
    };

    const handleDriverAssigned = (data: any) => {
      showLoading({
        isLoading: true,
        loadingMessage: "driver accept",
        loadingType: "ride-search",
        progress: 100,
      });

      dispatch(
        showNotification({
          type: "success",
          message: data.message || `Ride status: ${data.status}`,
          data: {
            rideId: data.ride_id,
            driverId:
              data.status === "Accepted" ? data.driverDetails.driverId : null,
          },
          navigate: "/ride-tracking",
        })
      );
      dispatch(showRideMapUser(data));
      hideLoading();
    };

    const handleNoDriver = (data: any) => {
      hideLoading();
      dispatch(
        showNotification({
          type: "info",
          message: data.message,
        })
      );
    };

    // Register events
    socketInstance.on("connect", handleConnect);
    socketInstance.on("token_refreshed", handleTokensUpdated);
    socketInstance.on("error", handleError);
    socketInstance.on("disconnect", handleDisconnect);
    socketInstance.on("user-blocked", handleUserBlocked);
    socketInstance.on("rideCompleted", handleRideCompleted);
    socketInstance.on("canceled", handleCanceled);
    socketInstance.on("ride:request", handleRideRequest);
    socketInstance.on("booking:accept:result", handleRideRequestAccept);
    socketInstance.on("booking:driver:assigned", handleDriverAssigned);
    socketInstance.on("booking:no_drivers", handleNoDriver);
    // Cleanup
    return () => {
      console.log(`Cleaning up socket for ${role}: ${connectionInfo.id}`);
      socketInstance.off("connect", handleConnect);
      socketInstance.off("tokens-updated", handleTokensUpdated);
      socketInstance.off("error", handleError);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.off("user-blocked", handleUserBlocked);
      socketInstance.off("rideCompleted", handleRideCompleted);
      socketInstance.off("canceled", handleCanceled);
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [role, connectionInfo, dispatch, navigate]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
