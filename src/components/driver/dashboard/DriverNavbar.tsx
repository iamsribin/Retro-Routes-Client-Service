import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Wallet, MapPin, FileText, LogOut } from 'lucide-react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { useDispatch } from "react-redux";
import { driverLogout } from "@/services/redux/slices/driverAuthSlice";
import logoutLocalStorage from "@/utils/localStorage";

const DriverNavbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(driverLogout());
    logoutLocalStorage("Driver");
    navigate('/login');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 sm:right-auto sm:top-0 sm:h-screen sm:w-64 bg-white shadow-lg p-4 z-20">
      <NavigationMenu orientation="vertical" className="w-full">
        <NavigationMenuList className="flex flex-row sm:flex-col justify-around sm:justify-start sm:space-y-2 w-full">
          <NavigationMenuItem className="w-full">
            <Link to="/driver/profile" className="flex items-center p-3 w-full hover:bg-gray-100 rounded-lg transition-colors">
              <User className="mr-0 sm:mr-3 h-5 w-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full">
            <Link to="/driver/wallet" className="flex items-center p-3 w-full hover:bg-gray-100 rounded-lg transition-colors">
              <Wallet className="mr-0 sm:mr-3 h-5 w-5" />
              <span className="hidden sm:inline">Wallet</span>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full">
            <Link to="/driver/trips" className="flex items-center p-3 w-full hover:bg-gray-100 rounded-lg transition-colors">
              <MapPin className="mr-0 sm:mr-3 h-5 w-5" />
              <span className="hidden sm:inline">My Trips</span>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full">
            <Link to="/driver/documents" className="flex items-center p-3 w-full hover:bg-gray-100 rounded-lg transition-colors">
              <FileText className="mr-0 sm:mr-3 h-5 w-5" />
              <span className="hidden sm:inline">Documents</span>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full hidden sm:block">
            <button 
              onClick={handleLogout}
              className="flex items-center p-3 w-full hover:bg-gray-100 rounded-lg transition-colors text-left"
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