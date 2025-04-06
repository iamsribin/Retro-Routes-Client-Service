import './App.scss'
import {Route,Routes,BrowserRouter, Navigate} from "react-router-dom";
import {useSelector} from 'react-redux'
import { Toaster } from "sonner";
import { ChakraProvider, } from "@chakra-ui/react";
 
import LoginPage from './pages/user/authntication/loginPage';
import SingupPage from './pages/user/authntication/singupPage';
import HomePage from './pages/user/home/Index.tsx';
import DriverLoginPage from './pages/driver/authentication/DriverLoginPage.tsx';
import DriverSignupPage from './pages/driver/authentication/DriverSignupPage.tsx';
import { ToastContainer } from 'react-toastify';
import NotFound from './pages/NotFound.tsx';
import Dashboard from './pages/admin/Dashboard.tsx';
import Users from './pages/admin/users/Users.tsx'
import Drivers from './pages/admin/drivers/Drivers.tsx'
import AdminUserDetails from './pages/admin/users/AdminUserDetailsPage.tsx'
import PendingDriverDetails from './pages/admin/drivers/PendingDriverDetails.tsx';
// import PendingDriverDetails from './components/admin/drivers/PendingDriversDetails.tsx';

function App() {
  const  user  = useSelector((store:{ user: { loggedIn: boolean } })=>store.user.loggedIn);
  const  driver  = useSelector((store:{ driver: { loggedIn: boolean } })=>store.driver.loggedIn);
  const  admin  = useSelector((store:{ admin: { loggedIn: boolean } })=>store.admin.loggedIn);
  console.log("admin",admin);

  return (
    <>
    <ToastContainer />
    <Toaster position="top-right" expand={true} richColors/>
    <ChakraProvider>
      <BrowserRouter>
        <Routes>

          {/* user router  */}
          <Route path='/' element={<HomePage/>}/>
          <Route path='/login' element={
              admin ? <Navigate to={'/admin/dashboard'} />
                : user ? <Navigate to={'/'} />
                  : <LoginPage />
            } />
          <Route path='/signup'  element={user ? <Navigate to={'/'}/>:<SingupPage/>}/>

          {/* driver router */}
          <Route path='/driver/login' element={driver ? <Navigate to={'/driver/dashboard'}/>:  <DriverLoginPage/>}/>
          <Route path='/driver/signup' element={driver ? <Navigate to={'/driver/dashboard'}/>:<DriverSignupPage/>}/>

           {/* admin router */}
           <Route path='/admin/dashboard' element={admin? <Dashboard/> : <Navigate to={'/login'}/>} />
           <Route path='/admin/users' element={admin? <Users/> : <Navigate to={'/login'}/>} />
           <Route path='/admin/userDetails/:id' element={admin? <AdminUserDetails/> : <Navigate to={'/login'}/>} />
           <Route 
  path='/admin/driverDetails/:id' 
  element={admin ? <PendingDriverDetails /> : <Navigate to={'/login'}/>}
/>
           <Route path='/admin/drivers' element={admin? <Drivers/> : <Navigate to={'/login'}/>} />
           
          <Route path="*" element={<NotFound />} />
            
        </Routes>
      </BrowserRouter>
      </ChakraProvider> 
    </>
  )
}

export default App