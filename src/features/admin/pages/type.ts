
export interface Res_getDriversListByAccountStatus {
    id: string;
    name: string;
    email: string;
    mobile: number;
    joiningDate: string;
    accountStatus: "Good" | "Rejected" | "Blocked" | "Pending" | "Incomplete";
    vehicle: string;
    driverImage:string;
  }
