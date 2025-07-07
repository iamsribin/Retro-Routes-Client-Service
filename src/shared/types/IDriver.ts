export interface DriverLocation {
  latitude: number;
  longitude: number;
}

export interface Customer {
  id: string;
  name: string;
  profileImageUrl?: string;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address: string;
}

export interface RideDetails {
  rideId: string;
  estimatedDistance: string;
  estimatedDuration: string;
  fareAmount: number;
  vehicleType: string;
  securityPin: number;
}

export interface BookingDetails {
  bookingId: string;
  userId: string;
  pickupLocation: LocationCoordinates;
  dropoffLocation: LocationCoordinates;
  rideDetails: RideDetails;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
}

export interface Message {
  sender: 'driver' | 'user';
  content: string;
  timestamp: string;
  type: 'text' | 'image';
  fileUrl?: string;
}

export interface DriverRideRequest {
  requestId: string;
  customer: Customer;
  pickup: LocationCoordinates;
  dropoff: LocationCoordinates;
  ride: RideDetails;
  booking: BookingDetails;
  requestTimeout: number;
  requestTimestamp: string;
  chatMessages: Message[];
  status: 'accepted' | 'started' | 'completed' | 'cancelled' | 'failed';
}