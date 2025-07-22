import logoutLocalStorage from "@/shared/utils/localStorage";
import { showNotification } from "../redux/slices/notificationSlice";
import { adminLogout } from "../redux/slices/adminAuthSlice";
import axios from "axios";
import { isAxiosError, CanceledError } from "axios";

export const axiosAdmin = (dispatch: any) => {
  const axiosAdminInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_GATEWAY_URL}/admin`,
    headers: {
      "Content-Type": "application/json"
    }
  });

  axiosAdminInstance.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem("adminToken");
      return {
        ...config,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          ...config.headers,
        },
      };
    },
    (error: any) => Promise.reject(error)
  );

axiosAdminInstance.interceptors.response.use(
  (response) => response,
  async (error) => {

    if (axios.isCancel(error) || error instanceof CanceledError) {
      console.log("Request was canceled — skipping notification.");
      return Promise.reject(error); 
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem("adminRefreshToken");

        if (!refreshToken) {
          logoutLocalStorage("Admin");
          dispatch(adminLogout());
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`,
          { token: refreshToken }
        );

        const newAccessToken = response.data.token;
        const newRefreshToken = response.data.refreshToken;

        localStorage.setItem("adminToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("adminRefreshToken", newRefreshToken);
        }

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosAdminInstance(originalRequest);
      } catch (refreshError) {
        logoutLocalStorage("Admin");
        dispatch(adminLogout());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";
     const navigate = error.response?.data?.navigate || ""
    dispatch(
      showNotification({
        type: "error",
        message: errorMessage,
        data: null,
        navigate: navigate,
      })
    );

    return Promise.reject(error);
  }
);
  return axiosAdminInstance;
};
