import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Logo } from "@/assets";
import { Menu, X, User, ChevronDown, Navigation, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@/shared/utils/handleLogout";
import { RootState } from "@/shared/services/redux/store";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(
    (store: { user: { user: string } }) => store.user.user
  );  
  const rideData = useSelector((state: RootState) => state.RideMap.rideData);
  const paymentStatus = useSelector((state: RootState) => state.RideMap.paymentStatus);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleRideMapNavigation = () => {
    navigate("/ride-tracking");
  };

  const handlePaymentNavigation = () => {
    navigate("/payment");
  };

  const isPaymentPending = paymentStatus === "pending" || paymentStatus === "failed";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Retro Routes" className="h-10 w-10" />
            <span className="font-medium text-xl text-white">Retro Routes</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              to="/services"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          {user ? (
            <>
            <div className="flex items-center space-x-3">
              {/* Active Ride Button */}
              {rideData && !isPaymentPending && (
                <button
                  onClick={handleRideMapNavigation}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    isPulsing 
                      ? 'bg-green-600 shadow-lg shadow-green-500/50' 
                      : 'bg-green-700 shadow-md'
                  }`}
                >
                  <Navigation size={18} className="text-white" />
                  <span className="text-white">Go to Ride Map</span>
                  <span className={`w-2 h-2 rounded-full ${
                    isPulsing ? 'bg-white' : 'bg-green-300'
                  } transition-colors duration-300`} />
                </button>
              )}

              {/* Payment Pending Button */}
              {isPaymentPending && (
                <button
                  onClick={handlePaymentNavigation}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 font-medium transition-all duration-300 shadow-lg shadow-amber-500/30 animate-pulse"
                >
                  <AlertCircle size={18} className="text-white" />
                  <span className="text-white">
                    {paymentStatus === "failed" ? "Payment Failed" : "Payment Pending"}
                  </span>
                </button>
              )}

              {/* User Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-800/50">
                  <User size={18} />
                  <ChevronDown size={16} />
                </button>
                <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 top-full right-0 mt-2 w-48 bg-gray-900 rounded-lg p-3 z-10 border border-gray-700 shadow-xl">
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm hover:bg-gray-800 rounded-md transition-colors duration-200 text-white"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/driver/login" 
                      className="block px-4 py-2 text-sm hover:bg-gray-800 rounded-md transition-colors duration-200 text-white"
                    >
                      Login as Driver
                    </Link>
                    <Link 
                      to="/login" 
                      className="block px-4 py-2 text-sm hover:bg-gray-800 rounded-md transition-colors duration-200 text-white"
                      onClick={() => {
                        handleLogout("User");
                      }}
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" className="rounded-full px-6 border-gray-600 text-gray-300 hover:bg-gray-700">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full px-6 bg-gray-700 hover:bg-gray-600 text-white">Sign Up</Button>
                </Link>
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 shadow-lg animate-fade-in border-t border-gray-700">
          <div className="container mx-auto px-6 py-4">
            <nav className="flex flex-col space-y-4">
              {/* Mobile Ride Status Buttons */}
              {user && (
                <div className="flex flex-col space-y-2 pb-4 border-b border-gray-700">
                  {rideData && (
                    <button
                      onClick={() => {
                        handleRideMapNavigation();
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-full font-medium transition-all duration-300 ${
                        isPulsing 
                          ? 'bg-green-600 shadow-lg shadow-green-500/50' 
                          : 'bg-green-700 shadow-md'
                      }`}
                    >
                      <Navigation size={18} className="text-white" />
                      <span className="text-white">Go to Ride Map</span>
                      <span className={`w-2 h-2 rounded-full ${
                        isPulsing ? 'bg-white' : 'bg-green-300'
                      } transition-colors duration-300`} />
                    </button>
                  )}

                  {isPaymentPending && (
                    <button
                      onClick={() => {
                        handlePaymentNavigation();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-3 rounded-full bg-amber-600 hover:bg-amber-700 font-medium transition-all duration-300 shadow-lg shadow-amber-500/30 animate-pulse"
                    >
                      <AlertCircle size={18} className="text-white" />
                      <span className="text-white">
                        {paymentStatus === "failed" ? "Payment Failed" : "Payment Pending"}
                      </span>
                    </button>
                  )}
                </div>
              )}

              <Link
                to="/"
                className="py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/services"
                className="py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
                  <Link 
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full rounded-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      Profile
                    </Button>
                  </Link>
                  <Link 
                    to="/driver/login"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full rounded-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      Login as Driver
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => {
                      handleLogout("User");
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full rounded-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full rounded-full bg-gray-700 hover:bg-gray-600 text-white">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;