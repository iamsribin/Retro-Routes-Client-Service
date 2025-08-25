import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { clearStorage, getItem } from "@/shared/utils/localStorage";
import { adminLogout } from "@/shared/services/redux/slices/adminAuthSlice";
import { driverLogout } from "@/shared/services/redux/slices/driverAuthSlice";
import { userLogout } from "@/shared/services/redux/slices/userAuthSlice";
import { toast } from "sonner";
import { handleLogout } from "@/shared/utils/handleLogout";

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
      toast.error("Try to login frist");
      return <Navigate to="/driver/login" state={{ from: location }} replace />;
    }
    return children;
  }

  const { role, loggedIn } =
    allowedRole === "User" ? user : allowedRole === "Driver" ? driver : admin;

  const token = getItem("token");

  let isTokenValid = false;
  if (token && role) {
    try {
      const decoded: DecodedToken = jwtDecode(token);

      isTokenValid = decoded.role === role && decoded.role === allowedRole;
    } catch (error) {
      isTokenValid = false;
    }
  }

  const isAuthenticated = isTokenValid && loggedIn && role === allowedRole;

  if (!isAuthenticated) {
    if (role) {
      if (role === "User") {
        handleLogout("User", dispatch);
      } else if (role === "Driver") {
        handleLogout("Driver", dispatch);
      } else if (role === "Admin") {
        handleLogout("Admin", dispatch);
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
