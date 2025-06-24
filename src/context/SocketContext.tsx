import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/services/redux/store";
import { userLogout } from "@/services/redux/slices/userAuthSlice";
import { driverLogout } from "@/services/redux/slices/driverAuthSlice";
import { adminLogout } from "@/services/redux/slices/adminAuthSlice";
import { showNotification } from "@/services/redux/slices/notificationSlice";
import { useNavigate } from "react-router-dom";

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

const SOCKET_URL = import.meta.env.VITE_API_GATEWAY_URL_SOCKET;

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, driver, admin, role } = useSelector((state: RootState) => ({
    user: state.user,
    driver: state.driver,
    admin: state.admin,
    role: state.user.role || state.driver.role || state.admin.role,
  }));

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const activeRoles = [user.role, driver.role, admin.role].filter(Boolean).length;
    if (activeRoles > 1) {
      console.error("Multiple roles detected. Logging out.");
      dispatch(userLogout());
      dispatch(driverLogout());
      dispatch(adminLogout());
      navigate("/login");
      return;
    }

    let id: string | undefined;
    let token: string | null = null;
    let refreshToken: string | null = null;

    if (role === "User") {
      id = user.user_id;
      token = localStorage.getItem("userToken");
      refreshToken = localStorage.getItem("refreshToken");
    } else if (role === "Driver") {
      id = driver.driverId;
      token = localStorage.getItem("driverToken");
      refreshToken = localStorage.getItem("DriverRefreshToken");
    } else if (role === "Admin") {
      id = admin._id;
      token = localStorage.getItem("adminToken");
      refreshToken = localStorage.getItem("adminRefreshToken");
    }

    if (!id || !role || !SOCKET_URL || !token) {
      console.warn("Missing id, role, SOCKET_URL, or token. Disconnecting socket.");
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      query: { token, refreshToken },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(`${role} socket connected: ${id}`);
      setIsConnected(true);
      newSocket.emit("register", { userId: id, role });
    });

    newSocket.on("tokens-updated", ({ token, refreshToken }) => {
      console.log("Tokens updated:", { role, token, refreshToken });
      if (role === "User") {
        localStorage.setItem("userToken", token);
        localStorage.setItem("refreshToken", refreshToken);
      } else if (role === "Driver") {
        localStorage.setItem("driverToken", token);
        localStorage.setItem("DriverRefreshToken", refreshToken);
      } else if (role === "Admin") {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminRefreshToken", refreshToken);
      }
    });

    newSocket.on("error", (error: string) => {
      console.error("Socket error:", error);
      setIsConnected(false);
      dispatch(showNotification({ type: "error", message: `Socket error: ${error}` }));
    });

    newSocket.on("disconnect", () => {
      console.log(`${role} socket disconnected: ${id}`);
      setIsConnected(false);
    });

    newSocket.on("user-blocked", () => {
      console.log(`User-blocked event received for ${role}: ${id}`);
      dispatch(
        showNotification({
          type: "admin-blocked",
          message: "Your account has been blocked by an admin.",
          navigate: "/login",
        })
      );
      if (role === "User") {
        dispatch(userLogout());
      } else if (role === "Driver") {
        dispatch(driverLogout());
      } else if (role === "Admin") {
        dispatch(adminLogout());
      }
      navigate("/login");
    });

    return () => {
      console.log(`Cleaning up socket for ${role}: ${id}`);
      newSocket.off("connect");
      newSocket.off("tokens-updated");
      newSocket.off("error");
      newSocket.off("user-blocked");
      newSocket.off("rideStatus");
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user.user_id, driver.driverId, admin._id, role, dispatch, navigate]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};