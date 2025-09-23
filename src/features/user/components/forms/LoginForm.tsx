import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { PinInput, PinInputField, HStack } from "@chakra-ui/react";
import { GoogleLogin } from "@react-oauth/google";
import { sendOtp } from "@/shared/hooks/useAuth";
import { userLogin } from "@/shared/services/redux/slices/userAuthSlice";
import { adminLogin } from "@/shared/services/redux/slices/adminAuthSlice";
import { loginValidation } from "@/shared/utils/validation";
import { toast } from "sonner";
import ApiEndpoints from "@/constants/api-end-pointes";
import { LoginFormProps } from "./type";
import { postData } from "@/shared/services/api/api-service";
import { ResponseCom } from "@/shared/types/commonTypes";
import { setItem } from "@/shared/utils/localStorage";

declare global {
  interface Window {
    recaptchaVerifier?: any;
  }
}

const LoginForm = ({
  auth,
  otpInput,
  setOtpInput,
  otp,
  setOtp,
  counter,
  setCounter,
  confirmationResult,
  setConfirmationResult,
  userData,
  setUserData,
  onGoogleLogin,
  loading: parentLoading,
}: LoginFormProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

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
      try {
        // const response = await request(() =>
        //   api.post(ApiEndpoints.USER_CHECK_LOGIN, values)
        // ); 
        setLoading(true);
        const response = await postData<ResponseCom["data"]>(
          ApiEndpoints.USER_CHECK_LOGIN,
          "User",
          values
        );

        if (response.message === "Authentication successful") {
          sendOtp(setOtpInput, auth, values.mobile, setConfirmationResult);

          setUserData({
            user: response.name,
            user_id: response._id,
            userToken: response.token,
            refreshToken: response.refreshToken,
            loggedIn: true,
            role: response.role,
            mobile: response.mobile,
            profile: response.profile,
          });
        } else if (response.message === "Blocked") {
          toast.info("Your account is blocked");
        } else {
          toast.error("Not registered! Please register to continue.");
        }
      } catch (err) {
        console.error(err);
        toast.error(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handleOtpChange = (index: number, newValue: number) => {
    const newOtp = [...otp.toString().padStart(6, "0")];
    newOtp[index] = newValue.toString();
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
      setItem("role", userData.role);
      if (userData.role === "Admin") {
        setItem("token", userData.userToken);
        setItem("refreshToken", userData.refreshToken);
        dispatch(
          adminLogin({
            name: userData.user,
            role: userData.role,
            _id: userData.user_id,
          })
        );
        navigate("/admin/dashboard");
      } else {
        setItem("token", userData.userToken);
        setItem("refreshToken", userData.refreshToken);
        dispatch(
          userLogin({
            user: userData.user,
            user_id: userData.user_id,
            role: userData.role,
            mobile: userData.mobile,
            profile: userData.profile,
          })
        );
        navigate("/");
      }
      toast.success("Login Success");
    } catch {
      toast.error("Enter a valid OTP");
    }
  };

  return (
    <div className="flex md:w-1/2 justify-center pb-10 md:py-10 items-center">
      <div className="user-signup-form md:w-8/12 px-9 py-8 bg-white drop-shadow-xl">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">📱</span>
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              onChange={formik.handleChange}
              value={formik.values.mobile}
              className="w-full p-2"
              disabled={loading || parentLoading}
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
                      onChange={(e) =>
                        handleOtpChange(index, parseInt(e.target.value))
                      }
                      disabled={loading || parentLoading}
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
                className="block w-full text-white bg-blue-800 py-1.5 rounded-2xl font-semibold mb-2"
                disabled={loading || parentLoading}
              >
                {loading || parentLoading ? "Verifying..." : "Verify OTP"}
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
              className="block w-full text-white bg-black py-1.5 rounded-2xl font-semibold mb-2"
              disabled={loading || parentLoading}
            >
              {loading || parentLoading ? "Sending..." : "Send OTP"}
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
          <div className="text-center mt-3">
            <span
              onClick={() => navigate("/signup")}
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

export default LoginForm;
