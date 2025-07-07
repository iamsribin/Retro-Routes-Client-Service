import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Wallet, MapPin, FileText, LogOut, LayoutDashboard } from 'lucide-react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/shared/components/ui/navigation-menu";
import { useDispatch } from "react-redux";
import { driverLogout } from "@/shared/services/redux/slices/driverAuthSlice";
import logoutLocalStorage from "@/shared/utils/localStorage";

const DriverNavbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(driverLogout());
    logoutLocalStorage("Driver");
    navigate('/login');
  };

  // Define common link styles
  const linkStyles = (isActive: boolean) => `
    flex items-center p-3 w-full rounded-lg transition-colors
    ${isActive 
      ? 'bg-blue-100 text-blue-600 font-semibold' 
      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}
  `;

  return (
    <div className="fixed bottom-0 left-0 right-0 sm:right-auto sm:top-0 sm:h-screen sm:w-64 bg-white shadow-lg p-4 z-20">
      <NavigationMenu orientation="vertical" className="w-full">
        <NavigationMenuList className="flex flex-row sm:flex-col justify-around sm:justify-start sm:space-y-2 w-full">
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
              onClick={handleLogout}
              className="flex items-center p-3 w-full hover:bg-gray-100 rounded-lg transition-colors text-left text-gray-600 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DriverNavbar;