
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Clock, ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../../services/redux/slices/userAuthSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//////////////////////////////////////////////////
const [isOpen, setIsOpen] = useState(false);
const [windowSize, setWindowSize] = useState(window.innerWidth);
const dispatch = useDispatch();
const user = useSelector((store:{user:{user:string}}) => store.user.user);
const navigate = useNavigate();

useEffect(() => {
  const handleWindowResize = () => {
    setWindowSize(window.innerWidth);
  };

  window.addEventListener("resize", handleWindowResize);

  return () => {
    window.removeEventListener("resize", handleWindowResize);
  };
}, []);

useEffect(() => {
  if (windowSize > 768) {
    setIsOpen(false);
  }
}, [windowSize]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out",
        isScrolled 
          ? "bg-white/80 backdrop-blur-lg shadow-sm py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold tracking-tight text-uber-default"
          >
            RERO ROUTES
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-uber-accent smooth-transition">
                <span>Services</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 top-full left-0 mt-2 w-48 glass-card rounded-lg p-3 z-10">
                <div className="py-1">
                  <Link to="/" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md smooth-transition">Ride</Link>
                  <Link to="/" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md smooth-transition">Drive</Link>
                  <Link to="/" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md smooth-transition">Deliver</Link>
                </div>
              </div>
            </div>
            <Link to="/about" className="text-gray-700 hover:text-uber-accent smooth-transition">About</Link>
            <Link to="/safety" className="text-gray-700 hover:text-uber-accent smooth-transition">Safety</Link>
          </nav>

          {/* Right Side Options */}
          <div className="hidden md:flex items-center space-x-4">

            {user ? (
            <>
            <Link 
              to="/ride-history" 
              className="flex items-center space-x-2 text-gray-700 hover:text-uber-accent smooth-transition px-3 py-2"
            >
              <Clock size={18} />
              <span>Rides</span>
            </Link>
               <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-uber-accent smooth-transition">
              <User size={18} />
                <ChevronDown size={16} />
              </button>
              <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 top-full left-0 mt-2 w-48 glass-card rounded-lg p-3 z-10">
                <div className="py-1">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md smooth-transition">Profile</Link>
                  <Link to="/login" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md smooth-transition"
                   onClick={() => {
                    dispatch(userLogout()); 
                    localStorage.removeItem("userToken"); 
                  }}
                   >Logout</Link>
                  <Link to="/" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md smooth-transition">Deliver</Link>
                </div>
              </div>
            </div>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="text-white w-20 h-8">
                Login
              </button>
              <button onClick={() => navigate("/signup")} className="Signup bg-white rounded text-black w-20 h-8">
                Signup
              </button>
            </>
          )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-y-0 right-0 z-50 w-full bg-white shadow-xl transform ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-10">
            <Link to="/" className="text-2xl font-bold tracking-tight" onClick={() => setMobileMenuOpen(false)}>
              RETRO ROUTES
            </Link>
            <button 
              className="text-gray-700" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-6 text-lg">
            <Link to="/" className="hover:text-uber-accent smooth-transition" onClick={() => setMobileMenuOpen(false)}>
              Ride
            </Link>
            <Link to="/" className="hover:text-uber-accent smooth-transition" onClick={() => setMobileMenuOpen(false)}>
              Drive
            </Link>
            <Link to="/" className="hover:text-uber-accent smooth-transition" onClick={() => setMobileMenuOpen(false)}>
              Deliver
            </Link>
            <Link to="/about" className="hover:text-uber-accent smooth-transition" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link to="/safety" className="hover:text-uber-accent smooth-transition" onClick={() => setMobileMenuOpen(false)}>
              Safety
            </Link>
            <Link to="/ride-history" className="hover:text-uber-accent smooth-transition" onClick={() => setMobileMenuOpen(false)}>
              Ride History
            </Link>
            <Link to="/profile" className="hover:text-uber-accent smooth-transition" onClick={() => setMobileMenuOpen(false)}>
              Profile
            </Link>
            <div className="pt-6 mt-auto">
              <Link 
                to="/login" 
                className="inline-block bg-uber-default text-white rounded-full px-6 py-3 font-medium hover:bg-uber-light smooth-transition w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="inline-block border border-gray-300 rounded-full px-6 py-3 font-medium mt-4 hover:bg-gray-50 smooth-transition w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
