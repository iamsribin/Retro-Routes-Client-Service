// import { handleLogout } from "@/shared/utils/handleLogout";
// import axios, { CanceledError } from "axios";
// import { authService } from "./authService";
// import { store } from "../redux/store";
// import { toast } from "@/shared/hooks/use-toast";
// import { Role } from "@/shared/types/commonTypes";

// const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

// export const axiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// axiosInstance.interceptors.request.use(
//   (config: any) => {
//     // const token = authService.get();
//     // const token = localStorage.getItem("token")
   
//     // if (token) {
//     //   config.headers.Authorization = `Bearer ${token}`;
//     // }

//     const state = store.getState();
//     const role = state.user.role;

//     if (role) {
//       config.headers["x-user-role"] = role;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (res) => res,
//   async (error: unknown) => {
//     // check for AxiosError type
//     if (axios.isCancel(error) || error instanceof CanceledError) {
//       return Promise.reject(error);
//     }
//     if (!axios.isAxiosError(error)) {
//       return Promise.reject(error);
//     }

//     const originalRequest = error.config as any;
//     const role = originalRequest.headers["x-user-role"] as Role || "";

//     // Handle token expiry
//     if (error.response?.status === 403 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
        
//          await axios.get(`${API_URL}/refresh`,{ withCredentials: true });

//         // const { accessToken } = res.data;

//         // authService.set(accessToken);
//         // localStorage.setItem("token",accessToken)
//         // originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {        
//         await handleLogout(role);
//         toast({ title: "Session expired", description: "Please login again", variant: "info" });
//       setTimeout(() => {
//       window.location.href = role === "Driver" ? "/driver/login" : "/login";
//       }, 1000);
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );


import axios from "axios";
import { startRefresh, handleLogout } from "../../utils/auth";
import { store } from "../redux/store";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config: any) => {
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);
    const originalRequest = error.config as any;

    // already-retried requests
    if (!originalRequest || originalRequest._retry) return Promise.reject(error);

    if (error.response?.status === 401 || error.response?.status === 403) {
      originalRequest._retry = true;

      try {
        // ensures only one /refresh call runs concurrently
        await startRefresh(async () => {
          // server will set cookies (accessToken) if successful
          await axios.get(`${API_URL}/refresh`, { withCredentials: true });
        });

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        // token refresh failed -> fully log out user
        await handleLogout();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);
