import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import SignupHeader from "../components/auth/SignupHeader";
import SignupForm from "../components/forms/SignupForm";

const Signup = () => {
  const [otpPage, setOtpPage] = useState(false);
  const [counter, setCounter] = useState(30);
  const [otp, setOtp] = useState<number>(0);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);

  return (
    <ChakraProvider>
      <div className="registration-container h-screen bg-white flex justify-center items-center">
        <div className="registration-container-second md:w-4/6 w-5/6 md:h-4/5 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
          <SignupHeader otpPage={otpPage} />
          <SignupForm
            otpPage={otpPage}
            setOtpPage={setOtpPage}
            counter={counter}
            setCounter={setCounter}
            otp={otp}
            setOtp={setOtp}
            userImageUrl={userImageUrl}
            setUserImageUrl={setUserImageUrl}
          />
        </div>
      </div>
      <div id="recaptcha-container" />
    </ChakraProvider>
  );
};

export default Signup;