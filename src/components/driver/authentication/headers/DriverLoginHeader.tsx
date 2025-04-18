import Loader from "@/components/shimmer/Loader";

interface DriverLoginHeaderProps {
  otpInput: boolean;
  load: boolean;
}

const DriverLoginHeader = ({ otpInput, load }: DriverLoginHeaderProps) => {
  return (
    <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 justify-around items-center mb-3 md:m-0">
      <div className="w-full pt-10">
        <h1 className="text-gradient font-bold md:mt-4 text-4xl mx-7 md:mx-0 md:text-5xl user-signup-title md:max-w-sm">
          Please sign in with your mobile number!
        </h1>
        <h1 className="text-black md:max-w-xs text-sm my-3 mx-7 md:mx-0 md:text-sm md:mt-3 user-signup-title">
          We'll send you a One-Time-Password to your registered mobile number.
        </h1>
      </div>
      <div className="hidden md:flex md:items-center" style={{ marginTop: "-45px" }}>
        {load ? (
          <Loader />
        ) : (
          <img
            className="mt-2"
            style={{ height: "330px", width: "auto" }}
            src={otpInput ? "/images/otp.jpg" : "/images/login.jpg"}
            alt=""
          />
        )}
      </div>
    </div>
  );
};

export default DriverLoginHeader;