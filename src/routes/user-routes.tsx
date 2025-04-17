import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/user/authntication/loginPage";
import SignupPage from "@/pages/user/authntication/singupPage";
import HomePage from "@/pages/user/home/Index";
import AuthRedirect from "@/components/PublicRoute";
import AppRoutes from "@/constants/app-routes";

function UserRoutes() {
  return (
    <Routes>
      <Route path={AppRoutes.USER_HOME} element={<HomePage />} />
      <Route path={AppRoutes.USER_LOGIN} element={<AuthRedirect role="User"><LoginPage /></AuthRedirect>} />
      <Route path={AppRoutes.USER_SIGNUP} element={<AuthRedirect role="User"><SignupPage /></AuthRedirect>} />
      <Route path="*" element={<Navigate to={AppRoutes.USER_HOME} />} />
    </Routes>
  );
}

export default UserRoutes;