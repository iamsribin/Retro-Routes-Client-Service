import { RideDetails } from "@/features/driver/components/type";
import { BookingDetails, CustomerDetails, LocationCoordinates, Message } from "../commonTypes";

interface DriverRideRequest {
  requestId: string;
  customer: CustomerDetails;
  pickup: LocationCoordinates;
  dropoff: LocationCoordinates;
  ride: RideDetails;
  booking: BookingDetails;
  requestTimeout: number;
  requestTimestamp: string;
  chatMessages: Message[];
  status: 'accepted' | 'started' | 'completed' | 'cancelled' | 'failed';
}

export type{DriverRideRequest}