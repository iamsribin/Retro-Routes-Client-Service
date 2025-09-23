import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import AuthRedirect from '@/routes/public-route';
import ProtectedRoute from "@/routes/protected-route";
import AppRoutes from '@/constants/app-routes';
import NotFound from '@/shared/components/NotFound';
import RideMap from '../pages/RideMap';
import UserProfile from '../pages/UserProfile';
import BookingTransaction from '../pages/BookingTransaction';
import BookingDetails from "../pages/BookingDetails";
import PaymentPage from '../components/ride/PaymentPage';

const ROLE = 'User';

function UserRoutes() {
  return (
    <Routes>
      <Route path={AppRoutes.USER_HOME} element={<HomePage />} />
      <Route path={AppRoutes.LOGIN} element={<AuthRedirect role={ROLE}><LoginPage /></AuthRedirect>} />
      <Route path={AppRoutes.SIGNUP} element={<AuthRedirect role={ROLE}><SignupPage /></AuthRedirect>} />

      <Route path={AppRoutes.RIDE_TRACKING} element={<ProtectedRoute allowedRole={ROLE}><RideMap/></ProtectedRoute>}/>
      <Route path={AppRoutes.PROFILE} element={<ProtectedRoute allowedRole={ROLE}><UserProfile/></ProtectedRoute>}/>
      <Route path={AppRoutes.TRIPS} element={<ProtectedRoute allowedRole={ROLE}><BookingTransaction/></ProtectedRoute>}/>
      <Route path={`${AppRoutes.GET_MY_TRIP_DETAILS}/:bookingId`} element={<ProtectedRoute allowedRole={ROLE}><BookingDetails/></ProtectedRoute>} />
      
      <Route path={AppRoutes.PAYMENT} element={<ProtectedRoute allowedRole={ROLE}><PaymentPage/></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default UserRoutes;