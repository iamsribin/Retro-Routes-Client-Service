import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "@/services/redux/store";
import { hideNotification } from "@/services/redux/slices/notificationSlice";
import { Button } from "@/components/ui/button";

const NotificationModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isOpen, type, message, data, navigate: navigateRoute } = useSelector(
    (state: RootState) => state.notification
  );

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

  const handleClose = () => {
    dispatch(hideNotification());
    
    if (navigateRoute) {
      navigate(navigateRoute);
    }
  };

  const handleCancel = () => {
    dispatch(hideNotification());
  };

  const renderContent = () => {
    if (type === "ride-accepted" && data) {
      return (
        <div className="space-y-3">
          <p className="text-base">{message}</p>
          
          {data.ride_id && (
            <div className="bg-white bg-opacity-20 p-3 rounded-md">
              <p className="text-sm font-medium">Ride ID: {data.ride_id}</p>
            </div>
          )}
          
          {data.driverDetails && (
            <div className="bg-white bg-opacity-20 p-3 rounded-md space-y-2">
              <p className="text-sm font-medium">Driver: {data.driverDetails.name}</p>
              {data.driverDetails.rating && (
                <p className="text-sm">Rating: ⭐ {data.driverDetails.rating}</p>
              )}
            </div>
          )}
          
          {data.pin && (
            <div className="bg-white bg-opacity-30 p-4 rounded-md text-center border-2 border-white border-dashed">
              <p className="text-sm font-medium mb-1">Your Ride PIN</p>
              <p className="text-2xl font-bold tracking-wider">{data.pin}</p>
              <p className="text-xs mt-1 opacity-90">Share this PIN with your driver</p>
            </div>
          )}
        </div>
      );
    }
    
    if (type === "admin-blocked" && data?.reason) {
      return (
        <div className="space-y-3">
          <p className="text-base">{message}</p>
          <div className="bg-white bg-opacity-20 p-3 rounded-md">
            <p className="text-sm font-medium">Reason: {data.reason}</p>
          </div>
        </div>
      );
    }
    
    return <p className="text-base">{message}</p>;
  };

  const renderButtons = () => {
    if (navigateRoute) {
      return (
        <div className="flex space-x-3 mt-6">
          <Button
            className="flex-1 bg-white text-black hover:bg-gray-100 font-medium"
            onClick={handleClose}
          >
            OK
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-transparent border-white text-white hover:bg-white hover:text-black"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      );
    }
    
    return (
      <Button
        className="w-full mt-6 bg-white text-black hover:bg-gray-100 font-medium"
        onClick={handleClose}
      >
        Close
      </Button>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className={`p-6 rounded-lg shadow-lg max-w-sm w-full ${getStyles()}`}>
        <div className="flex items-center justify-center mb-4">
          {type === "ride-accepted" && (
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">🚗</span>
            </div>
          )}
          {type === "admin-blocked" && (
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">⚠️</span>
            </div>
          )}
          {type === "success" && (
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">✅</span>
            </div>
          )}
          {type === "error" && (
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">❌</span>
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-bold mb-4 text-center">{getTitle()}</h2>
        
        <div className="text-center">
          {renderContent()}
        </div>
        
        {renderButtons()}
      </div>
    </div>
  );
};

export default NotificationModal;