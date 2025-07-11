// // ================ user types =================
// interface User {
//   userName: string;
//   userProfile: string;
//   user_id: string;
//   number: string;
// }

// interface UserInterface extends Document {
//   _id: string;
//   name: string;
//   email: string;
//   formattedDate: string;
//   mobile: string;
//   referralCode: string;
//   password: string;
//   userImage: string;
//   referral_code: string;
//   account_status: string;
//   accountStatus: string;
//   joiningDate: string;
//   reason: string;
//   wallet: {
//     balance: number;
//     transactions: {
//       date: Date;
//       details: string;
//       amount: number;
//       status: string;
//     }[];
//   };
//   RideDetails: {
//     completedRides: number;
//     cancelledRides: number;
//   };
// }

// // ================ driver types =================

// interface DriverInterface {
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

// // ===============================  ride and booking  ==============

// interface DriverLocation {
//   latitude: number;
//   longitude: number;
// }

// interface LocationCoordinates {
//   latitude: number;
//   longitude: number;
//   address?: string;
// }

// interface RideDetails {
//   completedRides: number;
//   cancelledRides: number;
//   totalEarnings: number;
// }

// interface BookingListType {
//   _id: string;
//   ride_id: string;
//   user_id: string;
//   userName: string;
//   pickupCoordinates: { latitude: number; longitude: number };
//   dropoffCoordinates: { latitude: number; longitude: number };
//   pickupLocation: string;
//   dropoffLocation: string;
//   driver_id?: string;
//   distance?: string;
//   price?: number;
//   date: Date;
//   status: 'Pending' | 'Accepted' | 'Confirmed' | 'Completed' | 'Cancelled';
//   paymentMode?: string;
// }

//  interface Message {
//   sender: 'driver' | 'user';
//   content: string;
//   timestamp: string;
//   type: 'text' | 'image';
//   fileUrl?: string;
// }

// // interface Message {
// //   messageId: string;
// //   sender: "driver" | "user";
// //   content: string;
// //   timestamp: string;
// //   type: "text" | "image";
// //   fileUrl?: string;
// //   reactions: { emoji: string; sender: string }[];
// // }

// interface DriverDetails {
//   cancelledRides: number;
//   color: string;
//   driverId: string;
//   driverImage: string;
//   driverName: string;
//   mobile: number;
//   number: string;
//   rating: number;
//   vehicleModel: string;
// }
// interface Driver {
//   driverName: string;
//   driverNumber: string;
//   driverProfile: string;
//   driver_id: string;
// }
// interface UserBookingData {
//   date: string;
//   distance: string;
//   driver: Driver;
//   driverCoordinates: Coordinates;
//   dropoffCoordinates: Coordinates;
//   dropoffLocation: string;
//   duration: string;
//   pickupCoordinates: Coordinates;
//   pickupLocation: string;
//   pin: number;
//   price: number;
//   ride_id: string;
//   status: string;
//   user: User;
//   vehicleModel: string;
//   _id: string;
//   __v: number;
// }

// interface RideStatusData {
//   ride_id: string;
//   status:
//     | "searching"
//     | "Accepted"
//     | "DriverComingToPickup"
//     | "RideStarted"
//     | "RideFinished"
//     | "Failed"
//     | "cancelled";
//   message?: string;
//   driverId?: string;
//   booking: UserBookingData;
//   driverCoordinates?: Coordinates;
//   driverDetails?: DriverDetails;
//   chatMessages: Message[];
// }

// // interface Booking {
// //   date: string;
// //   distance: string;
// //   driver: Driver;
// //   driverCoordinates: Coordinates;
// //   dropoffCoordinates: Coordinates;
// //   dropoffLocation: string;
// //   duration: string;
// //   pickupCoordinates: Coordinates;
// //   pickupLocation: string;
// //   pin: number;
// //   price: number;
// //   ride_id: string;
// //   status: string;
// //   user: User;
// //   vehicleModel: string;
// //   _id: string;
// //   __v: number;
// // }

// interface Booking {
//   _id: string;
//   ride_id: string;
//   user: {
//     user_id: string;
//     userName: string;
//     userNumber?: string;
//     userProfile?: string;
//   };
//   driver?: {
//     driver_id: string;
//     driverName: string;
//     driverNumber: string;
//     driverProfile?: string;
//   };
//   pickupCoordinates: { latitude: number; longitude: number };
//   dropoffCoordinates: { latitude: number; longitude: number };
//   pickupLocation: string;
//   dropoffLocation: string;
//   driverCoordinates?: { latitude: number; longitude: number };
//   distance?: string;
//   duration?: string;
//   vehicleModel: string;
//   price?: number;
//   date: Date;
//   status: "Pending" | "Accepted" | "Confirmed" | "Completed" | "Cancelled";
//   pin?: number;
//   paymentMode?: string;
//   feedback?: string;
//   rating?: number;
// }

// interface DriverData {
//   name: string;
//   driverToken: string;
//   driver_id: string;
//   refreshToken: string;
//   role: "Driver";
// }

// //===================== location and others ==================================
// interface DecodedToken {
//   email: string;
//   name?: string;
//   role?: string;
//   exp?: number;
// }

// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

// interface CustomerDetails {
//   id: string;
//   name: string;
//   profileImageUrl?: string;
//   number?:string
// }
// interface DriverRideRequest {
//   requestId: string;
//   customer: CustomerDetails;
//   pickup: LocationCoordinates;
//   dropoff: LocationCoordinates;
//   ride: RideDetails;
//   booking: BookingDetails;
//   requestTimeout: number;
//   requestTimestamp: string;
//   chatMessages: Message[];
//   status: 'accepted' | 'started' | 'completed' | 'cancelled' | 'failed';
// }

// interface Transaction {
//   status: "Credited" | "Debited";
//   details: string;
//   date: string;
//   amount: number;
// }

// interface Wallet {
//   balance: number;
//   transactions: Transaction[];
// }

// interface Wallet {
//   balance: number;
//   transactions: Transaction[];
// }

// // interface RideDetails {
// //   completedRides: number;
// //   cancelledRides: number;
// //   totalEarnings: number;
// // }

// interface Feedback {
//   ride_id: string;
//   date: string;
//   rating: number;
//   feedback: string;
// }

// interface Aadhar {
//   aadharId: string;
//   aadharFrontImageUrl: string;
//   aadharBackImageUrl: string;
// }

// interface License {
//   licenseId: string;
//   licenseFrontImageUrl: string;
//   licenseBackImageUrl: string;
//   licenseValidity: string;
// }

// interface VehicleDetails {
//   registerationID: string;
//   model: string;
//   rcFrondImageUrl: string;
//   rcBackImageUrl: string;
//   rcStartDate: string;
//   rcExpiryDate: string;
//   carFrondImageUrl: string;
//   carBackImageUrl: string;
//   insuranceImageUrl: string;
//   insuranceStartDate: string;
//   insuranceExpiryDate: string;
//   pollutionImageUrl: string;
//   pollutionStartDate: string;
//   pollutionExpiryDate: string;
// }

// interface DriverProfileData {
//   name: string;
//   email: string;
//   mobile: string;
//   driverImage: string;
//   joiningDate: string;
//   account_status: "Good" | "Pending" | "Incomplete" | "Blocked";
//   isAvailable: boolean;
//   totalRatings: number;
//   wallet: Wallet;
//   RideDetails: RideDetails;
//   feedbacks: Feedback[];
//   aadhar: Aadhar;
//   license: License;
//   vehicle_details: VehicleDetails;
// }

//  type {
//     DriverProfileData,
//     Wallet,
//     Transaction,
//     BookingListType,
//     Feedback,
// DriverData,
//   Booking,
//   RideStatusData,
//   Message,
//   DriverRideRequest,
//   BookingDetails,
//   LocationCoordinates,
//   RideDetails,
//   DriverLocation,
//   Coordinates,
//   DriverInterface,
//   User,
//   UserData,
//   DecodedToken,
//   UserInterface,
// };
