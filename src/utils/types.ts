import { FormikProps } from 'formik';
import { Dispatch } from 'redux';

export interface SignupFormValues {
  name: string;
  email: string;
  mobile: string;
  password: string;
  re_password: string;
  referred_code: string;
  userImage: File | null;
  otp: string;
}

export interface SignupFormProps {
  otpPage: boolean;
  setOtpPage: (value: boolean) => void;
  counter: number;
  setCounter: (value: number) => void;
  otp: number;
  setOtp: (value: number) => void;
  userImageUrl: string | null;
  setUserImageUrl: (url: string | null) => void;
}

export interface CheckUserParams {
  email: string;
  mobile: string;
  dispatch: Dispatch;
  navigate: (path: string) => void;
  setOtpPage: (value: boolean) => void;
}

export interface SignupFormValues {
  name: string;
  email: string;
  mobile: string;
  password: string;
  re_password: string;
  referred_code: string;
  userImage: File | null;
  otp: string;
}

export interface SignupFormProps {
  otpPage: boolean;
  setOtpPage: (value: boolean) => void;
  counter: number;
  setCounter: (value: number) => void;
  otp: number;
  setOtp: (value: number) => void;
  userImageUrl: string | null;
  setUserImageUrl: (url: string | null) => void;
}

export interface CheckUserParams {
  email: string;
  mobile: string;
  dispatch: Dispatch;
  navigate: (path: string) => void;
  setOtpPage: (value: boolean) => void;
}

export interface ResubmissionData {
  driverId: string;
  fields: string[];
}

export interface ResubmissionFormValues {
  aadharID: string;
  aadharFrontImage: File | null;
  aadharBackImage: File | null;
  licenseID: string;
  licenseFrontImage: File | null;
  licenseBackImage: File | null;
  licenseValidity: string;
  registerationID: string;
  model: string;
  rcFrontImage: File | null;
  rcBackImage: File | null;
  carFrontImage: File | null;
  carBackImage: File | null;
  insuranceImage: File | null;
  insuranceStartDate: string;
  insuranceExpiryDate: string;
  pollutionImage: File | null;
  pollutionStartDate: string;
  pollutionExpiryDate: string;
  driverImage: File | null;
  latitude: number;
  longitude: number;
}

export interface SignupFormValues {
  name: string;
  email: string;
  mobile: string;
  password: string;
  re_password: string;
  referred_code: string;
  userImage: File | null;
  otp: string;
}

export interface SignupFormProps {
  otpPage: boolean;
  setOtpPage: (value: boolean) => void;
  counter: number;
  setCounter: (value: number) => void;
  otp: number;
  setOtp: (value: number) => void;
  userImageUrl: string | null;
  setUserImageUrl: (url: string | null) => void;
}

export interface CheckUserParams {
  email: string;
  mobile: string;
  dispatch: Dispatch;
  navigate: (path: string) => void;
  setOtpPage: (value: boolean) => void;
}

export interface ResubmissionData {
  driverId: string;
  fields: string[];
}

export interface ResubmissionFormValues {
  aadharID: string;
  aadharFrontImage: File | null;
  aadharBackImage: File | null;
  licenseID: string;
  licenseFrontImage: File | null;
  licenseBackImage: File | null;
  licenseValidity: string;
  registerationID: string;
  model: string;
  rcFrontImage: File | null;
  rcBackImage: File | null;
  carFrontImage: File | null;
  carBackImage: File | null;
  insuranceImage: File | null;
  insuranceStartDate: string;
  insuranceExpiryDate: string;
  pollutionImage: File | null;
  pollutionStartDate: string;
  pollutionExpiryDate: string;
  driverImage: File | null;
  latitude: number;
  longitude: number;
}

export interface Previews {
  aadharFront: string | null;
  aadharBack: string | null;
  licenseFront: string | null;
  licenseBack: string | null;
  rcFront: string | null;
  rcBack: string | null;
  carFront: string | null;
  carBack: string | null;
  insurance: string | null;
  pollution: string | null;
  driverImage: string | null;
}