import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Copy, 
  Edit2, 
  Check, 
  X, 
  MapPin, 
  Calendar, 
  Clock,
  Wallet,
  Car,
  XCircle,
  CheckCircle,
  User,
  Phone,
  Mail,
  Gift,
  Eye,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';

// Mock user data based on the schema
const mockUser = {
  _id: "user123",
  name: "John Doe",
  email: "john.doe@example.com",
  mobile: 9876543210,
  userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  referral_code: "JOHN2024XYZ",
  joiningDate: new Date("2023-06-15"),
  account_status: "Good",
  wallet: {
    balance: 250.75,
    transactions: [
      {
        date: new Date("2024-01-15"),
        details: "Ride Payment",
        amount: -45.50,
        status: "Completed"
      },
      {
        date: new Date("2024-01-10"),
        details: "Wallet Top-up",
        amount: 100.00,
        status: "Completed"
      }
    ]
  },
  RideDetails: {
    completedRides: 24,
    cancelledRides: 2
  }
};

// Mock booking history
const mockBookings = [
  {
    id: "booking001",
    pickup: "Downtown Plaza",
    drop: "Airport Terminal 2",
    date: new Date("2024-01-15"),
    status: "Completed",
    fare: 45.50
  },
  {
    id: "booking002", 
    pickup: "Home",
    drop: "Office Complex",
    date: new Date("2024-01-14"),
    status: "Completed",
    fare: 28.75
  },
  {
    id: "booking003",
    pickup: "Mall",
    drop: "Restaurant",
    date: new Date("2024-01-12"),
    status: "Cancelled",
    fare: 0
  }
];

const UserProfilePage = () => {
  const [user, setUser] = useState(mockUser);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef(null);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    if (imagePreview) {
      setUser(prev => ({ ...prev, userImage: imagePreview }));
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleCancelImageEdit = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveName = () => {
    setUser(prev => ({ ...prev, name: tempName }));
    setIsEditingName(false);
  };

  const handleCancelNameEdit = () => {
    setTempName(user.name);
    setIsEditingName(false);
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(user.referral_code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy referral code');
    }
  };

  const handleViewRides = () => {
    console.log('Navigate to ride history');
  };

  const handleViewWallet = () => {
    console.log('Navigate to wallet');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-800 text-white">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl shadow-sm border border-gray-700 overflow-hidden">
                <div className="p-6">
                  {/* Profile Image Section */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-4 border-gray-700 shadow-lg">
                        <img
                          src={imagePreview || user.userImage || '/api/placeholder/150/150'}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 bg-gray-900 hover:bg-gray-700 text-white p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </div>

                    {/* Image Preview Actions */}
                    {imagePreview && (
                      <div className="flex justify-center space-x-3 mb-4">
                        <button
                          onClick={handleSaveImage}
                          className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm rounded-full transition-all duration-300 hover:scale-105"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelImageEdit}
                          className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-full transition-all duration-300 hover:scale-105"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Name Section */}
                    <div className="mb-4">
                      {isEditingName ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-700 rounded-full focus:ring-2 focus:ring-gray-500 focus:border-transparent text-center bg-gray-900 text-white transition-all duration-300"
                            autoFocus
                          />
                          <div className="flex justify-center space-x-3">
                            <button
                              onClick={handleSaveName}
                              className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm rounded-full transition-all duration-300 hover:scale-105"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelNameEdit}
                              className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-full transition-all duration-300 hover:scale-105"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                          <button
                            onClick={() => setIsEditingName(true)}
                            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-all duration-300"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm">
                      Member since {formatDate(user.joiningDate)}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-900 rounded-xl">
                      <div className="p-2 bg-gray-800 rounded-lg shadow-sm">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Email</p>
                        <p className="font-medium text-white truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-900 rounded-xl">
                      <div className="p-2 bg-gray-800 rounded-lg shadow-sm">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Phone</p>
                        <p className="font-medium text-white">+1 {user.mobile}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Referral Code Section */}
                <div className="p-6 bg-gradient-to-br from-black to-gray-800 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-900 rounded-lg">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Referral Code</p>
                        <p className="font-mono font-bold text-lg text-white">{user.referral_code}</p>
                      </div>
                    </div>
                    <button
                      onClick={copyReferralCode}
                      className="flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white text-sm rounded-full transition-all duration-300 hover:scale-105"
                    >
                      {copySuccess ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rides Summary Card */}
                <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl shadow-sm border border-gray-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">Ride Summary</h3>
                      <div className="p-2 bg-gray-900 rounded-lg">
                        <Car className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-900 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm text-green-400 font-medium">Completed</p>
                            <p className="text-2xl font-bold text-green-400">{user.RideDetails.completedRides}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-red-900 rounded-lg">
                            <XCircle className="w-5 h-5 text-red-400" />
                          </div>
                          <div>
                            <p className="text-sm text-red-400 font-medium">Cancelled</p>
                            <p className="text-2xl font-bold text-red-400">{user.RideDetails.cancelledRides}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gradient-to-br from-black to-gray-800 border-t border-gray-700">
                    <button 
                      onClick={handleViewRides}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-900 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">View All Rides</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Wallet Card */}
                <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl shadow-sm border border-gray-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">Wallet</h3>
                      <div className="p-2 bg-gray-900 rounded-lg">
                        <Wallet className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                    
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-400 mb-2">Current Balance</p>
                      <p className="text-4xl font-bold text-green-400 mb-4">
                        {formatCurrency(user.wallet.balance)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {user.wallet.transactions.length} recent transactions
                      </p>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gradient-to-br from-black to-gray-800 border-t border-gray-700">
                    <button 
                      onClick={handleViewWallet}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-900 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">View Wallet</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl shadow-sm border border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-900 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Account Status</h3>
                      <p className="text-green-400 font-medium">{user.account_status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Last updated</p>
                    <p className="text-sm font-medium text-white">{formatDate(new Date())}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;