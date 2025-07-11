// import {
//   ResubmissionData,
//   ResubmissionFormValues,
//   Previews,
// } from "@/shared/types/formTypes";
// import { FormikProps } from "formik";
// import { ConfirmationResult } from "firebase/auth";
// import { CredentialResponse } from "@react-oauth/google";
// import { UserData } from "./types";
// import { SignupFormValues } from '@/shared/types/formTypes';


// interface DriverDocumentProp {
//   _id: string;
//   name: string;
//   email: string;
//   mobile: number;
//   driverImage: string;
//   aadhar: {
//     aadharId: string;
//     aadharFrontImageUrl: string;
//     aadharBackImageUrl: string;
//   };
//   license: {
//     licenseId: string;
//     licenseFrontImageUrl: string;
//     licenseBackImageUrl: string;
//     licenseValidity: string;
//   };
//   location: {
//     longitude: string;
//     latitude: string;
//   };
//   vehicle_details: {
//     registrationID: string;
//     model: string;
//     rcFrondImageUrl: string;
//     rcBackImageUrl: string;
//     carFrondImageUrl: string;
//     carBackImageUrl: string;
//     rcStartDate: string;
//     rcExpiryDate: string;
//     insuranceImageUrl: string;
//     insuranceStartDate: string;
//     insuranceExpiryDate: string;
//     pollutionImageUrl: string;
//     pollutionStartDate: string;
//     pollutionExpiryDate: string;
//   };
//   joiningDate: string;
//   account_status: string;
// }

// interface DriverDocumentsTabProps {
//   driver: DriverDocumentProp;
//   setSelectedImage: (value: string | undefined) => void;
// }

// interface DriverDetailsTabProps {
//   driver: DriverInterface;
//   note: string;
//   setNote: (value: string) => void;
//   isRejecting: boolean;
//   setIsRejecting: (value: boolean) => void;
//   selectedFields: string[];
//   setSelectedFields: (value: string[]) => void;
//   handleVerification: (
//     status: "Verified" | "Rejected" | "Good" | "Block",
//     fields?: string[]
//   ) => void;
// }

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   status: string;
//   joinDate: string;
//   vehicle?: string;
//   joiningDate: Date;
//   userImage?: string;
//   mobile: string;
// }



// interface DriverInterface {
//   _id: string;
//   name: string;
//   email: string;
//   mobile: number;
//   driverImage: string;
//   joiningDate: string;
//   account_status: string;
// }




// interface DriverData {
//   name: string;
//   driverToken: string;
//   driver_id: string;
//   refreshToken: string;
//   role: "Driver";
// }









// interface RideDetails {
//   rideId: string;
//   estimatedDistance: string;
//   estimatedDuration: string;
//   fareAmount: number;
//   vehicleType: string;
//   securityPin: number;
// }

// interface BookingDetails {
//   bookingId: string;
//   userId: string;
//   pickupLocation: LocationCoordinates;
//   dropoffLocation: LocationCoordinates;
//   rideDetails: RideDetails;
//   status: 'pending' | 'accepted' | 'declined' | 'cancelled';
//   createdAt: string;
// }





// interface PopupNotificationProps {
//   message: string;
//   type: "success" | "error";
//   onClose: () => void;
// }

// interface DocumentStatusProps {
//   expiryDate: string;
//   title: string;
// }

  
// interface ZoomableImageProps {
//   src: string;
//   alt: string;
// }

  


// interface NotificationDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   type: 'success' | 'error' | 'info';
//   title: string;
//   message: string;
// }
// //  type {
// //     NotificationDialogProps,
// //     ZoomableImageProps,
// // DocumentStatusProps,
// //     PopupNotificationProps,
// // RideNotificationProps,
// // ResubmissionFormProps,
// //   DriverSignupFormProps,
// //   DriverLoginFormProps,
// //   DriverSignupHeaderProps,
// //   DriverLoginHeaderProps,
// //   VehicleSectionProps,
// //   DriverDetailsTabProps,
// //   DriverDocumentsTabProps,
// //   UserListProps,
// //   MapProps
// // };
