import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Timer, ArrowDown, Car, Clock, IndianRupee } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Customer {
  name: string;
  profileImageUrl?: string;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address: string;
}

interface RideDetails {
  rideId: string;
  estimatedDistance: string;
  estimatedDuration: string;
  fareAmount: number;
  vehicleType: string;
  securityPin: number;
}

interface BookingDetails {
  bookingId: string;
  userId: string;
  pickupLocation: LocationCoordinates;
  dropoffLocation: LocationCoordinates;
  rideDetails: RideDetails;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
}

interface RideNotificationProps {
  customer: Customer;
  pickup: LocationCoordinates;
  dropoff: LocationCoordinates;
  ride: RideDetails;
  booking: BookingDetails;
  timeLeft: number;
  requestTimeout: number;
  onAccept: () => void;
  onDecline: () => void;
}

const RideNotification: React.FC<RideNotificationProps> = ({
  customer,
  pickup,
  dropoff,
  ride,
  booking,
  timeLeft,
  requestTimeout,
  onAccept,
  onDecline,
}) => {
  const maxTime = requestTimeout / 1000;
  const progressValue = (timeLeft / maxTime) * 100;

  useEffect(() => {
    if (timeLeft <= 0) {
      onDecline();
    }
  }, [timeLeft, onDecline]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm mx-auto">
        <Card className="w-full shadow-2xl border-0 overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header with Timer */}
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
            <div className="flex justify-between items-center mb-3">
              <CardTitle className="text-lg font-bold">New Ride Request</CardTitle>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <Timer className="h-4 w-4" />
                <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-yellow-200 animate-pulse' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
            <Progress
              value={progressValue}
              className="h-2 bg-white bg-opacity-30"
              style={{
                background: 'rgba(255, 255, 255, 0.3)',
              }}
            />
            <style>
              {`
                .progress-bar {
                  background-color: white !important;
                }
              `}
            </style>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-4 bg-white">
            {/* Customer Info */}
            <div className="flex items-center mb-5">
              <Avatar className="h-16 w-16 mr-4 border-2 border-green-100">
                <AvatarImage src={customer.profileImageUrl} alt={customer.name} />
                <AvatarFallback className="bg-green-50 text-green-600 text-xl font-bold">
                  {customer.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-500 font-medium">Passenger</p>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-4 mb-5">
              {/* Pickup Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">PICKUP</p>
                  <p className="text-sm font-medium text-gray-900 leading-tight break-words">{pickup.address}</p>
                </div>
              </div>

              {/* Route Line with Arrow */}
              <div className="flex justify-center py-1">
                <div className="flex flex-col items-center">
                  <div className="w-px h-3 bg-gray-300"></div>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <ArrowDown className="h-4 w-4 text-gray-400 my-1 animate-bounce" />
                  <div className="w-px h-3 bg-gray-300"></div>
                  <div className="w-px h-3 bg-gray-300"></div>
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">DROPOFF</p>
                  <p className="text-sm font-medium text-gray-900 leading-tight break-words">{dropoff.address}</p>
                </div>
              </div>
            </div>

            {/* Trip Stats */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                <div className="flex justify-center mb-1">
                  <Clock className="h-4 w-4 text-gray-600" />
                </div>
                <p className="text-xs text-gray-500 font-medium mb-1">TIME</p>
                <p className="text-sm font-bold text-gray-900">{ride.estimatedDuration}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
                <div className="flex justify-center mb-1">
                  <IndianRupee className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 font-medium mb-1">FARE</p>
                <p className="text-lg font-bold text-green-600">₹{ride.fareAmount}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                <div className="flex justify-center mb-1">
                  <Car className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 font-medium mb-1">DISTANCE</p>
                <p className="text-sm font-bold text-blue-900">{ride.estimatedDistance}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={onDecline}
                variant="outline"
                className="flex-1 h-12 border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 hover:text-red-700 font-bold rounded-lg text-base transition-all duration-200 bg-white"
              >
                Decline
              </Button>
              <Button
                onClick={onAccept}
                className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                style={{
                  backgroundColor: '#10b981',
                  color: 'white'
                }}
              >
                Accept Ride
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RideNotification;