import { ConfirmationResult } from "firebase/auth";
import { CredentialResponse } from "@react-oauth/google";
import { FormikProps } from "formik";
import { UserAuthData } from "@/shared/types/user/userTypes";

interface DecodedToken {
  email: string;
  name?: string;
  role?: string;
  exp?: number;
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
  userData: UserAuthData;
  setUserData: (value: UserAuthData) => void;
  onGoogleLogin: (data: CredentialResponse) => void;
  setLoading:(value: boolean) => void;
  loading: boolean;
}
 interface SignupFormValues {
  name: string;
  email: string;
  mobile: string;
  password: string;
  re_password: string;
  referred_code: string;
  userImage: File | null;
  otp: string;
}

interface SignupFieldsProps {
  formik: FormikProps<SignupFormValues>;
  userImageUrl: string | null;
  setUserImageUrl: (url: string | null) => void;
}

interface SignupFormProps {
  otpPage: boolean;
  setOtpPage: (value: boolean) => void;
  counter: number;
  setCounter: (value: number) => void;
  otp: number;
  setOtp: (value: number) => void;
  userImageUrl: string | null;
  setUserImageUrl: (url: string | null) => void;
}

export type {LoginFormProps, SignupFieldsProps,SignupFormValues, SignupFormProps, DecodedToken}
