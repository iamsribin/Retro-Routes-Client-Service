 
import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/user/UsersList";
import Drivers from "../pages/driver/DriversList";
import AdminUserDetails from "../pages/user/UserDetailsPage";
import DriverDetails from "../pages/driver/DriverDetails";
import ProtectedRoute from "@/routes/protected-route";
import NotFound from "@/shared/components/NotFound";
import AppRoutes from "@/constants/app-routes";

const ROLE = "Admin";

function AdminRoutes() {
  return (
    <Routes>
        <Route element={<ProtectedRoute allowedRole={"Admin"} />}>
           <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />

         </Route>
      {/* 
      <Route path={AppRoutes.ADMIN_USERS} element={<ProtectedRoute allowedRole={ROLE}><Users /></ProtectedRoute>} />
      <Route path={AppRoutes.ADMIN_USER_DETAILS+"/:id"} element={<ProtectedRoute allowedRole={ROLE}><AdminUserDetails /></ProtectedRoute>} />
      <Route path={AppRoutes.ADMIN_PENDING_DRIVER_DETAILS+"/:id"}element={<ProtectedRoute allowedRole={ROLE}><DriverDetails /></ProtectedRoute>} />
      <Route path={AppRoutes.ADMIN_DRIVER_DETAILS+"/:id"} element={<ProtectedRoute allowedRole={ROLE}><DriverDetails /></ProtectedRoute>} />
      <Route path={AppRoutes.ADMIN_DRIVERS} element={<ProtectedRoute allowedRole={ROLE}><Drivers /></ProtectedRoute>} />
       */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AdminRoutes;
