import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/admin/users/Users";
import Drivers from "@/pages/admin/drivers/Drivers";
import AdminUserDetails from "@/pages/admin/users/AdminUserDetailsPage";
import PendingDriverDetails from "@/pages/admin/drivers/PendingDriverDetails";
import ProtectedRoute from "@/components/ProtectedRoute";
import ApiEndpoints from "@/constants/api-end-pointes";
import NotFound from "@/pages/NotFound";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<ProtectedRoute allowedRole="Admin"><Dashboard /></ProtectedRoute>} />
      <Route path="users" element={<ProtectedRoute allowedRole="Admin"><Users /></ProtectedRoute>} />
      <Route path="userDetails/:id" element={<ProtectedRoute allowedRole="Admin"><AdminUserDetails /></ProtectedRoute>} />
      <Route path="PendingDriverDetails/:id" element={<ProtectedRoute allowedRole="Admin"><PendingDriverDetails /></ProtectedRoute>} />
      <Route path="driverDetails/:id" element={<ProtectedRoute allowedRole="Admin"><PendingDriverDetails /></ProtectedRoute>} />
      <Route path="drivers" element={<ProtectedRoute allowedRole="Admin"><Drivers /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AdminRoutes;
