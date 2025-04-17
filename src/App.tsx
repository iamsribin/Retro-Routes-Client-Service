import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";

import UserRoutes from "./routes/user-routes";
import DriverRoutes from "./routes/driver-routes";
import AdminRoutes from "./routes/admin-routes";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <ToastContainer />
        <Toaster position="top-right" expand={true} richColors />
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/driver/*" element={<DriverRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
