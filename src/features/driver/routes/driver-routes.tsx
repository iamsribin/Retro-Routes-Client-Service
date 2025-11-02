import { Routes, Route } from "react-router-dom";
import DriverLoginPage from "../pages/auth/DriverLoginPage";
import DriverSignupPage from "../pages/auth/DriverSignupPage";
import ResubmissionPage from "../pages/auth/ResubmissionPage";
import PublicRoute from "@/routes/public-route";
import ProtectedRoute from "@/routes/protected-route";
import AppRoutes from "@/constants/app-routes";
import NotFound from "@/shared/components/NotFound";
import Dashboard from "../pages/DriverDashboard";
import DriverProfile from "../pages/DriverProfile";
import BookingTransaction from "../pages/BookingTransaction";
import BookingDetails from "../pages/BookingDetails";
import PaymentPage from "../pages/paymentPage";
import DriverRideMap from "../pages/DriverRideMap";
import DriverDocuments from "../pages/DriverDocument"
// import { DriverLocationProvider } from "@/context/driver-location-context";
import RideNotification from "../components/RideNotification"

const ROLE = "Driver"; 

function DriverRoutes() {
  return (
    // <DriverLocationProvider>
  <>
      <RideNotification/>

    <Routes>
       <Route element={<ProtectedRoute allowedRole={ROLE} />}>
           <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />
           <Route path={AppRoutes.PROFILE} element={<DriverProfile/>} />
           <Route path={AppRoutes.DOCUMENTS} element={<DriverDocuments/>} />
           {/* <Route path={AppRoutes.RIDE_TRACKING} element={<DriverRideMap/>} />
           <Route path={AppRoutes.TRIPS} element={<BookingTransaction/>} />
           <Route path={`${AppRoutes.GET_MY_TRIP_DETAILS}/:bookingId`} element={<BookingDetails/>} />
           <Route path={AppRoutes.PAYMENT} element={<PaymentPage/>} />
           */}
       </Route>


       <Route element={<PublicRoute allowedRole={ROLE} />}>
          <Route path={AppRoutes.LOGIN} element={<DriverLoginPage />} />
          <Route path={AppRoutes.SIGNUP} element={<DriverSignupPage />} />
          <Route path={AppRoutes.DRIVER_IDENTIFICATION} element={<ResubmissionPage />} />
       </Route>

      <Route path="*" element={<NotFound/>} />
    </Routes>
    {/* // </DriverLocationProvider> */}
  </>

  );
}

export default DriverRoutes;
