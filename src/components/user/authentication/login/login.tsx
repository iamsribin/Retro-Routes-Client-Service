import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { ConfirmationResult } from "firebase/auth";
import { userLogin } from "@/services/redux/slices/userAuthSlice";
import { adminLogin } from "@/services/redux/slices/adminAuthSlice";
import { CredentialResponse } from "@react-oauth/google";
import LoginForm from "@/components/forms/auth/LoginForm";
import LoginHeader from "@/components/user/authentication/headers/LoginHeader";
import { auth } from "@/services/firebase";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { useUserApi, useUserApiRequest } from "@/hooks/apiHooks";
import ApiEndpoints from "@/constants/api-end-points";

interface UserData {
  user: string;
  user_id: string;
  userToken: string;
  refreshToken: string;
  loggedIn: boolean;
  role: "User" | "Admin";
  mobile: number | undefined;
  profile: string;
}

interface DecodedToken {
  email: string;
  name?: string;
  role?: string;
  exp?: number;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [userData, setUserData] = useState<UserData>({
    user: "",
    user_id: "",
    userToken: "",
    refreshToken: "",
    loggedIn: false,
    role: "User",
    mobile: undefined,
    profile: ""
  });
  const [otpInput, setOtpInput] = useState(false);
  const [otp, setOtp] = useState<number>(0);
  const [counter, setCounter] = useState(40);

  const api = useUserApi();
  const { request, loading, error } = useUserApiRequest<any>();

  const handleGoogleLogin = async (data: CredentialResponse) => {
    try {
      const token = data.credential;
      if (!token) throw new Error("No credential provided");
      const decode = jwtDecode<DecodedToken>(token);

      const response = await request(() =>
        api.post(ApiEndpoints.USER_CHECK_GOOGLE_LOGIN, { email: decode.email })
      );

      if (!response) {
        throw new Error(error || "API request failed");
      }

      if (response.message === "Success") {
        const role = response.role as "User" | "Admin";
        localStorage.setItem("role", role);
        localStorage.setItem(role === "Admin" ? "adminToken" : "userToken", response.token);
        localStorage.setItem(
          role === "Admin" ? "adminRefreshToken" : "refreshToken",
          response.refreshToken
        );

        if (role === "Admin") {
          dispatch(adminLogin({ name: response.name, role, _id: response._id }));
          navigate("/admin/dashboard");
        } else {
          dispatch(userLogin({ user: response.name, user_id: response._id, role, mobile: response.mobile, profile: response.profile }));
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
      toast.error(err instanceof Error ? err.message : "An unknown error occurred");
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