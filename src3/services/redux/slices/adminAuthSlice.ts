import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminAuthState {
  name: string;
  loggedIn: boolean;
  role: "Admin" | "";
  _id: string;
}

const initialState: AdminAuthState = {
  name: "",
  loggedIn: false,
  role: "",
  _id:""
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminLogin: (
      state,
      action: PayloadAction<{ name: string; role: "Admin", _id:string }>
    ) => {
      
      state.name = action.payload.name;
      state.loggedIn = true;
      state.role = action.payload.role;
      state._id = action.payload._id
    },
    adminLogout: (state) => {
      state.name = "";
      state.loggedIn = false;
      state.role = "";
      localStorage.removeItem("role");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
    },
  },
});

export const { adminLogin, adminLogout } = adminAuthSlice.actions;

export default adminAuthSlice;