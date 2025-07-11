import { DriverInterface } from "@/shared/types/driver/driverType";

interface DriverDetailsTabProps {
  driver: DriverInterface;
  note: string;
  setNote: (value: string) => void;
  isRejecting: boolean;
  setIsRejecting: (value: boolean) => void;
  selectedFields: string[];
  setSelectedFields: (value: string[]) => void;
  handleVerification: (
    status: "Verified" | "Rejected" | "Good" | "Block",
    fields?: string[]
  ) => void;
}

interface DriverDocumentsTabProps {
  driver: DriverInterface;
  setSelectedImage: (value: string | undefined) => void;
}

export type {DriverDetailsTabProps, DriverDocumentsTabProps}