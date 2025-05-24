import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
// import { Toaster } from "sonner";
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import UserRoutes from "./routes/user-routes";
import DriverRoutes from "./routes/driver-routes";
import AdminRoutes from "./routes/admin-routes";
import NotFound from "./pages/NotFound";
import NotificationModal from "@/components/NotificationModal";

function App() {
  return (
    <ChakraProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>  
         <NotificationModal />
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/driver/*" element={<DriverRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </TooltipProvider>
    </ChakraProvider>
  );
}

export default App;
