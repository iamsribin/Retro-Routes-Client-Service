import { DriverAuthData } from "@/shared/types/driver/driverType";
import { CredentialResponse } from "@react-oauth/google";
import { ConfirmationResult } from "firebase/auth";
import { Previews, ResubmissionData, ResubmissionFormValues } from "../auth/type";
import { FormikProps } from "formik";

interface DriverLoginFormProps {
  auth: unknown;
  otpInput: boolean;
  setOtpInput: (value: boolean) => void;
  otp: number;
  setOtp: (value: number) => void;
  load: boolean;
  setLoad: (value: boolean) => void;
  counter: number;
  setCounter: (value: number) => void;
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: (value: ConfirmationResult | null) => void;
  driverData: DriverAuthData;
  setDriverData: (value: DriverAuthData) => void;
  onGoogleLogin: (data: CredentialResponse) => void;
}

interface DriverSignupFormProps {
  otpPage: boolean;
  setOtpPage: (value: boolean) => void;
  counter: number;
  setCounter: (value: number) => void;
  load: boolean;
  setLoad: (value: boolean) => void;
  otp: number;
  setOtp: (value: number) => void;
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: (value: ConfirmationResult | null) => void;
  setStep: (
    step:
      | "credentials"
      | "documents"
      | "location"
      | "driverImage"
      | "vehicle"
      | "insurance"
  ) => void;
}

interface ResubmissionFormProps {
  formik: FormikProps<ResubmissionFormValues>;
  resubmissionData: ResubmissionData;
  previews: Previews;
  setPreviews: React.Dispatch<React.SetStateAction<Previews>>;
  latitude: number;
  longitude: number;
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
  driverId: string | null;
  load: boolean;
}
export type { DriverLoginFormProps, DriverSignupFormProps,ResubmissionFormProps };
