import { Routes, Route, Navigate } from "react-router-dom";
import DriverLoginPage from "@/pages/driver/authentication/DriverLoginPage";
import DriverSignupPage from "@/pages/driver/authentication/DriverSignupPage";
import ResubmissionPage from "@/pages/driver/authentication/Resbmission";
import AuthRedirect from "@/components/PublicRoute";
import ProtectedRoute from "@/components/ProtectedRoute";

function DriverRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AuthRedirect role="Driver"><DriverLoginPage /></AuthRedirect>} />
      <Route path="signup" element={<AuthRedirect role="Driver"><DriverSignupPage /></AuthRedirect>} />
      <Route path="identification" element={<ProtectedRoute allowedRole="Resubmission"><ResubmissionPage /></ProtectedRoute>} />
      <Route path="dashboard" element={<ProtectedRoute allowedRole="Driver"><div>Driver Dashboard</div></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/driver/login" />} />
    </Routes>
  );
}

export default DriverRoutes;
