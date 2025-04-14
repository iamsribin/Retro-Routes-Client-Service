import "./App.scss";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";

import LoginPage from "./pages/user/authntication/loginPage";
import SignupPage from "./pages/user/authntication/singupPage";
import HomePage from "./pages/user/home/Index.tsx";
import DriverLoginPage from "./pages/driver/authentication/DriverLoginPage.tsx";
import DriverSignupPage from "./pages/driver/authentication/DriverSignupPage.tsx";
import ResubmissionPage from "./pages/driver/authentication/Resbmission.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import Users from "./pages/admin/users/Users.tsx";
import Drivers from "./pages/admin/drivers/Drivers.tsx";
import AdminUserDetails from "./pages/admin/users/AdminUserDetailsPage.tsx";
import PendingDriverDetails from "./pages/admin/drivers/PendingDriverDetails.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AuthRedirect from "./components/PublicRoute.tsx"; 

function App() {
  return (
    <>
      <ToastContainer />
      <Toaster position="top-right" expand={true} richColors />
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <AuthRedirect role="User">
                  <AuthRedirect role="Admin">
                    <LoginPage />
                  </AuthRedirect>
                </AuthRedirect>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRedirect role="User">
                  <SignupPage />
                </AuthRedirect>
              }
            />
            <Route
              path="/driver/login"
              element={
                <AuthRedirect role="Driver">
                  <DriverLoginPage />
                </AuthRedirect>
              }
            />
            <Route
              path="/driver/signup"
              element={
                <AuthRedirect role="Driver">
                  <DriverSignupPage />
                </AuthRedirect>
              }
            />

            {/* Protected Routes */}
            <Route 
            path="/driver/identification" 
            element={
              <ProtectedRoute allowedRole="Resubmission">
                <ResubmissionPage />
                </ProtectedRoute>
            } />
            <Route
              path="/driver/dashboard"
              element={
                <ProtectedRoute allowedRole="Driver">
                  <div>Driver Dashboard</div> 
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRole="Admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRole="Admin">
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/userDetails/:id"
              element={
                <ProtectedRoute allowedRole="Admin">
                  <AdminUserDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/PendingDriverDetails/:id"
              element={
                <ProtectedRoute allowedRole="Admin">
                  <PendingDriverDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/driverDetails/:id"
              element={
                <ProtectedRoute allowedRole="Admin">
                  <PendingDriverDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/drivers"
              element={
                <ProtectedRoute allowedRole="Admin">
                  <Drivers />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </>
  );
}

export default App;