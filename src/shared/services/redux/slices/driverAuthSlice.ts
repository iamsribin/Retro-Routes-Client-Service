import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DriverAuthState {
  name: string;
  driverId: string;
  loggedIn: boolean;
  role: "Driver" | "";
  isOnline: boolean;
}

const initialState: DriverAuthState = {
  name: "",
  driverId: "",
  loggedIn: false,
  role: "",
  isOnline:false
};

const driverAuthSlice = createSlice({
  name: "driverAuth",
  initialState,
  reducers: {
    driverLogin: (
      state,
      action: PayloadAction<{
        name: string;
        driver_id: string;
        role: "Driver";
      }>
    ) => {
      state.name = action.payload.name;
      state.driverId = action.payload.driver_id;
      state.loggedIn = true;
      state.role = action.payload.role;
    },
    driverLogout: (state) => {
      state.name = "";
      state.driverId = "";
      state.loggedIn = false;
      state.role = "";
      localStorage.removeItem("role");
      localStorage.removeItem("driverToken");
      localStorage.removeItem("DriverRefreshToken");
      localStorage.removeItem("driverId");
    },
    setOnline: (
      state,
      action: PayloadAction<{
      onlineStatus:boolean
      }>
    ) => {
        state.isOnline = action.payload.onlineStatus
    }
  },
});

export const { driverLogin, driverLogout, setOnline } = driverAuthSlice.actions;

export default driverAuthSlice;