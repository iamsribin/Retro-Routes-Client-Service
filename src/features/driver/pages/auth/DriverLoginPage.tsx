import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmationResult } from "firebase/auth";
import { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { driverLogin, driverLogout } from "@/shared/services/redux/slices/driverAuthSlice";
import DriverLoginHeader from "../../components/auth/LoginHeader";
import DriverLoginForm from "@/features/driver/components/forms/DriverLoginForm";
import { auth } from "@/shared/services/firebase";
import { useDispatch, useSelector } from "react-redux";
import { DriverAuthData } from "@/shared/types/driver/driverType";
import PendingModal from "@/shared/components/PendingModal";
import RejectedModal from "@/shared/components/RejectModal";
import { handleDriverGoogleLogin } from "@/shared/services/api/driverAuthApi";

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
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);


  const [driverData, setDriverData] = useState<DriverAuthData>({
    name: "",
    token: "",
    driverId: "",
    refreshToken: "",
    role: "Driver",
  });

  const isOpenPending = useSelector(
    (store: { pendingModal: { isOpenPending: boolean } }) =>
      store.pendingModal.isOpenPending
  );
  const isOpenRejected = useSelector(
    (store: { rejectModal: { isOpenRejected: boolean } }) =>
      store.rejectModal.isOpenRejected
  );

  const handleGoogleLogin = async (req: CredentialResponse) => {
    const token = req.credential;
    if (!token) throw new Error("No credential provided");
    const decode = jwtDecode<DecodedToken>(token);
    handleDriverGoogleLogin(dispatch, decode, driverLogin, navigate);
  };

  return (
    <>
      {isOpenPending && <PendingModal />}
      {isOpenRejected && <RejectedModal />}
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
