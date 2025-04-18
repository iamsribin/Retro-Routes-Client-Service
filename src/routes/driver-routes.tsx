 
import { Routes, Route } from "react-router-dom";

import DriverLoginPage from "@/pages/driver/authentication/DriverLoginPage";
import DriverSignupPage from "@/pages/driver/authentication/DriverSignupPage";
import ResubmissionPage from "@/pages/driver/authentication/Resubmission ";
import AuthRedirect from "@/routes/PublicRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AppRoutes from "@/constants/app-routes";
import NotFound from "@/pages/NotFound";

const ROLE = "Driver"; 

function DriverRoutes() {
  return (
    <Routes>
      <Route path={AppRoutes.LOGIN} element={<AuthRedirect role={ROLE}><DriverLoginPage /></AuthRedirect>} />
      <Route path={AppRoutes.SIGNUP} element={<AuthRedirect role={ROLE}><DriverSignupPage /></AuthRedirect>} />
      <Route path={AppRoutes.DRIVER_IDENTIFICATION} element={<ProtectedRoute allowedRole="Resubmission"><ResubmissionPage /></ProtectedRoute>} />
      <Route path={AppRoutes.DASHBOARD} element={<ProtectedRoute allowedRole={ROLE}><div>Driver Dashboard</div></ProtectedRoute>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

export default DriverRoutes;
