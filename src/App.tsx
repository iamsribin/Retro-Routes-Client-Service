import './App.scss'
import {Route,Routes,BrowserRouter, Navigate} from "react-router-dom";
import {useSelector} from 'react-redux'
import { Toaster } from "sonner";
import { ChakraProvider, } from "@chakra-ui/react";

import LoginPage from './pages/user/authntication/loginPage';
import SingupPage from './pages/user/authntication/singupPage';
import HomePage from './pages/user/home/HomePage';
import DriverLoginPage from './pages/driver/authentication/DriverLoginPage.tsx';
import DriverSignupPage from './pages/driver/authentication/DriverSignupPage.tsx';
import { ToastContainer } from 'react-toastify';

function App() {
  const  user  = useSelector((store:{ user: { loggedIn: boolean } })=>store.user.loggedIn);
  const  driver  = useSelector((store:{ driver: { loggedIn: boolean } })=>store.driver.loggedIn);
  // const  admin  = useSelector((store:{ admin: { loggedIn: boolean } })=>store.admin.loggedIn);

  return (
    <>
    <ToastContainer />
    <Toaster position="top-right" expand={true} richColors/>
    <ChakraProvider>
      <BrowserRouter>
        <Routes>

          {/* user router  */}
          <Route path='/' element={<HomePage/>}/>
          <Route path='/login'  element={user ? <Navigate to={'/'}/>:<LoginPage/>}/>
          <Route path='/signup'  element={user ? <Navigate to={'/'}/>:<SingupPage/>}/>

          {/* driver router */}
          <Route path='/driver/login' element={driver ? <Navigate to={'/driver/dashboard'}/>:  <DriverLoginPage/>}/>
          <Route path='/driver/signup' element={driver ? <Navigate to={'/driver/dashboard'}/>:<DriverSignupPage/>}/>
          {/* <Route path='/driver/dashboard' element={!driver ? <Navigate to={'/driver/login'}/>:<DriverDashboardPage/>}/> */}

        </Routes>
      </BrowserRouter>
      </ChakraProvider> 
    </>
  )
}

export default App