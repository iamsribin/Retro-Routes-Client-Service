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
  Gift
} from 'lucide-react';

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

interface UserProfilePageProps {}

const UserProfilePage: React.FC<UserProfilePageProps> = () => {
  const [user, setUser] = useState(mockUser);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {/* Profile Image Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-gray-100">
                    <img
                      src={imagePreview || user.userImage || '/api/placeholder/150/150'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
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
                  <div className="flex justify-center space-x-2 mb-4">
                    <button
                      onClick={handleSaveImage}
                      className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelImageEdit}
                      className="flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                )}

                {/* Name Section */}
                <div className="mb-4">
                  {isEditingName ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                        autoFocus
                      />
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={handleSaveName}
                          className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelNameEdit}
                          className="flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm">
                  Member since {formatDate(user.joiningDate)}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">+1 {user.mobile}</p>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Gift className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Referral Code</p>
                        <p className="font-mono font-bold text-blue-900">{user.referral_code}</p>
                      </div>
                    </div>
                    <button
                      onClick={copyReferralCode}
                      className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      {copySuccess ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Car className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed Rides</p>
                    <p className="text-2xl font-bold text-green-600">{user.RideDetails.completedRides}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cancelled Rides</p>
                    <p className="text-2xl font-bold text-red-600">{user.RideDetails.cancelledRides}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Wallet Balance</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(user.wallet.balance)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {mockBookings.map((booking) => (
                  <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(booking.status)}
                          <span className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span className="text-gray-900 font-medium">{booking.pickup}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="w-4 h-4 text-red-600" />
                            <span className="text-gray-900 font-medium">{booking.drop}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(booking.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {booking.fare > 0 ? formatCurrency(booking.fare) : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  View All Bookings
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {user.wallet.transactions.map((transaction, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                          <Wallet className={`w-5 h-5 ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.details}</p>
                          <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-gray-600">{transaction.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;