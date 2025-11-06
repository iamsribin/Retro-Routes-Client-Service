import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AuthRedirect from '@/routes/public-route';
import ProtectedRoute from "@/routes/protected-route";
import AppRoutes from '@/constants/app-routes';
import NotFound from '@/shared/components/NotFound';
import RideMap from '../pages/RideMap';
import BookingTransaction from '../pages/BookingTransaction';
import BookingDetails from "../pages/BookingDetails";
import PaymentPage from '../components/ride/PaymentPage';
import PublicRoutes from '@/routes/public-route';
import { Suspense,lazy } from 'react';
import GlobalLoading from '@/shared/components/loaders/GlobalLoading';

const UserProfile = lazy(() => import('../pages/UserProfile'))
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignupPage = lazy(() => import('../pages/SignupPage'));


const ROLE = 'User';

  const loaderProps = {
    isLoading: true,
    loadingMessage: "Loading page..."
  };

function UserRoutes() {
  return (
      <Suspense fallback={<GlobalLoading {...loaderProps} />}>
    <Routes>

    <Route path={AppRoutes.USER_HOME} element={<HomePage />} />
      
       <Route element={<ProtectedRoute allowedRole={ROLE} />}>
         <Route path={AppRoutes.PROFILE} element={<UserProfile/>}/>

           {/* 
             <Route path={AppRoutes.TRIPS} element={<ProtectedRoute allowedRole={ROLE}><BookingTransaction/></ProtectedRoute>}/>
             <Route path={`${AppRoutes.GET_MY_TRIP_DETAILS}/:bookingId`} element={<ProtectedRoute allowedRole={ROLE}><BookingDetails/></ProtectedRoute>} />
             <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />
             
             <Route path={AppRoutes.PAYMENT} element={<ProtectedRoute allowedRole={ROLE}><PaymentPage/></ProtectedRoute>} /> */}
           {/* <Route path={AppRoutes.RIDE_TRACKING} element={<ProtectedRoute allowedRole={ROLE}><RideMap/></ProtectedRoute>}/> */}
       </Route>


       <Route element={<PublicRoutes allowedRoles={["Admin", "User"]} />}>
         <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
         <Route path={AppRoutes.SIGNUP} element={<SignupPage />} />
       </Route>
      


      <Route path="*" element={<NotFound />} />
    </Routes>
      </Suspense>
  );
}

export default UserRoutes;