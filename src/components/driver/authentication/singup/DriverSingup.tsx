import { useState } from "react";
import DriverIdentificationPage from "@/pages/driver/authentication/DriverIdentification";
import DriverPhotoPage from "../photo/DriverPhoto";
import DriverVehiclePage from "@/pages/driver/authentication/DriverVehiclePage";
import DriverLocationPage from "@/pages/driver/authentication/DriverLocationPage";
import DriverInsurancePage from "@/pages/driver/authentication/DriverInsurance";
import DriverSignupHeader from "@/components/driver/authentication/headers/DriverSignupHeader";
import DriverSignupForm from "@/components/forms/auth/DriverSignupForm";
import { ConfirmationResult } from "firebase/auth";

const DriverSignup = () => {
  const [step, setStep] = useState<
    "credentials" | "documents" | "location" | "driverImage" | "vehicle" | "insurance"
  >("credentials");
  const [otpPage, setOtpPage] = useState(false);
  const [counter, setCounter] = useState(40);
  const [load, setLoad] = useState(false);
  const [otp, setOtp] = useState<number>(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  if (step === "documents") return <DriverIdentificationPage />;
  if (step === "driverImage") return <DriverPhotoPage />;
  if (step === "vehicle") return <DriverVehiclePage />;
  if (step === "insurance") return <DriverInsurancePage />;
  if (step === "location") return <DriverLocationPage />;

  return (
    <div className="bg-white driver-registration-container h-screen flex justify-center items-center">
      <div className="w-5/6 md:w-4/6 md:h-4/5 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
        <DriverSignupHeader otpPage={otpPage} load={load} />
        <DriverSignupForm
          otpPage={otpPage}
          setOtpPage={setOtpPage}
          counter={counter}
          setCounter={setCounter}
          load={load}
          setLoad={setLoad}
          otp={otp}
          setOtp={setOtp}
          confirmationResult={confirmationResult}
          setConfirmationResult={setConfirmationResult}
          setStep={setStep}
        />
      </div>
      <div id="recaptcha-container" />
    </div>
  );
};

export default DriverSignup;