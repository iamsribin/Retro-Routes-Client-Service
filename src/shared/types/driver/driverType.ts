import { Coordinates } from "../commonTypes";

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
  registrationID: string;
  model: string;
  rcFrondImageUrl: string;
  rcBackImageUrl: string;
  carFrondImageUrl: string;
  carBackImageUrl: string;
  rcStartDate: string;
  rcExpiryDate: string;
  insuranceImageUrl: string;
  insuranceStartDate: string;
  insuranceExpiryDate: string;
  pollutionImageUrl: string;
  pollutionStartDate: string;
  pollutionExpiryDate: string;
}

interface DriverInterface {
  _id: string;
  name: string;
  email: string;
  mobile: number;
  driverImage: string;
  aadhar: Aadhar;
  license: License;
  location: Coordinates;
  vehicle_details: VehicleDetails;
  joiningDate: string;
  account_status: string;
  isAvailable: boolean;
  totalRatings: number;
}

interface Aadhar {
  aadharId: string;
  aadharFrontImageUrl: string;
  aadharBackImageUrl: string;
}

interface License {
  licenseId: string;
  licenseFrontImageUrl: string;
  licenseBackImageUrl: string;
  licenseValidity: string;
}

export type {
  DriverDetails,
  DriverAuthData,
  DriverInterface,
  VehicleDetails,
  License,
  Aadhar,
};
