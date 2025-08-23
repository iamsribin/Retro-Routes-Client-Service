import { handleLogout } from "@/shared/utils/handleLogout";
import { getItem, setItem } from "@/shared/utils/localStorage";
import axios, { AxiosInstance, CanceledError } from "axios";
import { showNotification } from "../redux/slices/notificationSlice";

type Role = "Admin" | "Driver" | "User";
const API_URL = import.meta.env.VITE_API_GATEWAY_URL;


export  const createAxios = (role: Role,dispatch: any): AxiosInstance => {
    const axiosInstance = axios.create({
      baseURL: `${API_URL}/${role.toLowerCase()}`,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    // Attach access token
    axiosInstance.interceptors.request.use(
      (config: any) => {
        const token = getItem("token");
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
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
          const refreshToken = getItem("refreshToken");

          if (!refreshToken) {
            handleLogout(role, dispatch);
            return Promise.reject(error);
          }

          try {
            const res = await axios.post(`${API_URL}/auth/refresh`, {
              token: refreshToken,
            });

            const { token: newToken, refreshToken: newRefresh } = res.data;
            setItem("token", newToken);
            if (newRefresh) setItem("refreshToken", newRefresh);

            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
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