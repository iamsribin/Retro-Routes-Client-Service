import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RideNotificationProps {
  customer: {
    name: string;
    avatar: string;
    rating: number;
  };
  ride: {
    pickup: string;
    dropoff: string;
    distance: string;
    amount: number;
  };
  onAccept: () => void;
  onDecline: () => void;
}

const RideNotification: React.FC<RideNotificationProps> = ({
  customer,
  ride,
  onAccept,
  onDecline,
}) => {
  return (
    <Card className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-base sm:text-lg">Customer is waiting</span>
          <span className="text-emerald text-base sm:text-lg font-bold">₹{ride.amount}</span>
        </CardTitle>
        <CardDescription>New ride request</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <img src={customer.avatar} alt={customer.name} />
          </Avatar>
          <div>
            <p className="font-medium text-sm sm:text-base">{customer.name}</p>
            <div className="flex items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Rating: {customer.rating}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 mt-2 rounded-full bg-emerald" />
            <p className="flex-1 text-sm">{ride.pickup}</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 mt-2 rounded-full bg-red-500" />
            <p className="flex-1 text-sm">{ride.dropoff}</p>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground ml-4">
            Distance: {ride.distance}
          </p>
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Any pickup notes?"
            className="w-full p-2 rounded-md bg-gray-100 border-none text-sm"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between space-x-2">
        <Button
          variant="outline"
          className="flex-1 text-sm"
          onClick={onDecline}
        >
          Decline
        </Button>
        <Button
          className="flex-1 bg-emerald hover:bg-emerald/90 text-sm"
          onClick={onAccept}
        >
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RideNotification;