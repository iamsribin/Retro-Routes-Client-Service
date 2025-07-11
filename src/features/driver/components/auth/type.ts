import { FormikProps } from "formik";

interface MapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number, status: any) => void;
}

interface ResubmissionFormValues {
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

interface Previews {
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

interface ResubmissionData {
  driverId: string;
  fields: string[];
}

interface AadhaarSectionProps {
  formik: FormikProps<ResubmissionFormValues>;
  previews: Previews;
  handleFileInput: (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  resubmissionData: ResubmissionData;
}

interface DriverImageSectionProps {
  formik: FormikProps<ResubmissionFormValues>;
  previews: Previews;
  handleFileInput: (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  resubmissionData: ResubmissionData;
}

interface InsurancePollutionSectionProps {
  formik: FormikProps<ResubmissionFormValues>;
  previews: Previews;
  handleFileInput: (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  resubmissionData: ResubmissionData;
}

interface LicenseSectionProps {
  formik: FormikProps<ResubmissionFormValues>;
  previews: Previews;
  handleFileInput: (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  resubmissionData: ResubmissionData;
}

interface LocationSectionProps {
  formik: FormikProps<ResubmissionFormValues>;
  latitude: number;
  longitude: number;
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
  resubmissionData: ResubmissionData;
}
interface VehicleSectionProps {
  formik: FormikProps<ResubmissionFormValues>;
  previews: Previews;
  handleFileInput: (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  resubmissionData: ResubmissionData;
}


interface DriverLoginHeaderProps {
  otpInput: boolean;
  load: boolean;
}

interface DriverSignupHeaderProps {
  otpPage: boolean;
  load: boolean;
}

export type {
  AadhaarSectionProps,
  DriverImageSectionProps,
  InsurancePollutionSectionProps,
  LicenseSectionProps,
  LocationSectionProps,
  MapProps,
  Previews,
  ResubmissionFormValues,
  ResubmissionData,
  VehicleSectionProps,
  DriverLoginHeaderProps,
  DriverSignupHeaderProps,
};
