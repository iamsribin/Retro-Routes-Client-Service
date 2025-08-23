import { Routes, Route } from "react-router-dom";

import DriverLoginPage from "../pages/auth/DriverLoginPage";
import DriverSignupPage from "../pages/auth/DriverSignupPage";
import ResubmissionPage from "../pages/auth/ResubmissionPage";
import AuthRedirect from "@/routes/public-route";
import ProtectedRoute from "@/routes/protected-route";
import AppRoutes from "@/constants/app-routes";
import NotFound from "@/shared/components/NotFound";
import Dashboard from "../pages/DriverDashboard";
import DriverProfile from "../pages/DriverProfile";
import BookingTransaction from "../pages/BookingTransaction";
import BookingDetails from "../pages/BookingDetails";
import DriverRideMap from "../pages/DriverRideMap";
import DriverDocuments from "../pages/DriverDocument"
import { DriverLocationProvider } from "@/context/driver-location-context";
import RideNotification from "../components/RideNotification"

const ROLE = "Driver"; 

function DriverRoutes() {
  return (
    <DriverLocationProvider>
      <RideNotification/>
    <Routes>
      <Route path={AppRoutes.LOGIN} element={<AuthRedirect role={ROLE}><DriverLoginPage /></AuthRedirect>} />
      <Route path={AppRoutes.SIGNUP} element={<AuthRedirect role={ROLE}><DriverSignupPage /></AuthRedirect>} />
      <Route path={AppRoutes.DRIVER_IDENTIFICATION} element={<ProtectedRoute allowedRole="Resubmission"><ResubmissionPage /></ProtectedRoute>} />
      <Route path={AppRoutes.DASHBOARD} element={<ProtectedRoute allowedRole={ROLE}><Dashboard/></ProtectedRoute>} />
      <Route path={AppRoutes.PROFILE} element={<ProtectedRoute allowedRole={ROLE}><DriverProfile/></ProtectedRoute>} />
      <Route path="rideTracking" element={<ProtectedRoute allowedRole={ROLE}><DriverRideMap/></ProtectedRoute>} />
      <Route path="trips" element={<ProtectedRoute allowedRole={ROLE}><BookingTransaction/></ProtectedRoute>} />
      <Route path="documents" element={<ProtectedRoute allowedRole={ROLE}><DriverDocuments/></ProtectedRoute>} />
      <Route path="getMyTripDetails/:bookingId" element={<ProtectedRoute allowedRole={ROLE}><BookingDetails/></ProtectedRoute>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
    </DriverLocationProvider>
  );
}

export default DriverRoutes;
