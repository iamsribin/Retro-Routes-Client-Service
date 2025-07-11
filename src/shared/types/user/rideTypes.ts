import { Coordinates, Message } from "../commonTypes";
import { DriverDetails } from "../driver/driverType";
import { User } from "./userTypes";

interface Booking {
  date: string;
  distance: string;
  pickupCoordinates: Coordinates;
  dropoffCoordinates: Coordinates;
  pickupLocation: string;
  dropoffLocation: string;
  duration: string;
  pin: number;
  price: number;
  ride_id: string;
  status: string;
  vehicleModel: string;
  _id: string;
  __v: number;
}

interface RideStatusData {
  ride_id: string;
  status:
    | "searching"
    | "Accepted"
    | "DriverComingToPickup"
    | "RideStarted"
    | "RideFinished"
    | "Failed"
    | "cancelled";
  message: string;
  booking: Booking;
  driverCoordinates: Coordinates;
  driverDetails: DriverDetails;
  userDetails: User;
  chatMessages: Message[];
}

export type { RideStatusData };
