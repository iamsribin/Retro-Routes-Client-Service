// type Role = "User" | "Admin" | "Driver";

// const logoutLocalStorage = (role: Role) => {
//   localStorage.removeItem("role");

//   if (role === "User") {
//     localStorage.removeItem("userToken");
//     localStorage.removeItem("refreshToken");
//   } else if (role === "Admin") {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("adminRefreshToken");
//   } else if (role === "Driver") {
//     localStorage.removeItem("driverToken");
//     localStorage.removeItem("DriverRefreshToken");
//   }
// };

// export default logoutLocalStorage;


// utils/localStorage.ts

export const setItem = (key: string, value: string) =>
  localStorage.setItem(key, value);

export const getItem = (key: string) => localStorage.getItem(key);

export const removeItem = (key: string) => localStorage.removeItem(key);

export const clearStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};
