interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Message {
  sender: "driver" | "user";
  content: string;
  timestamp: string;
  type: "text" | "image";
  fileUrl?: string;
}

interface NotificationState {
  open: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address: string;
}

interface Feedback {
  ride_id: string;
  date: string;
  rating: number;
  feedback: string;
}

interface Transaction {
  status: "Credited" | "Debited";
  details: string;
  date: string;
  amount: number;
}
interface Wallet {
  balance: number;
  transactions: Transaction[];
}

interface RideDetailsForBooking {
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
  rideDetails: RideDetailsForBooking;
  status: "pending" | "accepted" | "declined" | "cancelled";
  createdAt: string;
}

interface CustomerDetails {
  id: string;
  name: string;
  profileImageUrl?: string;
  number?:string
}

export type {
  Coordinates,
  Message,
  NotificationState,
  LocationCoordinates,
  Feedback,
  Wallet,
  Transaction,
  RideDetailsForBooking,
  BookingDetails,
  CustomerDetails
};
