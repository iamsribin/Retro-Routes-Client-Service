 
import { Routes, Route } from "react-router-dom";

import DriverLoginPage from "@/pages/driver/authentication/DriverLoginPage";
import DriverSignupPage from "@/pages/driver/authentication/DriverSignupPage";
import ResubmissionPage from "@/pages/driver/authentication/Resubmission ";
import AuthRedirect from "@/routes/PublicRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AppRoutes from "@/constants/app-routes";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/driver/dashboard/dashboard";
import DriverProfile from "@/pages/driver/profile/DriverProfile";
import BookingTransaction from "@/pages/driver/profile/BookingTransaction";
import BookingDetails from "@/pages/driver/profile/BookingDetails";
import ActiveRideMap from "@/components/driver/dashboard/ActiveRideMap";

const ROLE = "Driver"; 

function DriverRoutes() {
  return (
    <Routes>
      <Route path={AppRoutes.LOGIN} element={<AuthRedirect role={ROLE}><DriverLoginPage /></AuthRedirect>} />
      <Route path={AppRoutes.SIGNUP} element={<AuthRedirect role={ROLE}><DriverSignupPage /></AuthRedirect>} />
      <Route path={AppRoutes.DRIVER_IDENTIFICATION} element={<ProtectedRoute allowedRole="Resubmission"><ResubmissionPage /></ProtectedRoute>} />
      <Route path={AppRoutes.DASHBOARD} element={<ProtectedRoute allowedRole={ROLE}><Dashboard/></ProtectedRoute>} />
      <Route path={AppRoutes.PROFILE} element={<ProtectedRoute allowedRole={ROLE}><DriverProfile/></ProtectedRoute>} />
      <Route path="rideTracking" element={<ProtectedRoute allowedRole={ROLE}><ActiveRideMap/></ProtectedRoute>} />
      <Route path="trips" element={<ProtectedRoute allowedRole={ROLE}><BookingTransaction/></ProtectedRoute>} />
      <Route path="getMyTripDetails/:bookingId" element={<ProtectedRoute allowedRole={ROLE}><BookingDetails/></ProtectedRoute>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

export default DriverRoutes;
