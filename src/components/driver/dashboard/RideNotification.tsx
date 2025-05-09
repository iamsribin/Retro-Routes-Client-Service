// ```typescript
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Customer {
  name: string;
  avatar: string;
  rating: number;
}

interface Ride {
  pickup: string;
  dropoff: string;
  distance: string;
  amount: number;
  bookingId: string;
  timeout: number;
}

interface RideNotificationProps {
  customer: Customer;
  ride: Ride;
  timeLeft: number;
  onAccept: () => void;
  onDecline: () => void;
}

const RideNotification: React.FC<RideNotificationProps> = ({
  customer,
  ride,
  timeLeft,
  onAccept,
  onDecline,
}) => {
  const maxTime = ride.timeout / 1000;
  const progressValue = (timeLeft / maxTime) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-90 duration-300">
        <CardHeader className="bg-emerald-50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-emerald-600">New Ride Request</CardTitle>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Timer className="h-4 w-4 text-red-500" />
              <span className={`${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <Progress value={progressValue} className="h-1 mt-2 bg-gray-200" />
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex items-center mb-6">
            <Avatar className="h-12 w-12 mr-4 border-2 border-emerald-200">
              <AvatarImage src={customer.avatar} alt={customer.name} />
              <AvatarFallback className="bg-emerald-50 text-emerald-600">{customer.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-base">{customer.name}</p>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                <span className="text-sm">{customer.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">PICKUP</p>
                <p className="text-sm font-medium">{ride.pickup}</p>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-dashed border-gray-300 h-6"></div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">DROPOFF</p>
                <p className="text-sm font-medium">{ride.dropoff}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Distance</p>
              <p className="font-medium">{ride.distance}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Fare</p>
              <p className="font-medium text-emerald-600">₹{ride.amount}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={onDecline}
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-100 hover:text-gray-800"
            >
              Decline
            </Button>
            <Button
              onClick={onAccept}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              Accept Ride
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RideNotification;