import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/assets";
import { Menu, X, User, Clock, ChevronDown } from 'lucide-react';


import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../services/redux/slices/userAuthSlice";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // const [isOpen, setIsOpen] = useState(false);
  // const [windowSize, setWindowSize] = useState(window.innerWidth);
  const dispatch = useDispatch();
  const user = useSelector(
    (store: { user: { user: string } }) => store.user.user
  );
  const navigate = useNavigate();

  ////////////////
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Retro Routes" className="h-10 w-10" />
            <span className="font-medium text-xl">Retro Routes</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              to="/services"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>

          {user ? (
            <>
            <div className="flex items-center">
              <Link 
                to="/ride-history" 
                className="flex items-center space-x-2 text-gray-700 hover:text-uber-accent smooth-transition px-4 py-2"
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
                    <Link to="/driver/login" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md smooth-transition">Login as Driver</Link>
                    <Link to="/login" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md smooth-transition"
                     onClick={() => {
                      dispatch(userLogout()); 
                      localStorage.removeItem("userToken"); 
                    }}
                     >Logout</Link>
                  </div>
                </div>
              </div>
            </div>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" className="rounded-full px-6">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full px-6">Sign Up</Button>
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
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <div className="container mx-auto px-6 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="py-2 text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="py-2 text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/services"
                className="py-2 text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="py-2 text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login">
                  <Button variant="outline" className="w-full rounded-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full rounded-full">Sign Up</Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;