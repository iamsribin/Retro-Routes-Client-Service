// import { Navigate, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "sonner";

// interface ProtectedRouteProps {
//   children: JSX.Element;
//   allowedRole: "User" | "Driver" | "Admin" | "Resubmission";
// }

// interface AuthState {
//   loggedIn: boolean;
//   role: "User" | "Driver" | "Admin";
// }

// interface RootState {
//   user: AuthState;
//   driver: AuthState;
//   admin: AuthState;
// }

// // const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
// //   const location = useLocation();
// //   const user = useSelector((state: RootState) => state.user);
// //   const driver = useSelector((state: RootState) => state.driver);
// //   const admin = useSelector((state: RootState) => state.admin);

// //   if (allowedRole === "Resubmission") {
// //     const role = localStorage.getItem("role");

// //     if (role !== "Resubmission") {
// //       toast.error("Try to login frist");
// //       return <Navigate to="/driver/login" state={{ from: location }} replace />;
// //     }
// //     return children;
// //   }

// //   const { role, loggedIn } =
// //     allowedRole === "User" ? user : allowedRole === "Driver" ? driver : admin;

// //   // const token = au("token");

// //   // let isTokenValid = false;
// //   // if (token && role) {
// //   //   try {
// //   //     const decoded: DecodedToken = jwtDecode(token);

// //   //     isTokenValid = decoded.role === role && decoded.role === allowedRole;
// //   //   } catch (error) {
// //   //     isTokenValid = false;
// //   //   }
// //   // }

// //   const isAuthenticated = loggedIn && role === allowedRole;

// //   if (!isAuthenticated) {
// //     // if (role) {
// //     //   if (role === "User") {
// //     //     handleLogout("User", dispatch);
// //     //   } else if (role === "Driver") {
// //     //     handleLogout("Driver", dispatch);
// //     //   } else if (role === "Admin") {
// //     //     handleLogout("Admin", dispatch);
// //     //   }
// //     // }

// //     return (
// //       <Navigate
// //         to={allowedRole === "Driver" ? "/driver/login" : "/login"}
// //         state={{ from: location }}
// //         replace
// //       />
// //     );
// //   }

// //   return children;
// // };

// export default ProtectedRoute;

import { store } from "@/shared/services/redux/store";
import { Role } from "@/shared/types/commonTypes";
import { Navigate, Outlet } from "react-router-dom";

// Interface for Props
interface PropType {
    allowedRole: Role;
}

// Protected Route
function ProtectedRoutes({ allowedRole }: PropType) {
    
      const state = store.getState();
      const {role,loggedIn} = state.user;
      console.log({role,loggedIn});

    // Check auth and role
    if (!loggedIn || allowedRole !== role) {
        return <Navigate to={allowedRole === "Driver" ? "/driver/login" : "/login"} />;
    }

    return <Outlet />;
}

// Export Protected Route
export default ProtectedRoutes;