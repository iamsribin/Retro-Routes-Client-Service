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

const ROLE = 'User';

function UserRoutes() {
  return (
    <Routes>
      <Route path={AppRoutes.USER_HOME} element={<HomePage />} />
      <Route path={AppRoutes.LOGIN} element={<AuthRedirect role={ROLE}><LoginPage /></AuthRedirect>} />
      <Route path={AppRoutes.SIGNUP} element={<AuthRedirect role={ROLE}><SignupPage /></AuthRedirect>} />
      <Route path="ride-tracking" element={<RideMap/>}/>
      <Route path="profile" element={<UserProfile/>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default UserRoutes;