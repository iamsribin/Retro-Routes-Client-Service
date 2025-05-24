import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/services/redux/store";
import { hideNotification } from "@/services/redux/slices/notificationSlice";
import { Button } from "@/components/ui/button";

const NotificationModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, type, message, data } = useSelector((state: RootState) => state.notification);

  if (!isOpen) return null;

  const getStyles = () => {
    switch (type) {
      case "success":
      case "ride-accepted":
        return "bg-green-500 text-white";
      case "error":
      case "admin-blocked":
        return "bg-red-500 text-white";
      case "alert":
        return "bg-yellow-500 text-black";
      case "info":
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getTitle = () => {
    switch (type) {
      case "ride-accepted":
        return "Ride Accepted!";
      case "admin-blocked":
        return "Account Blocked";
      case "success":
        return "Success";
      case "error":
        return "Error";
      case "alert":
        return "Alert";
      case "info":
      default:
        return "Information";
    }
  };

  const renderContent = () => {
    if (type === "ride-accepted" && data) {
      return (
        <div>
          <p>{message}</p>
          <p>Ride ID: {data.rideId}</p>
          <p>Passenger: {data.passengerName}</p>
        </div>
      );
    }
    return <p>{message}</p>;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`p-6 rounded-lg shadow-lg max-w-sm w-full ${getStyles()}`}>
        <h2 className="text-xl font-bold mb-4">{getTitle()}</h2>
        {renderContent()}
        <Button
          className="mt-4 bg-white text-black"
          onClick={() => dispatch(hideNotification())}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default NotificationModal;