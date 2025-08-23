import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "sonner";
import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { GoogleLogin } from "@react-oauth/google";
import { driverLogin } from "@/shared/services/redux/slices/driverAuthSlice";
import { sendOtp } from "@/shared/hooks/useAuth";
import { loginValidation } from "@/shared/utils/validation";
import { useDispatch } from "react-redux";
import { DriverData, DriverLoginFormProps } from "./type";
import { handleLoginDriver } from "@/shared/services/api/driverAuthApi";

const DriverLoginForm = ({
  auth,
  otpInput,
  setOtpInput,
  otp,
  setOtp,
  setLoad,
  counter,
  setCounter,
  confirmationResult,
  setConfirmationResult,
  driverData,
  setDriverData,
  onGoogleLogin,
}: DriverLoginFormProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (otpInput && counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter, otpInput, setCounter]);

  const formik = useFormik({
    initialValues: { mobile: "" },
    validationSchema: loginValidation,
    onSubmit: async (values) => {
      const data: DriverData | undefined = await handleLoginDriver(
        dispatch,
        values,
        setLoad,
        navigate
      );
      if (!data) return;

      sendOtp(setOtpInput, auth, values.mobile, setConfirmationResult);
      setDriverData({
        name: data.name,
        refreshToken: data.refreshToken,
        token: data.token,
        driverId: data.driverId,
        role: "Driver",
      });
    },
  });

  const handleOtpChange = (index: number, newValue: string) => {
    const parsedValue = parseInt(newValue) || 0;
    const newOtp = [...otp.toString().padStart(6, "0")];
    newOtp[index] = parsedValue.toString();
    setOtp(parseInt(newOtp.join("")) || 0);
  };

  const handleOtpVerify = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!otp || !confirmationResult) {
      toast.error("Enter a valid OTP");
      return;
    }

    try {
      await confirmationResult.confirm(otp.toString());
      toast.success("Login success");
      localStorage.setItem("driverToken", driverData.token);
      localStorage.setItem("DriverRefreshToken", driverData.refreshToken);
      dispatch(
        driverLogin({
          name: driverData.name,
          driverId: driverData.driverId,
          role: "Driver",
        })
      );
      localStorage.removeItem("driverId");
      navigate("/driver/dashboard");
    } catch {
      toast.error("Enter a valid OTP");
    }
  };

  return (
    <div className="flex md:w-1/2 justify-center pb-10 md:py-10 items-center">
      <div className="user-signup-form md:w-8/12 px-9 py-8 bg-white drop-shadow-xl">
        <form onSubmit={formik.handleSubmit}>
          <div className="text-center">
            <h1 className="text-gray-800 font-bold text-2xl mb-5">
              Welcome back!
            </h1>
          </div>
          <div className="flex items-center py-2 px-3 rounded-2xl mb-2">
            <PhoneIcon className="text-gray-400" />
            <input
              className="pl-2 outline-none border-b w-full"
              type="number"
              name="mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              id="mobile"
              placeholder="Mobile number"
            />
          </div>
          {formik.touched.mobile && formik.errors.mobile && (
            <p className="form-error-p-tag">{formik.errors.mobile}</p>
          )}
          {otpInput && (
            <div className="my-4 px-2">
              <HStack>
                <PinInput otp placeholder="">
                  {[...Array(6)].map((_, index) => (
                    <PinInputField
                      key={index}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                    />
                  ))}
                </PinInput>
              </HStack>
            </div>
          )}
          {otpInput ? (
            <>
              <button
                onClick={handleOtpVerify}
                className="block w-full bg-blue-800 py-1.5 rounded-2xl text-golden font-semibold mb-2"
              >
                Verify OTP
              </button>
              <div className="text-center text-gray-500 mt-4">
                {counter > 0 ? (
                  <p className="text-sm">Resend OTP in 00:{counter}</p>
                ) : (
                  <p
                    className="text-sm text-blue-800 cursor-pointer"
                    onClick={() => {
                      setCounter(40);
                      setOtp(0);
                      sendOtp(
                        setOtpInput,
                        auth,
                        formik.values.mobile,
                        setConfirmationResult
                      );
                    }}
                  >
                    Resend OTP
                  </p>
                )}
              </div>
            </>
          ) : (
            <button
              type="submit"
              className="block w-full bg-black py-1.5 rounded-2xl text-white font-semibold mb-2"
            >
              Send OTP
            </button>
          )}
          <div className="flex flex-col w-full mt-8 border-opacity-50">
            <div className="flex items-center text-xs font-medium">
              <div className="flex-grow border-t border-gray-300" />
              <span className="mx-2">or sign-in using Google</span>
              <div className="flex-grow border-t border-gray-300" />
            </div>
            <div className="flex justify-center items-center mt-5">
              <GoogleLogin
                shape="circle"
                ux_mode="popup"
                onSuccess={onGoogleLogin}
              />
            </div>
          </div>
          <div className="text-center">
            <span
              onClick={() => navigate("/driver/signup")}
              className="text-xs ml-2 hover:text-blue-500 cursor-pointer"
            >
              Not registered yet? Sign-up here!
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverLoginForm;
