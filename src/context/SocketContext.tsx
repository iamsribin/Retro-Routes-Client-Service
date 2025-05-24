import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/services/redux/store';
import { userLogout } from '@/services/redux/slices/userAuthSlice';
import { driverLogout } from '@/services/redux/slices/driverAuthSlice';
import { showNotification } from '@/services/redux/slices/notificationSlice';

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
  console.log("=========socket===========");

  const dispatch = useDispatch<AppDispatch>();
  const { user, driver, role } = useSelector((state: RootState) => ({
    user: state.user,
    driver: state.driver,
    role: state.user.role || state.driver.role,
  }));

  console.log("SocketProvider role====", role);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Ensure only one role is active
    if (user.role && driver.role) {
      console.error('Multiple roles detected. Logging out.');
      dispatch(userLogout());
      dispatch(driverLogout());
      return;
    }

    const id = role === 'User' ? user.user_id : driver.driverId;

    if (!id || !role || !SOCKET_URL) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = role === 'User' ? localStorage.getItem('userToken') : localStorage.getItem('driverToken');
    const refreshToken = role === 'User' ? localStorage.getItem('refreshToken') : localStorage.getItem('DriverRefreshToken');
    console.log("token==", token);
    console.log("refresh", refreshToken);

    const newSocket = io(SOCKET_URL, {
      query: { token, refreshToken },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log(`${role} socket connected: ${id}`);
      setIsConnected(true);
    });

    newSocket.on('tokens-updated', ({ token, refreshToken }) => {
      if (role === 'User') {
        localStorage.setItem('userToken', token);
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        localStorage.setItem('driverToken', token);
        localStorage.setItem('DriverRefreshToken', refreshToken);
      }
    });

    newSocket.on('error', (error: string) => {
      console.error('Socket error:', error);
      setIsConnected(false);
      dispatch(showNotification({ type: "error", message: `Socket error: ${error}` }));
    });

    newSocket.on('disconnect', () => {
      console.log(`${role} socket disconnected: ${id}`);
      setIsConnected(false);
    });

    newSocket.on("accepted-ride",(data)=>{
      console.log("accepted ride context");
      
      dispatch(
        showNotification({
          type: "ride-accepted",
          message: "Your ride has been accepted by a driver!",
          data: { rideId: data.rideId, passengerName: data.passengerName },
        })
      );      
    })

    newSocket.on('user-blocked', () => {
       dispatch(
        showNotification({
          type: "admin-blocked",
          message: "Your account has been blocked by an admin.",
        })
      );
      dispatch(role === 'User' ? userLogout() : driverLogout());
    });

    return () => {
      newSocket.off('connect');
      newSocket.off('tokens-updated');
      newSocket.off('error');
      newSocket.off('user-blocked');
      newSocket.off('disconnect');
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user.user_id, driver.driverId, role, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};