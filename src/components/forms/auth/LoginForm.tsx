import { useFormik } from "formik";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ConfirmationResult } from "firebase/auth";
import { CredentialResponse } from "@react-oauth/google";
import { PinInput, PinInputField, HStack } from "@chakra-ui/react";
import { GoogleLogin } from "@react-oauth/google";
import { sendOtp } from "@/hooks/useAuth";
import { userLogin } from "@/services/redux/slices/userAuthSlice";
import { adminLogin } from "@/services/redux/slices/adminAuthSlice";
import { loginValidation } from "@/utils/validation";
import axiosUser from "@/services/axios/userAxios";
import { toast } from "sonner";
import ApiEndpoints from "@/constants/api-end-points";

interface UserData {
  user: string;
  user_id: string;
  userToken: string;
  refreshToken: string;
  loggedIn: boolean;
  role: "User" | "Admin";
}

declare global {
  interface Window {
    recaptchaVerifier?: any;
  }
}


interface LoginFormProps {
  auth: unknown;
  otpInput: boolean;
  setOtpInput: (value: boolean) => void;
  otp: number;
  setOtp: (value: number) => void;
  counter: number;
  setCounter: (value: number) => void;
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: (value: ConfirmationResult | null) => void;
  userData: UserData;
  setUserData: (value: UserData) => void;
  onGoogleLogin: (data: CredentialResponse) => void;
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
}: LoginFormProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        const { data } = await axiosUser(dispatch).post(ApiEndpoints.USER_CHECK_LOGIN, values);
        if (data.message === "Success") {
          sendOtp(setOtpInput, auth, values.mobile, setConfirmationResult);
          setUserData({
            user: data.name,
            user_id: data._id,
            userToken: data.token,
            refreshToken: data.refreshToken,
            loggedIn: true,
            role: data.role,
          });
        } else if (data.message === "Blocked") {
          toast.info("Your account is blocked");
        } else {
          toast.error("Not registered! Please register to continue.");
        }
      } catch (error) {
        console.error(error);
        toast.error(error instanceof Error ? error.message : "An unknown error occurred");
      }
    },
  });

  const handleOtpChange = (index: number, newValue: number) => {
    const newOtp = [...otp.toString().padStart(6, "0")];
    newOtp[index] = newValue.toString();
    setOtp(parseInt(newOtp.join("")) || 0);
  };

  const handleOtpVerify = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!otp || !confirmationResult) {
      toast.error("Enter a valid OTP");
      return;
    }

    try {
      await confirmationResult.confirm(otp.toString());
      localStorage.setItem("role", userData.role);
      if (userData.role === "Admin") {
        localStorage.setItem("adminToken", userData.userToken);
        localStorage.setItem("adminRefreshToken", userData.refreshToken);
        dispatch(adminLogin({ name: userData.user, role: userData.role, _id: userData.user_id }));
        navigate("/admin/dashboard");
      } else {
        localStorage.setItem("userToken", userData.userToken);
        localStorage.setItem("refreshToken", userData.refreshToken);
        dispatch(userLogin({ user: userData.user, user_id: userData.user_id, role: userData.role }));
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
                      onChange={(e) => handleOtpChange(index, parseInt(e.target.value))}
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
                      sendOtp(setOtpInput, auth, formik.values.mobile, setConfirmationResult);
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
              <GoogleLogin shape="circle" ux_mode="popup" onSuccess={onGoogleLogin} />
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