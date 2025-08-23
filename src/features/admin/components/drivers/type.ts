import { DriverInterface } from "@/shared/types/driver/driverType";

// Add this to your existing type.ts file

interface DriverAccountTabProps {
  driver: (Omit<DriverInterface, 'password' | 'referralCode' | '_id'> & { _id: string });
  onNavigateToTransactions?: (driverId: string) => void;
  onNavigateToFeedback?: (driverId: string) => void;
  onSendCommissionMail?: (driverId: string, commissionAmount: number) => void;
}

// Also add Feedback interface if not already present
interface Feedback {
  id: string;
  rating: number;
  comment: string;
  date: Date;
  rideId?: string;
  customerId?: string;
}

interface DriverDetailsTabProps {
  driver: (Omit<DriverInterface, 'password' | 'referralCode' | '_id'>);
  note: string;
  setNote: (value: string) => void;
  isRejecting: boolean;
  setIsRejecting: (value: boolean) => void;
  selectedFields: string[];
  setSelectedFields: (value: string[]) => void;
  handleVerification: (
    status: "Rejected" | "Good" | "Blocked",
    fields?: string[]
  ) => void;
}

interface DriverDocumentsTabProps {
  driver: (Omit<DriverInterface, 'password' | 'referralCode' | '_id'> & { _id: string });
  setSelectedImage: (value: string | undefined) => void;
}

export type {DriverDetailsTabProps,
   DriverDocumentsTabProps, 
  DriverAccountTabProps,
  Feedback
}