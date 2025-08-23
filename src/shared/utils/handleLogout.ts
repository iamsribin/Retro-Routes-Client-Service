import axios from "axios";
import { adminLogout } from "../services/redux/slices/adminAuthSlice";
import { driverLogout } from "../services/redux/slices/driverAuthSlice";
import { userLogout } from "../services/redux/slices/userAuthSlice";
import { clearStorage } from "./localStorage";

type Role = "Admin" | "Driver" | "User";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

export const handleLogout = (role: Role, dispatch: any) => {
  clearStorage();
  if (role === "Admin") dispatch(adminLogout());
  if (role === "Driver") dispatch(driverLogout());
  if (role === "User") dispatch(userLogout());

  axios.post(`${API_URL}/auth/logout`).catch(() => {});
  window.location.href = role === "Driver" ? "/driver/login" : "/login";
};