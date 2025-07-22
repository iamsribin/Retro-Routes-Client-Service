import { Feedback, LocationCoordinates } from "../commonTypes";

interface DriverDetails {
  color: string;
  driverId: string;
  driverImage: string;
  driverName: string;
  mobile: number;
  number: string;
  rating: number;
  vehicleModel: string;
  vehicleNumber: string;
}

interface DriverAuthData {
  name: string;
  driverToken: string;
  driver_id: string;
  refreshToken: string;
  role: "Driver";
}

interface VehicleDetails {
    registrationId: string;
    number: string;
    color: string;
    model: string;
    rcFrontImageUrl: string;
    rcBackImageUrl: string;
    carFrontImageUrl: string;
    carBackImageUrl: string;
    rcStartDate: Date;
    rcExpiryDate: Date;
    insuranceImageUrl: string;
    insuranceStartDate: Date;
    insuranceExpiryDate: Date;
    pollutionImageUrl: string;
    pollutionStartDate: Date;
    pollutionExpiryDate: Date;
  }

 interface DriverInterface {
  _id:string;
  name: string;
  email: string;
  mobile: number;
  adminCommission?: number;
  password: string;
  driverImage: string;
  referralCode: string;
  joiningDate: Date;
  aadhar: Aadhar;
  license:License;
  location: LocationCoordinates;
  vehicleDetails:VehicleDetails;
  accountStatus: "Good" | "Warning" | "Rejected" | "Blocked" | "Pending" | "Incomplete";
  wallet?: wallet;

  rideDetails?: {
    completedRides?: number;
    cancelledRides?: number;
    totalEarnings?: {amount:number, date: Date}[];

  };

  isAvailable: boolean;
  totalRatings?: number;

  feedbacks?: Feedback[];

  createdAt?: Date;
  updatedAt?: Date;
}

interface Aadhar {
    id: string;
    frontImageUrl: string;
    backImageUrl: string;
  }
interface wallet {
    balance: number;
    transactions?: {
      date: Date;
      details: string;
      rideId: string;
      amount: number;
      status: "credit" | "debit";
    }[];
  }

interface License {
    id: string;
    frontImageUrl: string;
    backImageUrl: string;
    validity: Date;
  }

export type {
  DriverDetails,
  DriverAuthData,
  DriverInterface,
  VehicleDetails,
  License,
  Aadhar,
};
