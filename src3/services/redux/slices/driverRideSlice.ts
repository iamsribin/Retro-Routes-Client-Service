import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomerDetails {
  id: string;
  name: string;
  profileImageUrl?: string;
  number?: string; // Added for call functionality
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address?: string;
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
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'started' | 'completed';
  createdAt: string;
}

interface Message {
  sender: "driver" | "user";
  content: string;
  timestamp: string;
  type: "text" | "image";
  fileUrl?: string;
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
  chatMessages: Message[];
  status: 'accepted' | 'started' | 'completed' | 'cancelled' | 'failed';
}

interface RideState {
  isOpen: boolean;
  rideData: DriverRideRequest | null;
}

const initialState: RideState = {
  isOpen: false,
  rideData: null,
};

const RideMapSlice = createSlice({
  name: "DriverRideMap",
  initialState,
  reducers: {
    showRideMap: (state, action: PayloadAction<DriverRideRequest>) => {
      state.isOpen = true;
      state.rideData = {
        ...action.payload,
        chatMessages: action.payload.chatMessages ?? [],
        status: action.payload.status ?? 'accepted',
      };
    },
    hideRideMap: (state) => {
      state.isOpen = false;
      state.rideData = null;
    },
    updateRideStatus: (state, action: PayloadAction<{
      requestId: string;
      status: DriverRideRequest['status'];
      driverCoordinates?: LocationCoordinates;
    }>) => {
      if (state.rideData && state.rideData.requestId === action.payload.requestId) {
        state.rideData.status = action.payload.status;
        if (action.payload.driverCoordinates) {
          state.rideData.pickup = action.payload.driverCoordinates;
        }
        state.rideData.chatMessages = state.rideData.chatMessages ?? [];
      }
    },
    addChatMessage: (state, action: PayloadAction<{
      requestId: string;
      message: Message;
    }>) => {
      if (state.rideData && state.rideData.requestId === action.payload.requestId) {
        state.rideData.chatMessages = [...(state.rideData.chatMessages ?? []), action.payload.message];
      }
    },
  },
});

export const { showRideMap, hideRideMap, updateRideStatus, addChatMessage } = RideMapSlice.actions;
export default RideMapSlice;