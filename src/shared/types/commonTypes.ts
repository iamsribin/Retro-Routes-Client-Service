interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Message {
  sender: "driver" | "user";
  content: string;
  timestamp: string;
  type: "text" | "image";
  fileUrl?: string;
}

interface NotificationState {
  open: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address: string;
}

interface Feedback {
  ride_id: string;
  date: string;
  rating: number;
  feedback: string;
}

interface Transaction {
  status: "Credited" | "Debited";
  details: string;
  date: string;
  amount: number;
}
interface Wallet {
  balance: number;
  transactions: Transaction[];
}

export type {
  Coordinates,
  Message,
  NotificationState,
  LocationCoordinates,
  Feedback,
  Wallet,
  Transaction
};
