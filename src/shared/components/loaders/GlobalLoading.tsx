import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/services/redux/store';
import { LoadingType } from '@/shared/services/redux/slices/loadingSlice';
import { 
  Car, 
  MapPin, 
  Navigation, 
  CreditCard, 
  User, 
  FileText, 
  CheckCircle, 
  Calendar,
  Search,
  Shield
} from 'lucide-react';
import { Progress } from '@/shared/components/ui/progress';

interface LoadingConfig {
  icon: React.ReactNode;
  title: string;
  defaultMessage: string;
  color: string;
  bgColor: string;
}

const loadingConfigs: Record<LoadingType, LoadingConfig> = {
  default: {
    icon: <Car className="w-8 h-8" />,
    title: 'Loading...',
    defaultMessage: 'Please wait',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  'ride-request': {
    icon: <Car className="w-8 h-8" />,
    title: 'Requesting Ride',
    defaultMessage: 'Finding the best ride for you...',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
  },
  'ride-search': {
    icon: <Search className="w-8 h-8" />,
    title: 'Finding Drivers',
    defaultMessage: 'Searching for available drivers nearby...',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  'ride-tracking': {
    icon: <Navigation className="w-8 h-8" />,
    title: 'Tracking Ride',
    defaultMessage: 'Getting real-time updates...',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  'payment': {
    icon: <CreditCard className="w-8 h-8" />,
    title: 'Processing Payment',
    defaultMessage: 'Securely processing your payment...',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  'location': {
    icon: <MapPin className="w-8 h-8" />,
    title: 'Getting Location',
    defaultMessage: 'Accessing your current location...',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  'profile': {
    icon: <User className="w-8 h-8" />,
    title: 'Updating Profile',
    defaultMessage: 'Saving your information...',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
  'authentication': {
    icon: <Shield className="w-8 h-8" />,
    title: 'Authenticating',
    defaultMessage: 'Verifying your credentials...',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
  },
  'document-upload': {
    icon: <FileText className="w-8 h-8" />,
    title: 'Uploading Documents',
    defaultMessage: 'Processing your documents...',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
  },
  'driver-verification': {
    icon: <Shield className="w-8 h-8" />,
    title: 'Verifying Driver',
    defaultMessage: 'Checking driver credentials...',
    color: 'text-teal-500',
    bgColor: 'bg-teal-50',
  },
  'ride-completion': {
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'Completing Ride',
    defaultMessage: 'Finalizing your ride...',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  'booking': {
    icon: <Calendar className="w-8 h-8" />,
    title: 'Processing Booking',
    defaultMessage: 'Confirming your booking...',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
  },
  'map-loading': {
    icon: <MapPin className="w-8 h-8" />,
    title: 'Loading Map',
    defaultMessage: 'Preparing map data...',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
  },
};

// Car animation component
const AnimatedCar: React.FC<{ color: string }> = ({ color }) => (
  <div className="relative">
    <div className={`${color} animate-bounce`}>
      <Car className="w-12 h-12" />
    </div>
    {/* Animated wheels */}
    <div className="absolute -bottom-1 left-2">
      <div className="w-2 h-2 bg-gray-800 rounded-full animate-spin"></div>
    </div>
    <div className="absolute -bottom-1 right-2">
      <div className="w-2 h-2 bg-gray-800 rounded-full animate-spin"></div>
    </div>
    {/* Speed lines */}
    <div className="absolute right-full top-1/2 -translate-y-1/2 flex space-x-1">
      <div className="w-6 h-0.5 bg-gray-300 animate-pulse"></div>
      <div className="w-4 h-0.5 bg-gray-300 animate-pulse delay-100"></div>
      <div className="w-2 h-0.5 bg-gray-300 animate-pulse delay-200"></div>
    </div>
  </div>
);

// Pulse animation for icons
const PulsingIcon: React.FC<{ icon: React.ReactNode; color: string }> = ({ icon, color }) => (
  <div className={`${color} animate-pulse`}>
    {icon}
  </div>
);

// Spinner component
const Spinner: React.FC<{ color: string }> = ({ color }) => (
  <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${color.replace('text-', 'border-')}`}></div>
);

// Main GlobalLoading component
const GlobalLoading: React.FC = () => {
  const { isLoading, loadingType, loadingMessage, progress } = useSelector(
    (state: RootState) => state.loading
  );

  if (!isLoading) return null;

  const config = loadingConfigs[loadingType];
  const displayMessage = loadingMessage || config.defaultMessage;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Icon/Animation Section */}
        <div className="mb-6 flex justify-center">
          <div className={`${config.bgColor} p-4 rounded-full`}>
            {loadingType === 'ride-request' || loadingType === 'ride-tracking' ? (
              <AnimatedCar color={config.color} />
            ) : loadingType === 'payment' ? (
              <Spinner color={config.color} />
            ) : (
              <PulsingIcon icon={config.icon} color={config.color} />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {config.title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {displayMessage}
        </p>

        {/* Progress Bar (if progress is provided) */}
        {typeof progress === 'number' && (
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">{progress}% Complete</p>
          </div>
        )}

        {/* Loading dots animation */}
        <div className="flex justify-center space-x-1">
          <div className={`w-2 h-2 ${config.bgColor} rounded-full animate-pulse`}></div>
          <div className={`w-2 h-2 ${config.bgColor} rounded-full animate-pulse delay-100`}></div>
          <div className={`w-2 h-2 ${config.bgColor} rounded-full animate-pulse delay-200`}></div>
        </div>

        {/* Ride-specific additional elements */}
        {(loadingType === 'ride-search' || loadingType === 'ride-request') && (
          <div className="mt-4 text-xs text-gray-500">
            <p>🚗 Finding nearby drivers...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalLoading;