/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const axiosAdmin=()=>{
    const axiosAdmin=axios.create({
        baseURL:`${import.meta.env.VITE_API_GATEWAY_URL}/admin`,
        headers:{
            "Content-Type":"application/json"
        }
    });

    
    axiosAdmin.interceptors.request.use(
        (config: any) => {
            const token = localStorage.getItem('adminToken')
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

    axiosAdmin.interceptors.response.use(
        (response) => {
            console.log(response);
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return axiosAdmin
}