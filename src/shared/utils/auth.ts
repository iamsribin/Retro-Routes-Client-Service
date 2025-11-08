
import axios from "axios";
import { toast } from "@/shared/hooks/use-toast";
import { store } from "../services/redux/store";
import { userLogout } from "../services/redux/slices/userSlice";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

// single shared refresh promise (prevents concurrent refresh calls)
let refreshingPromise: Promise<void> | null = null;

// Broadcast to other tabs
const bc = typeof window !== "undefined" && "BroadcastChannel" in window
  ? new BroadcastChannel("auth")
  : null;

export const broadcastLogout = () => {
  if (bc) bc.postMessage({ type: "logout" });
  else localStorage.setItem("logout", Date.now().toString());
};

export const handleLogout = async (redirect = true) => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  } catch (err) {
    console.warn("logout request failed", err);
  }
    const role = store.getState().user.role;
  store.dispatch(userLogout());

  broadcastLogout();

  if (redirect) {
    toast({ title: "Logged out", description: "Please login again", variant: "info" });
    setTimeout(() => (window.location.href = role === "Driver" ? "/driver/login": "/login"), 1000);
  }
};

// listen for logout in other tabs
if (bc) {
  bc.onmessage = (ev) => {
    if (ev.data?.type === "logout") window.location.href =  "/login";
  };
} else {
  window.addEventListener("storage", (ev) => {
    if (ev.key === "logout") window.location.href = "/login";
  });
}

export const startRefresh = (call: () => Promise<void>) => {
  if (!refreshingPromise) {
    refreshingPromise = call()
      .catch((e) => { throw e; })
      .finally(() => { refreshingPromise = null; });
  }
  return refreshingPromise;
};
