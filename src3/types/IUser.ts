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

export type { Coordinates, User, UserData, DecodedToken};