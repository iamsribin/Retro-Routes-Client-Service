import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DriverAuthState {
  name: string;
  driverId: string;
  loggedIn: boolean;
  role: "Driver" | "";
  isOnline: boolean;
  OnlineTimestamp: Date | null
}

const initialState: DriverAuthState = {
  name: "",
  driverId: "",
  loggedIn: false,
  role: "",
  isOnline:false,
  OnlineTimestamp:null,
};

const driverAuthSlice = createSlice({
  name: "driverAuth",
  initialState,
  reducers: {
    driverLogin: (
      state,
      action: PayloadAction<{
        name: string;
        driverId: string;
        role: "Driver";
      }>
    ) => {
      state.name = action.payload.name;
      state.driverId = action.payload.driverId;
      state.loggedIn = true;
      state.role = action.payload.role;
    },
    driverLogout: (state) => {
      state.name = "";
      state.driverId = "";
      state.loggedIn = false;
      state.role = "";
      state.isOnline = false;
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("driverId");
    },
setOnline: (
  state,
  action: PayloadAction<{
    onlineStatus: boolean;
  }>
) => {
  state.isOnline = action.payload.onlineStatus;
  state.OnlineTimestamp = action.payload.onlineStatus ? new Date() : null;
}
  },
});

export const { driverLogin, driverLogout, setOnline } = driverAuthSlice.actions;

export default driverAuthSlice;