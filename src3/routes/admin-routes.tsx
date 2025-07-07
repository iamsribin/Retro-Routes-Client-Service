 
import { Routes, Route } from "react-router-dom";

import Dashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/admin/users/Users";
import Drivers from "@/pages/admin/drivers/Drivers";
import AdminUserDetails from "@/pages/admin/users/AdminUserDetailsPage";
import PendingDriverDetails from "@/pages/admin/drivers/PendingDriverDetails";
import ProtectedRoute from "@/routes/ProtectedRoute";
import NotFound from "@/pages/NotFound";
import AppRoutes from "@/constants/app-routes";

const ROLE = "Admin";

function AdminRoutes() {
  return (
    <Routes>
      <Route path={AppRoutes.DASHBOARD} element={<ProtectedRoute allowedRole={ROLE}><Dashboard /></ProtectedRoute>} />
      <Route path={AppRoutes.ADMIN_USERS} element={<ProtectedRoute allowedRole={ROLE}><Users /></ProtectedRoute>} />
      <Route path={AppRoutes.ADMIN_USER_DETAILS+"/:id"} element={<ProtectedRoute allowedRole={ROLE}><AdminUserDetails /></ProtectedRoute>} />
      <Route path={AppRoutes.ADMIN_PENDING_DRIVER_DETAILS+"/:id"}element={<ProtectedRoute allowedRole={ROLE}><PendingDriverDetails /></ProtectedRoute>} />
      <Route path={AppRoutes.ADMIN_DRIVER_DETAILS+"/:id"} element={<ProtectedRoute allowedRole={ROLE}><PendingDriverDetails /></ProtectedRoute>} />
      <Route path={AppRoutes.ADMIN_DRIVERS} element={<ProtectedRoute allowedRole={ROLE}><Drivers /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AdminRoutes;
