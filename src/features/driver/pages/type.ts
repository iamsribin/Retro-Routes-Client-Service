import {
  Coordinates,
  Feedback,
  Wallet,
} from "@/shared/types/commonTypes";
import { Aadhar, License, VehicleDetails } from "@/shared/types/driver/driverType";

interface BookingListType {
  _id: string;
  ride_id: string;
  user_id: string;
  userName: string;
  pickupCoordinates: Coordinates;
  dropoffCoordinates: Coordinates;
  pickupLocation: string;
  dropoffLocation: string;
  driver_id: string;
  distance: string;
  price: number;
  date: Date;
  status: "Pending" | "Accepted" | "Confirmed" | "Completed" | "Cancelled";
  paymentMode?: string;
}



interface RideDetailsForProfile {
  completedRides: number;
  cancelledRides: number;
  totalEarnings: number;
}


interface DocumentStatusProps {
  expiryDate: string;
  title: string;
}

interface DriverProfileData {
  name: string;
  email: string;
  mobile: string;
  driverImage: string;
  joiningDate: string;
  account_status: "Good" | "Pending" | "Incomplete" | "Blocked";
  isAvailable: boolean;
  totalRatings: number;
  wallet: Wallet;
  RideDetails: RideDetailsForProfile;
  feedbacks: Feedback[];
  aadhar:Aadhar;
  license: License;
  vehicle_details: VehicleDetails;
}

interface PopupNotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

interface ZoomableImageProps {
  src: string;
  alt: string;
}

interface FormDataType {
  [key: string]: string | undefined;
}

interface FileData {
  [key: string]: File | null;
}

export type {
  BookingListType,
  DriverProfileData,
  DocumentStatusProps,
  PopupNotificationProps,
  ZoomableImageProps,
  FormDataType,
  FileData
}
