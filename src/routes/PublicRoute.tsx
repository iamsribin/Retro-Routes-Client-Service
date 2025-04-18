import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

interface AuthRedirectProps {
  children: JSX.Element;
  role: "User" | "Driver" | "Admin";
}

interface AuthState {
  loggedIn: boolean;
  role: "User" | "Driver" | "Admin" | "";
}

interface RootState {
  user: AuthState;
  driver: AuthState;
  admin: AuthState;
}

const AuthRedirect = ({ children, role }: AuthRedirectProps) => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user);
  const driver = useSelector((state: RootState) => state.driver);
  const admin = useSelector((state: RootState) => state.admin);

  const { loggedIn, role: currentRole } =
    role === "User" ? user : role === "Driver" ? driver : admin;

  const redirectPath =
    role === "User" ? "/" : role === "Driver" ? "/driver/dashboard" : "/admin/dashboard";

  if (loggedIn && currentRole === role) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default AuthRedirect;