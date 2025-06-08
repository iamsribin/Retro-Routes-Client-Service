import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Booking {
  date: string;
  distance: string;
  driver: {
    driverName: string;
    driverNumber: string;
    driverProfile: string;
    driver_id: string;
  };
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
  user: {
    userName: string;
    userProfile: string;
    user_id: string;
    number: string;
  };
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

interface RideStatusData {
  ride_id: string;
  status: "searching" | "Accepted" | "Failed" | "cancelled";
  message?: string; // Made optional to match incoming data
  driverId?: string;
  booking?: Booking;
  driverCoordinates?: Coordinates;
  driverDetails?: DriverDetails;
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
