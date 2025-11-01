export type Role = "Admin" | "Driver" | "User";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Message {
  sender: "driver" | "user";
  content: string;
  timestamp: string;
  type: "text" | "image";
  fileUrl?: string;
}

interface NotificationState {
  open: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address:string;
}

interface Feedback {
    feedback: string;
    rideId: string;
    rating: number;
    date: string;
  }

interface Transaction {
  status: "Credited" | "Debited";
  details: string;
  date: string;
  amount: number;
}
interface Wallet {
  balance: number;
  transactions: Transaction[];
}

interface RideDetailsForBooking {
  rideId: string;
  estimatedDistance: string;
  estimatedDuration: string;
  fareAmount: number;
  vehicleType: string;
  securityPin: number;
}


interface CustomerDetails {
  id: string;
  name: string;
  profileImageUrl?: string;
  number?:string
}

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ResubmissionData {
  driverId: string;
  fields: string[];
}

interface ResubmissionFormValues {
  aadharID: string;
  aadharFrontImage: File | null;
  aadharBackImage: File | null;
  licenseID: string;
  licenseFrontImage: File | null;
  licenseBackImage: File | null;
  licenseValidity: string;
  registrationId: string;
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

export interface ResponseCom{
 data :any
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

 interface AdminAllowedVehicleModel {
  _id: string;
  vehicleModel: string;
  image: string;
  minDistanceKm: string;
  basePrice: number;
  pricePerKm: number;
  eta: string;
  features: string[];
}

export type {
  Previews,
  Coordinates,
  Message,
  NotificationState,
  LocationCoordinates,
  Feedback,
  Wallet,
  Transaction,
  RideDetailsForBooking,
  CustomerDetails,
  ResubmissionData,
  NotificationDialogProps,
  ResubmissionFormValues,
  AdminAllowedVehicleModel
};

