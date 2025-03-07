/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useDispatch } from "react-redux";
import { driverLogout } from "../redux/slices/driverAuthSlice";

const createAxios=()=>{
    const axiosDriver=axios.create({
        baseURL:`${import.meta.env.VITE_API_GATEWAY_URL}/driver`,
        headers:{
            "Content-Type":"application/json"
        }
    });
    axiosDriver.interceptors.request.use(
        (config: any) => {
            const token = localStorage.getItem("driverToken")
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

    axiosDriver.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            console.log(error);
            
            const originalRequest = error.config;
            
            if (error.response.status === 401 && !originalRequest._retry) {    
                originalRequest._retry = true;
                const refreshToken = localStorage.getItem('DriverRefreshToken');
                console.log("refresh token",refreshToken);
                if (!refreshToken) {
                    localStorage.removeItem('driverToken');
                    const dispatch=useDispatch()
                    dispatch(driverLogout())
                    window.location.href = '/driver/login';
                    return Promise.reject(error);
                }
    
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`, { token: refreshToken });
                    console.log(response,"refresh responbseeyyy");
                    
                    const newAccessToken = response.data.token;
                    const newRefreshToken = response.data.refreshToken;
    
                    localStorage.setItem('driverToken', newAccessToken);
                    if (newRefreshToken) {
                        localStorage.setItem('DriverRefreshToken', newRefreshToken);
                    }
    
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    axiosDriver.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosDriver(originalRequest);
                } catch (refreshError) {
                    console.log(refreshError)
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('refreshToken');
                    const dispatch=useDispatch()
                    dispatch(driverLogout())
                    window.location.href = '/driver/login';
                    return Promise.reject(refreshError);
                }
            }
    
            return Promise.reject(error);
        })
    return axiosDriver;
}

export default createAxios