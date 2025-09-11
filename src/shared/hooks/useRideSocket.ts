import { useEffect } from "react";
import { useSocket } from "@/context/socket-context";
import { hideRideMap, updateRideStatus, addChatMessage } from "@/shared/services/redux/slices/driverRideSlice";
import { toast } from "sonner";
import { Message } from "@/shared/types/commonTypes";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RideRequest } from "../types/driver/ridetype";

const useRideSocket = (
  rideData: RideRequest | null,
  activeSection: "info" | "messages",
  setUnreadCount: (count: number | ((prev: number) => number)) => void
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !rideData) return;

    const handleRideStatus = (data: {
      requestId: string;
      status: "accepted" | "started" | "completed" | "cancelled" | "failed";
      userId: string;
    }) => {
      if (data.requestId === rideData.bookingDetails.bookingId) {
        if (data.status === "cancelled" || data.status === "failed" || data.status === "completed") {
          dispatch(hideRideMap());
          navigate("/driver/dashboard");
          toast.info(`Ride ${data.status}`);
        } else {
          dispatch(
            updateRideStatus({
              bookingId: data.requestId,
              status: data.status,
            })
          );
        }
      }
    };

    const handleReceiveMessage = (data: {
      sender: "driver" | "user";
      message: string;
      timestamp: string;
      type: "text" | "image";
      fileUrl?: string;
    }) => {
      const message: Message = {
        sender: data.sender,
        content: data.message,
        timestamp: data.timestamp,
        type: data.type,
        fileUrl: data.fileUrl,
      };
      dispatch(
        addChatMessage({
          bookingId: rideData.bookingDetails.bookingId,
          message,
        })
      );
      if (activeSection !== "messages") {
        setUnreadCount((prev) => prev + 1);
      }
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      toast.error("Lost connection to server. Please check your network.");
    };

    socket.on("rideStatus", handleRideStatus);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("rideStatus", handleRideStatus);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket, isConnected, activeSection, dispatch, rideData, navigate, setUnreadCount]);
};

export default useRideSocket;