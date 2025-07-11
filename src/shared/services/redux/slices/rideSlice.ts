import { Coordinates, Message } from "@/shared/types/commonTypes";
import { RideStatusData } from "@/shared/types/user/rideTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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