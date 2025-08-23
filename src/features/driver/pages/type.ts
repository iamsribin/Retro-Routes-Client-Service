import {
  Coordinates,
} from "@/shared/types/commonTypes";

interface DriverProfileData {
  name: string;
  email: string;
  mobile: string;
  driverImage: string;
  address: string;
  totalRatings: number;
  joiningDate: string;
  completedRides: number;
  cancelledRides: number;
  walletBalance: number;
  adminCommission: number;
}

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

export type {
  BookingListType,
  DriverProfileData,
  // DocumentStatusProps,
  // PopupNotificationProps,
  // ZoomableImageProps,
  // FormDataType,
  // FileData
}
