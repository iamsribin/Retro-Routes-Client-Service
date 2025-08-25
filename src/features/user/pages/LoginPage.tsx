import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { ConfirmationResult } from "firebase/auth";
import { userLogin } from "@/shared/services/redux/slices/userAuthSlice";
import { adminLogin } from "@/shared/services/redux/slices/adminAuthSlice";
import { CredentialResponse } from "@react-oauth/google";
import LoginForm from "../components/forms/LoginForm";
import LoginHeader from "../components/auth/LoginHeader";
import { auth } from "@/shared/services/firebase";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import ApiEndpoints from "@/constants/api-end-pointes";
import { DecodedToken } from "../components/forms/type";
import { UserAuthData } from "@/shared/types/user/userTypes";
import { postData } from "@/shared/services/api/api-service";
import { ResponseCom } from "@/shared/types/commonTypes";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [userData, setUserData] = useState<UserAuthData>({
    user: "",
    user_id: "",
    userToken: "",
    refreshToken: "",
    loggedIn: false,
    role: "User",
    mobile: undefined,
    profile: "",
  });
  const [otpInput, setOtpInput] = useState(false);
  const [otp, setOtp] = useState<number>(0);
  const [counter, setCounter] = useState(40);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async (data: CredentialResponse) => {
    try {
      const token = data.credential;
      if (!token) throw new Error("No credential provided");
      const decode = jwtDecode<DecodedToken>(token);
      setLoading(true);

      const response = await postData<ResponseCom["data"]>(
        ApiEndpoints.USER_CHECK_GOOGLE_LOGIN,
        "User",
        { email: decode.email }
      );

      if (response.message === "Authentication successful") {
        const role = response.role as "User" | "Admin";
        localStorage.setItem("role", role);
        localStorage.setItem(
          role === "Admin" ? "adminToken" : "userToken",
          response.token
        );
        localStorage.setItem(
          role === "Admin" ? "adminRefreshToken" : "refreshToken",
          response.refreshToken
        );

        if (role === "Admin") {
          dispatch(
            adminLogin({ name: response.name, role, _id: response._id })
          );
          navigate("/admin/dashboard");
        } else {
          dispatch(
            userLogin({
              user: response.name,
              user_id: response._id,
              role,
              mobile: response.mobile,
              profile: response.profile,
            })
          );
          navigate("/");
        }
        toast.success("Login Success");
      } else if (response.message === "Blocked") {
        toast.error("Your account is blocked by Admin");
      } else {
        toast.error("Not registered! Please register to continue.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container pb-10 h-screen flex justify-center bg-white items-center">
      <div className="w-5/6 md:w-4/6 md:h-4/5 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
        <LoginHeader otpInput={otpInput} />
        <LoginForm
          auth={auth}
          otpInput={otpInput}
          setOtpInput={setOtpInput}
          otp={otp}
          setOtp={setOtp}
          counter={counter}
          setCounter={setCounter}
          confirmationResult={confirmationResult}
          setConfirmationResult={setConfirmationResult}
          userData={userData}
          setUserData={setUserData}
          onGoogleLogin={handleGoogleLogin}
          loading={loading}
        />
      </div>
      <div id="recaptcha-container" />
    </div>
  );
};

export default Login;
