import { useEffect, useState } from "react";
import DriverIdentificationPage from "./DriverIdentificationPage";
import DriverPhotoPage from "./DriverPhoto";
import DriverVehiclePage from "./DriverVehiclePage";
import DriverLocationPage from "./DriverLocationPage";
import DriverInsurancePage from "./DriverInsurancePage";
import DriverSignupForm from "@/features/driver/components/forms/DriverSignupForm";
import { ConfirmationResult } from "firebase/auth";
import { getItem } from "@/shared/utils/localStorage";

const DriverSignup = () => {
  const [step, setStep] = useState<
    "credentials" | "documents" | "location" | "driverImage" | "vehicle" | "insurance"
  >("credentials");
  const [otpPage, setOtpPage] = useState(false);
  const [counter, setCounter] = useState(40);
  const [load, setLoad] = useState(false);
  const [otp, setOtp] = useState<string>('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
 const currentStep = getItem("currentStep")
 console.log("currentStep", currentStep);
 
 setStep(currentStep as any || "credentials")
}, [step]);

  // Render other steps
  if (step === "documents") return <DriverIdentificationPage />;
  if (step === "driverImage") return <DriverPhotoPage />;
  if (step === "vehicle") return <DriverVehiclePage />;
  if (step === "insurance") return <DriverInsurancePage />;
  if (step === "location") return <DriverLocationPage />;

  // Main signup form 
  return (
    <>
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
      <div id="recaptcha-container" />
    </>
  );
};

export default DriverSignup;