 
// import axios from "axios";
// import { userLogout } from "../redux/slices/userAuthSlice";
// import logoutLocalStorage from "@/shared/utils/localStorage";

// const createAxios=(dispatch: any)=>{
//     const axiosUser=axios.create({
//         baseURL:`${import.meta.env.VITE_API_GATEWAY_URL}/user`,
//         withCredentials:true,
//         headers:{
//             "Content-Type":"application/json"
//         }
//     });
//     axiosUser.interceptors.request.use(
//         (config: any) => {
//             const token = localStorage.getItem('userToken');
//             return {
//                 ...config,
//                 headers: {
//                     ...(token !== null && { Authorization: `Bearer ${token}` }),
//                     ...config.headers,
//                 },
//             };
//         },
//         (error: any) => {
//             return Promise.reject(error);
//         }
//     );

//     axiosUser.interceptors.response.use(
//         (response) => response,
//         async (error) => {
//           const originalRequest = error.config;
      
//           if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             const refreshToken = localStorage.getItem("refreshToken");
//       console.log("refresh locsl",refreshToken);
      
//             if (!refreshToken) {
//               logoutLocalStorage("User");
//               dispatch(userLogout());
//               window.location.href = "/login";
//               return Promise.reject(error);
//             }
      
//             try {
//               const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`, {
//                 token: refreshToken,
//               });
//       console.log("user axious refresh response",response);
      
//               const { access_token, refresh_token, role } = response.data;
      
//               // Validate role
//               if (role !== "User") {
//                 throw new Error("Invalid role received");
//               }
      
//               localStorage.setItem("userToken", access_token);
//               localStorage.setItem("refreshToken", refresh_token);
      
//               originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
//               axiosUser.defaults.headers["Authorization"] = `Bearer ${access_token}`;
//               return axiosUser(originalRequest);
//             } catch (refreshError) {
//               console.error(refreshError);
//               logoutLocalStorage("User");
//               dispatch(userLogout());
//               window.location.href = "/login";
//               return Promise.reject(refreshError);
//             }
//           }
      
//           return Promise.reject(error);
//         }
//       );
//     return axiosUser;
// }

// export default createAxios