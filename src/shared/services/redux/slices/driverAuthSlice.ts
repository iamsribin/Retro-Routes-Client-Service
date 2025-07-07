import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DriverAuthState {
  name: string;
  driverId: string;
  loggedIn: boolean;
  role: "Driver" | "";
}

const initialState: DriverAuthState = {
  name: "",
  driverId: "",
  loggedIn: false,
  role: "",
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
  },
});

export const { driverLogin, driverLogout } = driverAuthSlice.actions;

export default driverAuthSlice;