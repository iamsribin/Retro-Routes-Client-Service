import { DriverRideRequest, Coordinates, Message, LocationCoordinates } from "@/shared/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      driverCoordinates?: Coordinates;
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