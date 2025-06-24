import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Driver {
  driverName: string;
  driverNumber: string;
  driverProfile: string;
  driver_id: string;
}

interface User {
  userName: string;
  userProfile: string;
  user_id: string;
  number: string;
}

interface Booking {
  date: string;
  distance: string;
  driver: Driver;
  driverCoordinates: Coordinates;
  dropoffCoordinates: Coordinates;
  dropoffLocation: string;
  duration: string;
  pickupCoordinates: Coordinates;
  pickupLocation: string;
  pin: number;
  price: number;
  ride_id: string;
  status: string;
  user: User;
  vehicleModel: string;
  _id: string;
  __v: number;
}

interface DriverDetails {
  cancelledRides: number;
  color: string;
  driverId: string;
  driverImage: string;
  driverName: string;
  mobile: number;
  number: string;
  rating: number;
  vehicleModel: string;
}

interface Message {
  sender: "driver" | "user";
  content: string;
  timestamp: string;
  type: "text" | "image";
  fileUrl?: string;
}

interface RideStatusData {
  ride_id: string;
  status: "searching" | "Accepted" | "DriverComingToPickup" | "RideStarted" | "RideFinished" | "Failed" | "cancelled";
  message?: string;
  driverId?: string;
  booking: Booking;
  driverCoordinates?: Coordinates;
  driverDetails?: DriverDetails;
  chatMessages: Message[];
}

interface RideState {
  isOpen: boolean;
  rideData: RideStatusData | null;
}

const initialState: RideState = {
  isOpen: false,
  rideData: null,
};

const RideMapSlice = createSlice({
  name: "RideMap",
  initialState,
  reducers: {
    showRideMap: (state, action: PayloadAction<RideStatusData>) => {
      state.isOpen = true;
      state.rideData = {
        ...action.payload,
        chatMessages: action.payload.chatMessages ?? [],
      };
    },
    hideRideMap: (state) => {
      state.isOpen = false;
      state.rideData = null;
    },
    updateRideStatus: (state, action: PayloadAction<{ ride_id: string; status: RideStatusData["status"]; driverCoordinates?: Coordinates }>) => {
      if (state.rideData && state.rideData.ride_id === action.payload.ride_id) {
        state.rideData.status = action.payload.status;
        if (action.payload.driverCoordinates) {
          state.rideData.driverCoordinates = action.payload.driverCoordinates;
        }
        state.rideData.chatMessages = state.rideData.chatMessages ?? [];
      }
    },
    addChatMessage: (state, action: PayloadAction<{ ride_id: string; message: Message }>) => {
      if (state.rideData && state.rideData.ride_id === action.payload.ride_id) {
        state.rideData.chatMessages = [...(state.rideData.chatMessages ?? []), action.payload.message];
      }
    },
  },
});

export const { showRideMap, hideRideMap, updateRideStatus, addChatMessage } = RideMapSlice.actions;
export default RideMapSlice;