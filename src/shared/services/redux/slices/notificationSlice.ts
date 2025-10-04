import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  isOpen: boolean;
  type: "info" | "alert" | "ride-accepted" | "admin-blocked" | "success" | "error" | "payment-confirmation"; // <-- added
  message: string;
  navigate?: string;
  data?: any;
}

const initialState: NotificationState = {
  isOpen: false,
  type: "info",
  message: "",
  data: null,
  navigate: ""
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<Omit<NotificationState, "isOpen">>) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.data = action.payload.data;
      state.navigate = action.payload.navigate
    },
    hideNotification: (state) => {
      state.isOpen = false;
      state.message = "";
      state.data = null;
      state.navigate = "";
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;   