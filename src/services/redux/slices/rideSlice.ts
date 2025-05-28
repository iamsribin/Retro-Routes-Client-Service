import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Coordinates {
  latitude: number;
  longitude: number;
} 

interface RideState {
  isOpen: boolean;
  userPickupLocation: Coordinates| null;
  driverLocation?: Coordinates | null;
  data: any
}

const initialState: RideState = {
  isOpen: false,
  userPickupLocation:null,
  driverLocation: null,
  data : null
};

const RideMapSlice = createSlice({
  name: "RideMap",
  initialState,
  reducers: {
    showRideMap: (state, action: PayloadAction<Omit<RideState, "isOpen">>) => {
      state.isOpen = true;
      state.driverLocation = action.payload.driverLocation
      state.userPickupLocation = action.payload.userPickupLocation
      state.data= action.payload.data
    },
    hideRideMap: (state) => {
      state.isOpen = false;
      state.driverLocation = null;
      state.userPickupLocation = null;
      state.data = null;
    },
  },
});

export const { showRideMap, hideRideMap } = RideMapSlice.actions;
export default RideMapSlice;   