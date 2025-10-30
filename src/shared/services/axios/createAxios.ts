import { handleLogout } from "@/shared/utils/handleLogout";
import axios, { AxiosInstance, CanceledError } from "axios";
import { showNotification } from "../redux/slices/notificationSlice";
import { authService } from "./authService";

type Role = "Admin" | "Driver" | "User";
const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

export const createAxios = (role: Role, dispatch: any): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: `${API_URL}/${role.toLowerCase()}`,
    withCredentials: true,
  });

  // Attach access token
  axiosInstance.interceptors.request.use(
    (config: any) => {

      const token = authService.get(); 
console.log("token",token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
     return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle responses
  axiosInstance.interceptors.response.use(
    (res) => res,
    async (error: unknown) => {
      // ✅ check for AxiosError type
      if (axios.isCancel(error) || error instanceof CanceledError) {
        return Promise.reject(error);
      }
      if (!axios.isAxiosError(error)) {
        return Promise.reject(error);
      }

      const originalRequest = error.config as any;

      // Handle token expiry
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const res = await axios.post(`${API_URL}/${role.toLowerCase()}/refresh`);

          const { accessToken } = res.data;
          
          authService.set(accessToken);
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          handleLogout(role, dispatch);
          return Promise.reject(refreshError);
        }
      }

      // Notify user of other errors
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Something went wrong";
      const navigate = (error.response?.data as any)?.navigate || "";

      dispatch(
        showNotification({
          type: "error",
          message,
          data: null,
          navigate,
        })
      );
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
