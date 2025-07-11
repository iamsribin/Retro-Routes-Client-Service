import Loader from "@/shared/components/loaders/shimmer";
import { DriverSignupHeaderProps } from "./type";

const DriverSignupHeader = ({ otpPage, load }: DriverSignupHeaderProps) => {
  return (
    <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 i justify-around items-center mb-3 md:m-0">
      {otpPage ? (
        <div className="w-full justify-center pt-10 items-center">
          <h1 className="text-gradient font-bold text-4xl mx-7 md:mx-0 md:text-6xl user-otp-title">
            Don’t share your secret OTP!
          </h1>
          <h1 className="text-black font-normal text-sm mt-3 mx-7 md:mx-0 md:text-lg md:mt-3 user-signup-title">
            Please enter the One-Time-Password sent to your registered mobile number
          </h1>
          <div className="hidden md:block" style={{ marginTop: "-30px" }}>
            <img style={{ height: "360px", width: "auto" }} src="/images/otp.jpg" alt="" />
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-center pt-10 items-center">
          <h1 className="text-gradient font-bold md:mb-8 text-4xl mx-7 md:mx-0 md:text-5xl driver-signup-title">
            Unlock exciting benefits by registering as a driver!
          </h1>
          <div className="hidden md:flex md:items-center" style={{ marginTop: "-40px" }}>
            {load ? <Loader /> : <img style={{ height: "330px", width: "auto" }} src="/images/login.jpg" alt="" />}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverSignupHeader;