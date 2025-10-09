import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  User,
  Wallet,
  MapPin,
  FileText,
  LogOut,
  LayoutDashboard,
  Bell,
  Navigation,
  AlertCircle,
  X,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/shared/components/ui/navigation-menu";
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@/shared/utils/handleLogout";
import { RootState } from "@/shared/services/redux/store";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "warning" | "success";
  isRead: boolean;
}

const DriverNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);

  const rideData = useSelector((state: RootState) => state.driverRideMap.rideData);
  const paymentStatus = useSelector((state: RootState) => state.driverRideMap.paymentStatus);

  // Dummy notifications
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Ride Request",
      message: "You have a new ride request from downtown area",
      timestamp: "2 min ago",
      type: "info",
      isRead: false,
    },
    {
      id: "2",
      title: "Payment Received",
      message: "₹450 has been credited to your wallet",
      timestamp: "15 min ago",
      type: "success",
      isRead: false,
    },
    {
      id: "3",
      title: "Document Expiring",
      message: "Your driver's license will expire in 30 days",
      timestamp: "1 hour ago",
      type: "warning",
      isRead: true,
    },
    {
      id: "4",
      title: "Weekly Earnings",
      message: "You've earned ₹12,500 this week. Great job!",
      timestamp: "3 hours ago",
      type: "success",
      isRead: true,
    },
    {
      id: "5",
      title: "Rating Update",
      message: "Your rating has improved to 4.8 stars",
      timestamp: "5 hours ago",
      type: "info",
      isRead: true,
    },
    {
      id: "6",
      title: "Bonus Alert",
      message: "Complete 5 more rides to unlock ₹500 bonus",
      timestamp: "1 day ago",
      type: "info",
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayNotifications = notifications.slice(0, 5);
  const hasMore = notifications.length > 5;
  const isPaymentPending = paymentStatus === "pending" || paymentStatus === "failed";

  // Blinking effect for active ride button
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (rideData) {
      interval = setInterval(() => {
        setIsPulsing(prev => !prev);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [rideData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  const logoutHandle = () => {
    handleLogout("Driver", dispatch);
  };

  const handleRideMapNavigation = () => {
    navigate("/driver/ride-tracking");
  };

  const handlePaymentNavigation = () => {
    navigate("/driver/payment");
  };

  const handleNotificationClick = (notificationId: string) => {
    console.log("Notification clicked:", notificationId);
    setIsNotificationOpen(false);
  };

  const handleSeeAllNotifications = () => {
    navigate("/notifications");
    setIsNotificationOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-600";
      case "warning":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const linkStyles = (isActive: boolean) => `
    flex items-center p-3 w-full rounded-lg transition-colors
    ${
      isActive
        ? "bg-blue-100 text-blue-600 font-semibold"
        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
    }
  `;

  return (
    <>
      {/* Status Bar - Desktop/Laptop View */}
      {(rideData || isPaymentPending) && (
        <div className="hidden sm:block fixed top-0 left-64 right-0 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 z-30 shadow-sm">
          <div className="px-6 py-3 flex items-center justify-end space-x-3">
            {rideData && (
              <button
                onClick={handleRideMapNavigation}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                  isPulsing 
                    ? 'bg-green-500 shadow-lg shadow-green-500/30 scale-105' 
                    : 'bg-green-600 shadow-md scale-100'
                }`}
              >
                <Navigation size={18} className="text-white" />
                <span className="text-white font-semibold">Go to Ride Map</span>
                <span className={`w-2.5 h-2.5 rounded-full ml-1 ${
                  isPulsing ? 'bg-white shadow-lg' : 'bg-green-200'
                } transition-all duration-300`} />
              </button>
            )}

            {isPaymentPending && (
              <button
                onClick={handlePaymentNavigation}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 font-medium text-sm transition-all duration-300 shadow-lg shadow-amber-500/30 hover:scale-105"
              >
                <AlertCircle size={18} className="text-white" />
                <span className="text-white font-semibold">
                  {paymentStatus === "failed" ? "Payment Failed" : "Payment Pending"}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Sidebar */}
      <div className={`fixed bottom-0 left-0 right-0 sm:right-auto sm:bottom-auto sm:top-0 sm:h-screen sm:w-64 bg-white shadow-lg sm:shadow-xl p-4 z-20 border-r border-gray-200`}>
        {/* Desktop Header with Notification */}
        <div className="hidden sm:flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Driver Menu</h2>
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 hover:bg-blue-50 rounded-full transition-all duration-200 group"
            >
              <Bell className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Desktop Notification Dropdown - Fixed positioning */}
            {isNotificationOpen && (
              <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-base">Notifications</h3>
                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {displayNotifications.length > 0 ? (
                    displayNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`px-5 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                          !notification.isRead ? 'bg-blue-50/50 hover:bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2.5 rounded-lg ${getNotificationIcon(notification.type)} flex-shrink-0`}>
                            <Bell className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-gray-900">
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1.5 font-medium">
                              {notification.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-8 text-center text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  )}
                </div>

                {hasMore && (
                  <button
                    onClick={handleSeeAllNotifications}
                    className="w-full px-5 py-3.5 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-200"
                  >
                    See All Notifications
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu orientation="vertical" className="w-full">
          <NavigationMenuList className="flex flex-row sm:flex-col justify-around sm:justify-start sm:space-y-2 w-full">
            {/* Mobile Notification Icon */}
            <NavigationMenuItem className="w-full sm:hidden">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="flex items-center justify-center p-3 w-full hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-6 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            </NavigationMenuItem>

            <NavigationMenuItem className="w-full">
              <NavLink
                to="/driver/dashboard"
                className={({ isActive }) => linkStyles(isActive)}
              >
                <LayoutDashboard className="mr-0 sm:mr-3 h-5 w-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="w-full">
              <NavLink
                to="/driver/profile"
                className={({ isActive }) => linkStyles(isActive)}
              >
                <User className="mr-0 sm:mr-3 h-5 w-5" />
                <span className="hidden sm:inline">Profile</span>
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="w-full">
              <NavLink
                to="/driver/wallet"
                className={({ isActive }) => linkStyles(isActive)}
              >
                <Wallet className="mr-0 sm:mr-3 h-5 w-5" />
                <span className="hidden sm:inline">Wallet</span>
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="w-full">
              <NavLink
                to="/driver/trips"
                className={({ isActive }) => linkStyles(isActive)}
              >
                <MapPin className="mr-0 sm:mr-3 h-5 w-5" />
                <span className="hidden sm:inline">My Trips</span>
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="w-full">
              <NavLink
                to="/driver/documents"
                className={({ isActive }) => linkStyles(isActive)}
              >
                <FileText className="mr-0 sm:mr-3 h-5 w-5" />
                <span className="hidden sm:inline">Documents</span>
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="w-full hidden sm:block">
              <button
                onClick={logoutHandle}
                className="flex items-center p-3 w-full hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-left text-gray-600"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Logout</span>
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Status Buttons */}
        {(rideData || isPaymentPending) && (
          <div className="sm:hidden mt-4 pt-4 border-t border-gray-200 space-y-2">
            {rideData && (
              <button
                onClick={handleRideMapNavigation}
                className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm w-full transition-all duration-300 ${
                  isPulsing 
                    ? 'bg-green-500 shadow-lg shadow-green-500/40 scale-105' 
                    : 'bg-green-600 shadow-md scale-100'
                }`}
              >
                <Navigation size={18} className="text-white" />
                <span className="text-white font-semibold">Ride Map</span>
                <span className={`w-2 h-2 rounded-full ${
                  isPulsing ? 'bg-white' : 'bg-green-200'
                } transition-colors duration-300`} />
              </button>
            )}

            {isPaymentPending && (
              <button
                onClick={handlePaymentNavigation}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 font-medium text-sm w-full transition-all duration-300 shadow-lg shadow-amber-500/30"
              >
                <AlertCircle size={18} className="text-white" />
                <span className="text-white font-semibold">
                  {paymentStatus === "failed" ? "Payment Failed" : "Payment Pending"}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Notification Modal */}
      {isNotificationOpen && (
        <div className="sm:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsNotificationOpen(false)}>
          <div 
            className="fixed bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
              <h3 className="font-bold text-gray-800 text-base">Notifications</h3>
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {displayNotifications.length > 0 ? (
                displayNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`px-5 py-4 border-b border-gray-100 active:bg-gray-100 transition-colors ${
                      !notification.isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2.5 rounded-lg ${getNotificationIcon(notification.type)} flex-shrink-0`}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1.5 font-medium">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              )}
            </div>

            {hasMore && (
              <button
                onClick={handleSeeAllNotifications}
                className="w-full px-5 py-3.5 text-center text-sm font-semibold text-blue-600 active:bg-blue-50 transition-colors border-t border-gray-200"
              >
                See All Notifications
              </button>
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default DriverNavbar;