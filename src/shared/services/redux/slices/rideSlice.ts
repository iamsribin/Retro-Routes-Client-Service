import { Coordinates, Message } from "@/shared/types/commonTypes";
import { RideStatusData } from "@/shared/types/user/rideTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RideState {
  isOpen: boolean;
  rideData: RideStatusData | null;
  paymentStatus: "idle" | "pending" | "completed" | "failed";
}

const initialState: RideState = {
  isOpen: false,
  rideData: null,
  paymentStatus: "idle",
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
    updateRideStatus: (
      state,
      action: PayloadAction<{
        ride_id: string;
        status: RideStatusData["status"];
        driverCoordinates?: Coordinates;
      }>
    ) => {
      if (state.rideData && state.rideData.ride_id === action.payload.ride_id) {
        state.rideData.status = action.payload.status;
        if (action.payload.driverCoordinates) {
          state.rideData.driverCoordinates = action.payload.driverCoordinates;
        }
        state.rideData.chatMessages = state.rideData.chatMessages ?? [];
      }
    },

    updateRideStatusOnly: (
      state,
      action: PayloadAction<RideStatusData["status"]>
    ) => {
      if (state.rideData && action.payload) {
        state.rideData.status = action.payload;
      }
    },

    addChatMessage: (
      state,
      action: PayloadAction<{ ride_id: string; message: Message }>
    ) => {
      if (state.rideData && state.rideData.ride_id === action.payload.ride_id) {
        state.rideData.chatMessages = [
          ...(state.rideData.chatMessages ?? []),
          action.payload.message,
        ];
      }
    },

    setPaymentStatus: (
      state,
      action: PayloadAction<RideState["paymentStatus"]>
    ) => {
      state.paymentStatus = action.payload;
    },

    clearRide: (state) => {
      state.isOpen = false;
      state.rideData = null;
      state.paymentStatus = "idle";
    },
  },
});

export const {
  showRideMap,
  hideRideMap,
  updateRideStatus,
  addChatMessage,
  setPaymentStatus,
  updateRideStatusOnly,
  clearRide,
} = RideMapSlice.actions;
export default RideMapSlice;
