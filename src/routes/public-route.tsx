// import { Navigate, useLocation } from "react-router-dom";

// import { useSelector } from "react-redux";

// interface AuthRedirectProps {
//   children: JSX.Element;
//   role: "User" | "Driver" | "Admin";
// }

// interface AuthState {
//   loggedIn: boolean;
//   role: "User" | "Driver" | "Admin" | "";
// }

// interface RootState {
//   user: AuthState;
//   driver: AuthState;
//   admin: AuthState;
// }

// const AuthRedirect = ({ children, role }: AuthRedirectProps) => {
//   const location = useLocation();
//   const user = useSelector((state: RootState) => state.user);
//   const driver = useSelector((state: RootState) => state.driver);
//   const admin = useSelector((state: RootState) => state.admin);

//   const { loggedIn, role: currentRole } =
//     role === "User" ? user : role === "Driver" ? driver : admin;

//     console.log("authre", { loggedIn, role: currentRole });
    
//     const redirectPath =
//     role === "User" ? "/" : role === "Driver" ? "/driver/dashboard" : "/admin/dashboard";

//   if (loggedIn && currentRole === role) {
//     return <Navigate to={redirectPath} state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default AuthRedirect;


import { store } from "@/shared/services/redux/store";
import { Role } from "@/shared/types/commonTypes";
import { Navigate, Outlet } from "react-router-dom";

interface PropsType {
    allowedRole: Role;
}

// UnProtected Route
function PublicRoutes({ allowedRole }: PropsType) {
    
    const { role, loggedIn } = store.getState().user;

    // Check auth and role
    if (loggedIn && role === allowedRole) {
        return <Navigate to={allowedRole === "User" ? "/" : `${allowedRole.toLowerCase()}/dashboard`} />;
    }

    return <Outlet />;
}

export default PublicRoutes;