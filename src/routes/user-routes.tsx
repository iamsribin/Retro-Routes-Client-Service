import { Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/user/authentication/loginPage';
import SignupPage from '@/pages/user/authentication/signupPage';
import HomePage from '@/pages/user/home/Index';
import AuthRedirect from '@/routes/PublicRoute';
import ProtectedRoute from "@/routes/ProtectedRoute";
import AppRoutes from '@/constants/app-routes';
import NotFound from '@/pages/NotFound';
import RideMap from '@/components/user/ride/RideMap';
import UserProfile from '@/pages/user/profile/UserProfile';

const ROLE = 'User';

function UserRoutes() {
  return (
    <Routes>
      <Route path={AppRoutes.USER_HOME} element={<HomePage />} />
      <Route path={AppRoutes.LOGIN} element={<AuthRedirect role={ROLE}><LoginPage /></AuthRedirect>} />
      <Route path={AppRoutes.SIGNUP} element={<AuthRedirect role={ROLE}><SignupPage /></AuthRedirect>} />
      <Route path="*" element={<NotFound />} />
      <Route path="ride-tracking" element={<RideMap/>}/>
      <Route path="profile" element={<UserProfile/>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default UserRoutes;