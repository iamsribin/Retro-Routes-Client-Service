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
import PublicRoutes from '@/routes/public-route';

const ROLE = 'User';

function UserRoutes() {
  return (
    <Routes>
    <Route path={AppRoutes.USER_HOME} element={<HomePage />} />

       <Route element={<ProtectedRoute allowedRole={ROLE} />}>

          {/* 
             <Route path={AppRoutes.TRIPS} element={<ProtectedRoute allowedRole={ROLE}><BookingTransaction/></ProtectedRoute>}/>
             <Route path={`${AppRoutes.GET_MY_TRIP_DETAILS}/:bookingId`} element={<ProtectedRoute allowedRole={ROLE}><BookingDetails/></ProtectedRoute>} />
             <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />
             
             <Route path={AppRoutes.PAYMENT} element={<ProtectedRoute allowedRole={ROLE}><PaymentPage/></ProtectedRoute>} /> */}
       {/* <Route path={AppRoutes.RIDE_TRACKING} element={<ProtectedRoute allowedRole={ROLE}><RideMap/></ProtectedRoute>}/> */}
       </Route>
             <Route path={AppRoutes.PROFILE} element={<UserProfile/>}/>
       <Route element={<PublicRoutes allowedRoles={["Admin", "User"]} />}>
         <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
         <Route path={AppRoutes.SIGNUP} element={<SignupPage />} />
       </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default UserRoutes;