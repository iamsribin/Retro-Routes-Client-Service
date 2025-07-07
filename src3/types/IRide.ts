import { Message } from "yup";
import { DriverDetails } from "./IDriver";
import { Coordinates, User } from "./IUser";
import { Driver } from "framer-motion";

interface RideStatusData {
  ride_id: string;
  status: "searching" | "Accepted" | "DriverComingToPickup" | "RideStarted" | "RideFinished" | "Failed" | "cancelled";
  message?: string;
  driverId?: string;
  booking?: Booking;
  driverCoordinates?: Coordinates;
  driverDetails?: DriverDetails;
  chatMessages: Message[];
}

interface Booking {
  date: string;
  distance: string;
  driver: Driver;
  driverCoordinates: Coordinates;
  dropoffCoordinates: Coordinates;
  dropoffLocation: string;
  duration: string;
  pickupCoordinates: Coordinates;
  pickupLocation: string;
  pin: number;
  price: number;
  ride_id: string;
  status: string;
  user: User;
  vehicleModel: string;
  _id: string;
  __v: number;
}

export type {RideStatusData, Booking}