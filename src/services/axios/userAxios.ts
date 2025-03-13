/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useDispatch } from "react-redux";
import { userLogout } from "../redux/slices/userAuthSlice";

const createAxios=()=>{
    const axiosUser=axios.create({
        baseURL:`${import.meta.env.VITE_API_GATEWAY_URL}/user`,
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
    });
    axiosUser.interceptors.request.use(
        (config: any) => {            
            const token = localStorage.getItem('userToken');
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

    axiosUser.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log(error);
        
        const originalRequest = error.config;
        
        if (error.response.status === 401 && !originalRequest._retry) {    
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            console.log("refresh token",refreshToken);
            if (!refreshToken) {
                localStorage.removeItem('userToken');
                const dispatch=useDispatch()
                dispatch(userLogout())
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`, { token: refreshToken });
                
            } catch (refreshError) {
    
            }
        }

        return Promise.reject(error);
    })
    return axiosUser;
}

export default createAxios