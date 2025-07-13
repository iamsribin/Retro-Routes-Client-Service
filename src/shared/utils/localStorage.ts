type Role = "User" | "Admin" | "Driver";

const logoutLocalStorage = (role: Role) => {
  localStorage.removeItem("role");

  if (role === "User") {
    localStorage.removeItem("userToken");
    localStorage.removeItem("refreshToken");
  } else if (role === "Admin") {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
  } else if (role === "Driver") {
    localStorage.removeItem("driverToken");
    localStorage.removeItem("DriverRefreshToken");
  }
};

export default logoutLocalStorage;
