import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserAuthState {
  user: string;
  user_id: string;
  loggedIn: boolean;
  role: "User" | "";
}

const initialState: UserAuthState = {
  user: "",
  user_id: "",
  loggedIn: false,
  role: "",
};

export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    userLogin: (
      state,
      action: PayloadAction<{
        user: string;
        user_id: string;
        role: "User";
      }>
    ) => {
      state.user = action.payload.user;
      state.user_id = action.payload.user_id;
      state.loggedIn = true;
      state.role = action.payload.role;
    },
    userLogout: (state) => {
      state.user = "";
      state.user_id = "";
      state.loggedIn = false;
      state.role = "";
      localStorage.removeItem("role");
      localStorage.removeItem("userToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { userLogin, userLogout } = userAuthSlice.actions;

export default userAuthSlice.reducer;