import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import logoutLocalStorage from "@/shared/utils/localStorage";
import { adminLogout } from "@/shared/services/redux/slices/adminAuthSlice";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRole: "User" | "Driver" | "Admin" | "Resubmission";
}

type DecodedToken = {
    role: "User" | "Driver" | "Admin";
    exp: number;
  };             
  
  interface AuthState {
    loggedIn: boolean;
    role: "User" | "Driver" | "Admin";
  }
  
  interface RootState {
    user: AuthState;
    driver: AuthState;
    admin: AuthState;
  }
  

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
    const location = useLocation();
    const user = useSelector((state: RootState) => state.user);
    const driver = useSelector((state: RootState) => state.driver);
    const admin = useSelector((state: RootState) => state.admin);
    const dispatch = useDispatch();

    if (allowedRole === "Resubmission") {
      const role = localStorage.getItem("role");
    
      if (role !== "Resubmission") {
        toast.error('Try to login frist');
        return <Navigate to="/driver/login" state={{ from: location }} replace />; 
      }
          return children;
    }
  
    const { role, loggedIn } = allowedRole === "User" ? user : allowedRole === "Driver" ? driver : admin;
  console.log("role, loggedIn",role, loggedIn);
  
    const token = 
        allowedRole === "User"? localStorage.getItem("userToken") 
        : allowedRole === "Driver" 
        ? localStorage.getItem("driverToken") 
        : allowedRole === "Admin"
        ? localStorage.getItem("adminToken")
        : null;
  
    let isTokenValid = false;
    if (token && role) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log("decoded.role",decoded.role);
        
        isTokenValid =
          decoded.role === role &&
          decoded.role === allowedRole 
      } catch (error) {
        console.error("Invalid token:", error);
        isTokenValid = false;
      }
    }
  
    const isAuthenticated = isTokenValid && loggedIn && role === allowedRole;
  console.log("isAuthenticated",isAuthenticated);
  
    if (!isAuthenticated) {
      if (role) {
        if (role === "User") {
        logoutLocalStorage("User")
        } else if (role === "Driver") {
            logoutLocalStorage("Driver")
        } else if (role === "Admin") {
            dispatch(adminLogout())
          logoutLocalStorage("Admin")
        }
      }
  
      return (
        <Navigate
          to={allowedRole === "Driver" ? "/driver/login" : "/login"}
          state={{ from: location }}
          replace
        />
      );
    }
  
    return children;
  };

export default ProtectedRoute;