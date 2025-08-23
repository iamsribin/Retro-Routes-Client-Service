import "./App.scss";
import { Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import UserRoutes from "@/features/user/routes/user-routes";
import DriverRoutes from "@/features/driver/routes/driver-routes";
import AdminRoutes from "@/features/admin/routes/admin-routes";
import NotFound from "@/shared/components/NotFound";
import NotificationModal from "@/shared/components/NotificationModal";
import GlobalLoading from "@/shared/components/loaders/GlobalLoading";
import { useEffect } from "react";
import { initAxios } from "./shared/services/axios/initAxios";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    initAxios(dispatch);
  }, [dispatch]);

  return (
    <ChakraProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <NotificationModal />
        <GlobalLoading />
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/driver/*" element={<DriverRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </ChakraProvider>
  );
}

export default App;
