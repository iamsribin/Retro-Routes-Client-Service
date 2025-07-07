import { Coordinates } from "./ILocation";

interface User {
  userName: string;
  userProfile: string;
  user_id: string;
  number: string;
}

interface UserData {
  user: string;
  user_id: string;
  userToken: string;
  refreshToken: string;
  loggedIn: boolean;
  role: "User" | "Admin";
  mobile: number | undefined;
  profile: string;
}

interface DecodedToken {
  email: string;
  name?: string;
  role?: string;
  exp?: number;
}

 interface UserInterface extends Document {
    _id:string;
    name: string;
    email: string;
    formattedDate: string;
    mobile: string;
    referralCode:string;
    password: string;
    userImage: string;
    referral_code: string;
    account_status: string;
    accountStatus:string;
    joiningDate: string;
    reason: string;
    wallet: {
        balance: number;
        transactions: {
            date: Date;
            details: string;
            amount: number;
            status: string;
        }[];
    };
    RideDetails: {
        completedRides: number;
        cancelledRides: number;
    };
}

export type { Coordinates, User, UserData, DecodedToken, UserInterface};