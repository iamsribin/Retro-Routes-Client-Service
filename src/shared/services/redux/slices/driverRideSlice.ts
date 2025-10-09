import { Coordinates, Message } from "@/shared/types/commonTypes";
import {
  DriverRideRequestSlice,
  RideRequest,
} from "@/shared/types/driver/ridetype";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RideState {
  isOpen: boolean;
  isRideNotificationOpen: boolean;
  notificationData: RideRequest | null;
  rideData: RideRequest | null;
  paymentStatus: "idle" | "pending" | "completed" | "failed";
}

const initialState: RideState = {
  isOpen: false,
  rideData: null,
  isRideNotificationOpen: false,
  notificationData: null,
  paymentStatus: "idle",
};

const RideMapSlice = createSlice({
  name: "DriverRideMap",
  initialState,
  reducers: {
    clearRide: (state) => {
      state.isOpen = false;
      state.rideData = null;
      state.isRideNotificationOpen = false;
      state.notificationData = null;
      state.paymentStatus = "idle";
    },
    showRideMap: (state, action: PayloadAction<RideRequest>) => {
      state.isOpen = true;
      state.rideData = {
        ...action.payload,
        chatMessages: action.payload.chatMessages ?? [],
        // status: action.payload.status ?? "accepted",
      };
    },
    showRideRequestNotification: (
      state,
      action: PayloadAction<RideRequest>
    ) => {
      state.isRideNotificationOpen = true;
      state.notificationData = { ...action.payload };
    },
    hideRideRequestNotification: (state) => {
      state.isRideNotificationOpen = false;
      state.notificationData = null;
    },
    hideRideMap: (state) => {
      state.isOpen = false;
      state.rideData = null;
    },
    updateRideStatus: (
      state,
      action: PayloadAction<{
        bookingId: string;
        status: DriverRideRequestSlice["status"];
        driverCoordinates?: Coordinates;
      }>
    ) => {
      if (
        state.rideData &&
        state.rideData.bookingDetails.bookingId === action.payload.bookingId
      ) {
        state.rideData.bookingDetails.status = action.payload.status;
        // if (action.payload.driverCoordinates) {
        //   state.rideData.bookingDetails = action.payload.driverCoordinates;
        // }
        state.rideData.chatMessages = state.rideData.chatMessages ?? [];
      }
    },
    addChatMessage: (
      state,
      action: PayloadAction<{
        bookingId: string;
        message: Message;
      }>
    ) => {
      if (
        state.rideData &&
        state.rideData.bookingDetails.bookingId === action.payload.bookingId
      ) {
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
  },
});

export const {
  showRideMap,
  hideRideMap,
  updateRideStatus,
  addChatMessage,
  showRideRequestNotification,
  hideRideRequestNotification,
  setPaymentStatus,
  clearRide
} = RideMapSlice.actions;
export default RideMapSlice;
