import { LocationCoordinates } from "@/shared/types/commonTypes";

interface Customer {
  id: string;
  name: string;
  profileImageUrl?: string;
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
  status: "pending" | "accepted" | "declined" | "cancelled";
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

export type {RideNotificationProps}