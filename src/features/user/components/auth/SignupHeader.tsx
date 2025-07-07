interface SignupHeaderProps {
    otpPage: boolean;
  }
  
  const SignupHeader = ({ otpPage }: SignupHeaderProps) => {
    return (
      <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 justify-around items-center mb-3 md:m-0">
        <div className="flex w-full justify-center pt-10 items-center">
          <h1 className="text-gradient font-bold text-4xl mx-7 md:mx-0 md:text-6xl user-signup-title md:mb-4">
            Signup and get a free first ride!
          </h1>
        </div>
        <div className="hidden md:flex md:items-center justify-center">
          <img
            className="mt-2"
            style={{ height: "330px", width: "auto" }}
            src={otpPage ? "/images/otp.jpg" : "/images/login.jpg"}
            alt=""
          />
        </div>
      </div>
    );
  };
  
  export default SignupHeader;