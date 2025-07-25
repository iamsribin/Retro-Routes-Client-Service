import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmationResult } from "firebase/auth";
import { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import axiosDriver from "@/shared/services/axios/driverAxios";
import { driverLogin } from "@/shared/services/redux/slices/driverAuthSlice";
import { openPendingModal } from "@/shared/services/redux/slices/pendingModalSlice";
import { openRejectedModal } from "@/shared/services/redux/slices/rejectModalSlice";
import DriverLoginHeader from "../../components/auth/LoginHeader";
import DriverLoginForm from "@/features/driver/components/forms/DriverLoginForm";
import { auth } from "@/shared/services/firebase";
import { useDispatch, useSelector } from "react-redux";
import ApiEndpoints from "@/constants/api-end-pointes";
import { DriverAuthData } from "@/shared/types/driver/driverType";
import PendingModal from "@/shared/components/PendingModal";
import  RejectedModal  from "@/shared/components/RejectModal";

interface DecodedToken {
  email: string;
}

const DriverLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otpInput, setOtpInput] = useState(false);
  const [otp, setOtp] = useState<number>(0);
  const [load, setLoad] = useState(false);
  const [counter, setCounter] = useState(40);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [driverData, setDriverData] = useState<DriverAuthData>({
    name: "",
    driverToken: "",
    driver_id: "",
    refreshToken: "",
    role: "Driver",
  });

      const isOpenPending  = useSelector((store: {pendingModal:{isOpenPending:boolean}}) => store.pendingModal.isOpenPending);
    const isOpenRejected  = useSelector((store: {rejectModal:{isOpenRejected:boolean}}) => store.rejectModal.isOpenRejected);

  const handleGoogleLogin = async (req: CredentialResponse) => {
    try {
      const token = req.credential;
      if (!token) throw new Error("No credential provided");
      const decode = jwtDecode<DecodedToken>(token);
      
      const { data } = await axiosDriver(dispatch).post(ApiEndpoints.DRIVER_CHECK_GOOGLE_LOGIN, {
        email: decode.email,
      });
      console.log("======data=====",data);

      switch (data.message) {
        case "Success":
          toast.success("Login success!");
          localStorage.setItem("driverToken", data.token);
          localStorage.setItem("DriverRefreshToken", data.refreshToken);
          localStorage.setItem("role", "Driver");
          dispatch(driverLogin({ name: data.name, driver_id: data._id, role: "Driver" }));
          localStorage.removeItem("driverId");
          // navigate("/driver/dashboard");
          break;
        case "Incomplete registration":
          toast.info("Please complete the registration!");
          localStorage.setItem("driverId", data.driverId);
          navigate("/driver/signup");
          break;
        case "Blocked":
          toast.info("Your account is blocked!");
          break;
        case "Not verified":
          dispatch(openPendingModal());
          break;
        case "Rejected":
          dispatch(openRejectedModal());
          localStorage.setItem("driverId", data.driverId);
          break;
        default:
          toast.error("Not registered! Please register to continue.");
      }

    } catch (error) {
      console.log(error);
      
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  return (
        <>
          {isOpenPending && <PendingModal />}
            {isOpenRejected && <RejectedModal/>}
    <div className="driver-registration-container bg-white h-screen flex justify-center items-center">
      <div className="w-5/6 md:w-4/6 md:h-4/5 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
        <DriverLoginHeader otpInput={otpInput} load={load} />
        <DriverLoginForm
          auth={auth}
          otpInput={otpInput}
          setOtpInput={setOtpInput}
          otp={otp}
          setOtp={setOtp}
          load={load}
          setLoad={setLoad}
          counter={counter}
          setCounter={setCounter}
          confirmationResult={confirmationResult}
          setConfirmationResult={setConfirmationResult}
          driverData={driverData}
          setDriverData={setDriverData}
          onGoogleLogin={handleGoogleLogin}
        />
      </div>
      <div id="recaptcha-container" />
    </div>
</>
  );
};

export default DriverLogin;