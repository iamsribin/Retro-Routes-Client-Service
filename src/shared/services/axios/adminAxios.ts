import axios from "axios";
import { adminLogout } from "../redux/slices/adminAuthSlice";
import logoutLocalStorage from "@/shared/utils/localStorage";

export const axiosAdmin = (dispatch: any) => {  
    const axiosAdminInstance = axios.create({
        baseURL: `${import.meta.env.VITE_API_GATEWAY_URL}/admin`,
        headers: {
            "Content-Type": "application/json"
        }
    });

    axiosAdminInstance.interceptors.request.use(
        (config: any) => {
            const token = localStorage.getItem('adminToken');
            console.log(token,"local storage");
            
            return {
                ...config,
                headers: {
                    ...(token !== null && { Authorization: `Bearer ${token}` }),
                    ...config.headers,
                },
            };
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );

    axiosAdminInstance.interceptors.response.use(
        (response) => {
            console.log(response);
            return response; 
        },
        async (error) => {
            console.log(error);
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                try {
                    
                     originalRequest._retry = true;
                    const refreshToken = localStorage.getItem('adminRefreshToken');

                    if (!refreshToken) {
                       logoutLocalStorage("Admin");
                        dispatch(adminLogout()); 
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }

                    const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`, { token: refreshToken });

                    const newAccessToken = response.data.token;
                    const newRefreshToken = response.data.refreshToken;

                    localStorage.setItem('adminToken', newAccessToken);

                    if (newRefreshToken) {
                        localStorage.setItem('adminRefreshToken', newRefreshToken);
                    }

                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    axiosAdminInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosAdminInstance(originalRequest);
                } catch (refreshError) {
                    console.log("refresh admin error", refreshError);
                    logoutLocalStorage("Admin");
                    dispatch(adminLogout()); 
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return axiosAdminInstance;
};
