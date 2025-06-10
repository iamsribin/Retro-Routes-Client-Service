import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomerDetails {
  id: string;
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

interface DriverRideRequest {
  requestId: string;
  customer: CustomerDetails;
  pickup: LocationCoordinates;
  dropoff: LocationCoordinates;
  ride: RideDetails;
  booking: BookingDetails;
  requestTimeout: number;
  requestTimestamp: string;
}

interface RideState {
  isOpen: boolean;
  rideData: DriverRideRequest | null;
}

const initialState: RideState = {
  isOpen: false,
  rideData: null,
}

const RideMapSlice = createSlice({
  name: "DriverRideMap",
  initialState,
  reducers: {
    showRideMap: (state, action: PayloadAction<DriverRideRequest>) => {
      state.isOpen = true;
      state.rideData = action.payload;
    },
    hideRideMap: (state) => {
      state.isOpen = false;
      state.rideData = null;
    },
  },
});

export const { showRideMap, hideRideMap } = RideMapSlice.actions;
export default RideMapSlice;