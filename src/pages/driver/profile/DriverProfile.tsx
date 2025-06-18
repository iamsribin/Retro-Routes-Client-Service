import { useEffect, useState, ChangeEvent } from "react";
import {
  ChevronRight,
  Star,
  Wallet,
  Car,
  FileText,
  Award,
  Calendar,
  Phone,
  Mail,
  Edit2,
  ToggleRight,
  ToggleLeft,
  Shield,
  AlertCircle,
  CheckCircle,
  ZoomIn,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import driverAxios from "@/services/axios/driverAxios";
import { RootState } from "@/services/redux/store";
import { useNavigate } from "react-router-dom";
import { driverLogout } from "@/services/redux/slices/driverAuthSlice";
import logoutLocalStorage from "@/utils/localStorage";
import DriverNavbar from "@/components/driver/dashboard/DriverNavbar";
import { format as formatDate } from "date-fns";
import * as yup from "yup";
import { ResubmissionValidation } from "@/utils/validation";

// Define interfaces
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

interface RideDetails {
  completedRides: number;
  cancelledRides: number;
  totalEarnings: number;
}

interface Feedback {
  ride_id: string;
  date: string;
  rating: number;
  feedback: string;
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

interface VehicleDetails {
  registerationID: string;
  model: string;
  rcFrondImageUrl: string;
  rcBackImageUrl: string;
  rcStartDate: string;
  rcExpiryDate: string;
  carFrondImageUrl: string;
  carBackImageUrl: string;
  insuranceImageUrl: string;
  insuranceStartDate: string;
  insuranceExpiryDate: string;
  pollutionImageUrl: string;
  pollutionStartDate: string;
  pollutionExpiryDate: string;
}

interface DriverData {
  name: string;
  email: string;
  mobile: string;
  driverImage: string;
  joiningDate: string;
  account_status: "Good" | "Pending" | "Incomplete" | "Blocked";
  isAvailable: boolean;
  totalRatings: number;
  wallet: Wallet;
  RideDetails: RideDetails;
  feedbacks: Feedback[];
  aadhar: Aadhar;
  license: License;
  vehicle_details: VehicleDetails;
}

// Popup Notification Component
interface PopupNotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const PopupNotification: React.FC<PopupNotificationProps> = ({ message, type, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-xl p-6 w-full max-w-md shadow-lg border-2 ${type === "success" ? "border-green-500" : "border-red-500"}`}>
        <h3 className={`text-xl font-semibold mb-4 ${type === "success" ? "text-green-600" : "text-red-600"}`}>
          {type === "success" ? "Success" : "Error"}
        </h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-2 rounded-lg text-white ${type === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
        >
          OK
        </button>
      </div>
    </div>
  );
};

// Document Status Component
interface DocumentStatusProps {
  expiryDate: string;
  title: string;
}

const DocumentStatus: React.FC<DocumentStatusProps> = ({ expiryDate, title }) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const isExpired = expiry < today;

  return (
    <div
      className={`flex items-center gap-2 text-sm ${isExpired ? "text-red-500" : "text-green-500"}`}
    >
      {isExpired ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
      <span>{isExpired ? `${title} Expired` : `${title} Valid`}</span>
    </div>
  );
};

// Zoomable Image Component
interface ZoomableImageProps {
  src: string;
  alt: string;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt }) => {
  return (
    <div className="relative group">
      <img
        src={src}
        alt={alt}
        className="w-full h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ZoomIn size={24} className="text-white" />
      </div>
    </div>
  );
};

// Utility function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// Utility function to safely format dates
const safelyFormatDate = (dateString: string | undefined, formatString: string): string => {
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date string: ${dateString}`);
    return "Invalid Date";
  }

  return formatDate(date, formatString);
};

// Type for form data (dynamic based on field)
interface FormData {
  [key: string]: string | undefined;
}

// Type for file data
interface FileData {
  [key: string]: File | null;
}

// Type for popup state
interface PopupState {
  message: string;
  type: "success" | "error";
  onClose?: () => void;
}

export default function DriverProfile() {
  const [activeTab, setActiveTab] = useState<"profile" | "documents" | "earnings" | "feedback">("profile");
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [fileData, setFileData] = useState<FileData>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [popup, setPopup] = useState<PopupState | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const driverId = useSelector((state: RootState) => state.driver.driverId);

  const handleClick = () => {
    navigate("/driver/transationHistory");
  };

  useEffect(() => {
    const fetchDriverData = async () => {
      if (!driverId) {
        setError("Driver ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await driverAxios(dispatch).get<DriverData>(`/getDriverDetails`);
        setDriverData(data);
        setIsAvailable(data.isAvailable);
        setError(null);
      } catch (err: unknown) {
        console.error("Failed to fetch driver data:", err);
        setError("Unable to load driver profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [dispatch, driverId]);

  const toggleAvailability = async () => {
    const newAvailability = !isAvailable;
    try {
      await driverAxios(dispatch).post(`/updateDriverDetails/${driverId}`, {
        field: "isAvailable",
        data: { isAvailable: newAvailability },
      });
      setIsAvailable(newAvailability);
      setPopup({
        message: `You are now ${newAvailability ? "Online" : "Offline"}.`,
        type: "success",
      });
    } catch (err: unknown) {
      console.error("Failed to update availability:", err);
      setPopup({
        message: "Failed to update availability status.",
        type: "error",
      });
    }
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
    setFileData({});
    setValidationErrors({});
    if (!driverData) return;

    switch (field) {
      case "rc":
        setFormData({
          rcFrondImageUrl: driverData.vehicle_details.rcFrondImageUrl,
          rcBackImageUrl: driverData.vehicle_details.rcBackImageUrl,
          rcStartDate: driverData.vehicle_details.rcStartDate,
          rcExpiryDate: driverData.vehicle_details.rcExpiryDate,
        });
        break;
      case "model":
        setFormData({ model: driverData.vehicle_details.model });
        break;
      case "registerationID":
        setFormData({ registerationID: driverData.vehicle_details.registerationID });
        break;
      case "carImage":
        setFormData({
          carFrondImageUrl: driverData.vehicle_details.carFrondImageUrl,
          carBackImageUrl: driverData.vehicle_details.carBackImageUrl,
        });
        break;
      case "insurance":
        setFormData({
          insuranceImageUrl: driverData.vehicle_details.insuranceImageUrl,
          insuranceStartDate: driverData.vehicle_details.insuranceStartDate,
          insuranceExpiryDate: driverData.vehicle_details.insuranceExpiryDate,
        });
        break;
      case "pollution":
        setFormData({
          pollutionImageUrl: driverData.vehicle_details.pollutionImageUrl,
          pollutionStartDate: driverData.vehicle_details.pollutionStartDate,
          pollutionExpiryDate: driverData.vehicle_details.pollutionExpiryDate,
        });
        break;
      case "license":
        setFormData({
          licenseId: driverData.license.licenseId,
          licenseFrontImageUrl: driverData.license.licenseFrontImageUrl,
          licenseBackImageUrl: driverData.license.licenseBackImageUrl,
          licenseValidity: driverData.license.licenseValidity,
        });
        break;
      case "aadhar":
        setFormData({
          aadharId: driverData.aadhar.aadharId,
          aadharFrontImageUrl: driverData.aadhar.aadharFrontImageUrl,
          aadharBackImageUrl: driverData.aadhar.aadharBackImageUrl,
        });
        break;
      case "driverImage":
        setFormData({ driverImageUrl: driverData.driverImage });
        break;
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileData((prev) => ({ ...prev, [field]: file }));
      setFormData((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = async (): Promise<boolean> => {
    if (!editingField) return false;

    try {
      const schema = ResubmissionValidation([editingField]);
      const dataToValidate: Record<string, unknown> = {
        ...formData,
        aadharFrontImage: fileData.aadharFrontImageUrl || formData.aadharFrontImageUrl,
        aadharBackImage: fileData.aadharBackImageUrl || formData.aadharBackImageUrl,
        licenseFrontImage: fileData.licenseFrontImageUrl || formData.licenseFrontImageUrl,
        licenseBackImage: fileData.licenseBackImageUrl || formData.licenseBackImageUrl,
        rcFrontImage: fileData.rcFrondImageUrl || formData.rcFrondImageUrl,
        rcBackImage: fileData.rcBackImageUrl || formData.rcBackImageUrl,
        carFrontImage: fileData.carFrondImageUrl || formData.carFrondImageUrl,
        carBackImage: fileData.carBackImageUrl || formData.carBackImageUrl,
        insuranceImage: fileData.insuranceImageUrl || formData.insuranceImageUrl,
        pollutionImage: fileData.pollutionImageUrl || formData.pollutionImageUrl,
        driverImage: fileData.driverImageUrl || formData.driverImageUrl,
      };
      await schema.validate(dataToValidate, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        const errors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (field: string) => {
    const isValid = await validateForm();
    if (!isValid) {
      setPopup({
        message: "Please fix the errors in the form.",
        type: "error",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("field", field);
      formDataToSend.append("data", JSON.stringify(formData));

      if (field === "aadhar") {
        if (fileData.aadharFrontImageUrl) formDataToSend.append("aadharFrontImage", fileData.aadharFrontImageUrl);
        if (fileData.aadharBackImageUrl) formDataToSend.append("aadharBackImage", fileData.aadharBackImageUrl);
      } else if (field === "license") {
        if (fileData.licenseFrontImageUrl) formDataToSend.append("licenseFrontImage", fileData.licenseFrontImageUrl);
        if (fileData.licenseBackImageUrl) formDataToSend.append("licenseBackImage", fileData.licenseBackImageUrl);
      } else if (field === "rc") {
        if (fileData.rcFrondImageUrl) formDataToSend.append("rcFrontImage", fileData.rcFrondImageUrl);
        if (fileData.rcBackImageUrl) formDataToSend.append("rcBackImage", fileData.rcBackImageUrl);
      } else if (field === "carImage") {
        if (fileData.carFrondImageUrl) formDataToSend.append("carFrontImage", fileData.carFrondImageUrl);
        if (fileData.carBackImageUrl) formDataToSend.append("carBackImage", fileData.carBackImageUrl);
      } else if (field === "insurance") {
        if (fileData.insuranceImageUrl) formDataToSend.append("insuranceImage", fileData.insuranceImageUrl);
      } else if (field === "pollution") {
        if (fileData.pollutionImageUrl) formDataToSend.append("pollutionImage", fileData.pollutionImageUrl);
      } else if (field === "driverImage") {
        if (fileData.driverImageUrl) formDataToSend.append("driverImage", fileData.driverImageUrl);
      }

      const { data } = await driverAxios(dispatch).post<{ data: Partial<DriverData> }>(
        `/updateDriverDetails/${driverId}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setDriverData((prev) => {
        if (!prev) return prev;

        if (["model", "registerationID", "rc", "carImage", "insurance", "pollution"].includes(field)) {
          return {
            ...prev,
            vehicle_details: {
              ...prev.vehicle_details,
              ...(data.data.vehicle_details ?? {}),
            },
          };
        }

        if (field === "driverImage") {
          return {
            ...prev,
            driverImage: data.data.driverImage ?? prev.driverImage,
          };
        }

        if (field === "aadhar") {
          return {
            ...prev,
            aadhar: {
              ...prev.aadhar,
              ...(data.data.aadhar ?? {}),
            },
          };
        }

        if (field === "license") {
          return {
            ...prev,
            license: {
              ...prev.license,
              ...(data.data.license ?? {}),
            },
          };
        }

        return prev;
      });

      setPopup({
        message: "Your profile has been updated! We'll verify the changes soon. For security, please sign back in after verification to start riding.",
        type: "success",
        onClose: () => {
          dispatch(driverLogout());
          logoutLocalStorage("Driver");
          navigate("/login");
        },
      });

      setEditingField(null);
      setFileData({});
    } catch (err: any) {
      console.error("Failed to update driver data:", err);
      const errorMessage = err.response?.data?.message || "Failed to update profile. Please try again.";
      setPopup({
        message: errorMessage,
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-700 animate-pulse">Loading driver profile...</div>
      </div>
    );
  }

  if (error || !driverData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-600">{error || "Failed to load driver profile."}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      {popup && (
        <PopupNotification
          message={popup.message}
          type={popup.type}
          onClose={() => {
            setPopup(null);
            if (popup.onClose) popup.onClose();
          }}
        />
      )}
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-64 bg-white shadow-lg">
          <DriverNavbar />
        </div>
        <div className="flex-1">
          <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-3xl font-extrabold tracking-tight">Driver Dashboard</h1>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                      driverData.account_status === "Good"
                        ? "bg-green-500"
                        : driverData.account_status === "Pending"
                        ? "bg-yellow-500"
                        : driverData.account_status === "Incomplete"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  >
                    <Shield size={16} />
                    <span>{driverData.account_status}</span>
                  </div>
                  <button
                    onClick={toggleAvailability}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      isAvailable ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {isAvailable ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    {isAvailable ? "Online" : "Offline"}
                  </button>
                </div>
              </div>
            </div>
          </header>
          <div className="bg-white shadow-lg">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative group">
                  <img
                    src={formData.driverImageUrl || driverData.driverImage}
                    alt={driverData.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                  />
                  <button
                    onClick={() => handleEdit("driverImage")}
                    className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    <Edit2 size={16} color="white" />
                  </button>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-800">{driverData.name}</h2>
                  <div className="flex flex-col md:flex-row md:gap-8 text-gray-600 mt-2">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Mail size={16} />
                      <span>{driverData.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Phone size={16} />
                      <span>+91 {driverData.mobile}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-800">{driverData.totalRatings}</span>
                    </div>
                    <div className="border-l border-gray-300 pl-6">
                      <span className="text-gray-600">
                        Joined on {safelyFormatDate(driverData.joiningDate, "dd MMM yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl shadow-md w-full md:w-64 transition-all duration-300 hover:shadow-lg">
                  <div className="text-blue-600 font-semibold text-center">Wallet Balance</div>
                  <div className="text-3xl font-bold text-center text-gray-800">
                    {formatCurrency(driverData.wallet.balance)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border-b shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4">
              <div className="flex overflow-x-auto">
                {["profile", "documents", "earnings", "feedback"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-6 py-4 font-medium text-lg transition-all duration-300 ${
                      activeTab === tab
                        ? "text-blue-600 border-b-4 border-blue-600"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                    onClick={() => setActiveTab(tab as "profile" | "documents" | "earnings" | "feedback")}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 py-8">
            <div className="container mx-auto px-4">
              {activeTab === "profile" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Name</span>
                        <span className="font-medium text-gray-800">{driverData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium text-gray-800">{driverData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mobile</span>
                        <span className="font-medium text-gray-800">+91 {driverData.mobile}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Joining Date</span>
                        <span className="font-medium text-gray-800">
                          {safelyFormatDate(driverData.joiningDate, "dd MMM yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Details</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Registration Number</span>
                        {editingField === "registerationID" ? (
                          <div className="flex flex-col gap-1">
                            <input
                              type="text"
                              name="registerationID"
                              value={formData.registerationID || ""}
                              onChange={handleInputChange}
                              className="border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {validationErrors.registerationID && (
                              <span className="text-red-500 text-xs">{validationErrors.registerationID}</span>
                            )}
                            <div className="flex gap-3 mt-2">
                              <button
                                onClick={() => handleSubmit("registerationID")}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingField(null)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-800">
                              {driverData.vehicle_details.registerationID}
                            </span>
                            <button
                              onClick={() => handleEdit("registerationID")}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Vehicle Model</span>
                        {editingField === "model" ? (
                          <div className="flex flex-col gap-1">
                            <input
                              type="text"
                              name="model"
                              value={formData.model || ""}
                              onChange={handleInputChange}
                              className="border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {validationErrors.model && (
                              <span className="text-red-500 text-xs">{validationErrors.model}</span>
                            )}
                            <div className="flex gap-3 mt-2">
                              <button
                                onClick={() => handleSubmit("model")}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingField(null)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-800">{driverData.vehicle_details.model}</span>
                            <button
                              onClick={() => handleEdit("model")}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2 transition-all duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-blue-600 text-sm font-medium">Completed Rides</div>
                        <div className="text-2xl font-bold text-gray-800">
                          {driverData.RideDetails.completedRides}
                        </div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-red-600 text-sm font-medium">Cancelled Rides</div>
                        <div className="text-2xl font-bold text-gray-800">
                          {driverData.RideDetails.cancelledRides}
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-green-600 text-sm font-medium">Rating</div>
                        <div className="text-2xl font-bold text-gray-800 flex items-center">
                          {driverData.totalRatings}
                          <Star size={20} className="ml-2 text-yellow-500 fill-yellow-500" />
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-purple-600 text-sm font-medium">Total Earnings</div>
                        <div className="text-xl font-bold text-gray-800">
                          {formatCurrency(driverData.RideDetails.totalEarnings)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2 transition-all duration-300 hover:shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Recent Transactions</h3>
                      <button
                        onClick={handleClick}
                        className="text-blue-600 flex items-center gap-2 text-sm hover:underline"
                      >
                        <ChevronRight size={16} />
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {driverData.wallet.transactions.map((transaction: Transaction, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center border-b pb-4 last:border-0 transition-all duration-300 hover:bg-gray-50 p-2 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                transaction.status === "Credited" ? "bg-green-100" : "bg-red-100"
                              }`}
                            >
                              {transaction.status === "Credited" ? (
                                <CheckCircle size={16} className="text-green-600" />
                              ) : (
                                <AlertCircle size={16} className="text-red-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{transaction.details}</div>
                              <div className="text-sm text-gray-500">
                                {safelyFormatDate(transaction.date, "dd MMM yyyy")}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`font-semibold ${
                              transaction.status === "Credited" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.status === "Credited" ? "+" : "-"} {formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "documents" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Aadhar Card</h3>
                      <div className="text-green-500 flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span className="text-sm">Verified</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {editingField === "aadhar" ? (
                        <div className="flex flex-col gap-4">
                          <div>
                            <input
                              type="text"
                              name="aadharId"
                              value={formData.aadharId || ""}
                              onChange={handleInputChange}
                              placeholder="Aadhar Number"
                              className="border rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {validationErrors.aadharId && (
                              <span className="text-red-500 text-xs">{validationErrors.aadharId}</span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-gray-600 mb-1">Front Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "aadharFrontImageUrl")}
                                className="text-sm"
                              />
                              {validationErrors.aadharFrontImage && (
                                <span className="text-red-500 text-xs">{validationErrors.aadharFrontImage}</span>
                              )}
                              {formData.aadharFrontImageUrl && (
                                <img
                                  src={formData.aadharFrontImageUrl}
                                  alt="Aadhar Front Preview"
                                  className="mt-2 w-full h-32 object-cover rounded-lg"
                                />
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-600 mb-1">Back Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "aadharBackImageUrl")}
                                className="text-sm"
                              />
                              {validationErrors.aadharBackImage && (
                                <span className="text-red-500 text-xs">{validationErrors.aadharBackImage}</span>
                              )}
                              {formData.aadharBackImageUrl && (
                                <img
                                  src={formData.aadharBackImageUrl}
                                  alt="Aadhar Back Preview"
                                  className="mt-2 w-full h-32 object-cover rounded-lg"
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleSubmit("aadhar")}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingField(null)}
                              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Aadhar Number</span>
                            <span className="font-medium text-gray-800">{driverData.aadhar.aadharId}</span>
                          </div>
                          <button
                            onClick={() => handleEdit("aadhar")}
                            className="text-blue-600 flex items-center gap-2 text-sm hover:text-blue-800 transition-colors"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                    {!editingField && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Front View</div>
                          <ZoomableImage src={driverData.aadhar.aadharFrontImageUrl} alt="Aadhar Front" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Back View</div>
                          <ZoomableImage src={driverData.aadhar.aadharBackImageUrl} alt="Aadhar Back" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Driving License</h3>
                      <DocumentStatus expiryDate={driverData.license.licenseValidity} title="License" />
                    </div>
                    <div className="space-y-4">
                      {editingField === "license" ? (
                        <div className="flex flex-col gap-4">
                          <div>
                            <input
                              type="text"
                              name="licenseId"
                              value={formData.licenseId || ""}
                              onChange={handleInputChange}
                              placeholder="License Number"
                              className="border rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {validationErrors.licenseId && (
                              <span className="text-red-500 text-xs">{validationErrors.licenseId}</span>
                            )}
                          </div>
                          <div>
                            <input
                              type="date"
                              name="licenseValidity"
                              value={formData.licenseValidity?.split("T")[0] || ""}
                              onChange={handleInputChange}
                              className="border rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {validationErrors.licenseValidity && (
                              <span className="text-red-500 text-xs">{validationErrors.licenseValidity}</span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-gray-600 mb-1">Front Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "licenseFrontImageUrl")}
                                className="text-sm"
                              />
                              {validationErrors.licenseFrontImage && (
                                <span className="text-red-500 text-xs">{validationErrors.licenseFrontImage}</span>
                              )}
                              {formData.licenseFrontImageUrl && (
                                <img
                                  src={formData.licenseFrontImageUrl}
                                  alt="License Front Preview"
                                  className="mt-2 w-full h-32 object-cover rounded-lg"
                                />
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-600 mb-1">Back Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "licenseBackImageUrl")}
                                className="text-sm"
                              />
                              {validationErrors.licenseBackImage && (
                                <span className="text-red-500 text-xs">{validationErrors.licenseBackImage}</span>
                              )}
                              {formData.licenseBackImageUrl && (
                                <img
                                  src={formData.licenseBackImageUrl}
                                  alt="License Back Preview"
                                  className="mt-2 w-full h-32 object-cover rounded-lg"
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleSubmit("license")}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingField(null)}
                              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">License Number</span>
                            <span className="font-medium text-gray-800">{driverData.license.licenseId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valid Till</span>
                            <span className="font-medium text-gray-800">
                              {safelyFormatDate(driverData.license.licenseValidity, "dd MMM yyyy")}
                            </span>
                          </div>
                          <button
                            onClick={() => handleEdit("license")}
                            className="text-blue-600 flex items-center gap-2 text-sm hover:text-blue-800 transition-colors"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                    {!editingField && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Front View</div>
                          <ZoomableImage src={driverData.license.licenseFrontImageUrl} alt="License Front" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Back View</div>
                          <ZoomableImage src={driverData.license.licenseBackImageUrl} alt="License Back" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Vehicle Registration</h3>
                      <DocumentStatus expiryDate={driverData.vehicle_details.rcExpiryDate} title="RC" />
                    </div>
                    <div className="space-y-4">
                      {editingField === "rc" ? (
                        <div className="flex flex-col gap-4">
                          <div>
                            <input
                              type="date"
                              name="rcStartDate"
                              value={formData.rcStartDate?.split("T")[0] || ""}
                              onChange={handleInputChange}
                              className="border rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {validationErrors.rcStartDate && (
                              <span className="text-red-500 text-xs">{validationErrors.rcStartDate}</span>
                            )}
                          </div>
                          <div>
                            <input
                              type="date"
                              name="rcExpiryDate"
                              value={formData.rcExpiryDate?.split("T")[0] || ""}
                              onChange={handleInputChange}
                              className="border rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {validationErrors.rcExpiryDate && (
                              <span className="text-red-500 text-xs">{validationErrors.rcExpiryDate}</span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-gray-600 mb-1">Front Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "rcFrondImageUrl")}
                                className="text-sm"
                              />
                              {validationErrors.rcFrontImage && (
                                <span className="text-red-500 text-xs">{validationErrors.rcFrontImage}</span>
                              )}
                              {formData.rcFrondImageUrl && (
                                <img
                                  src={formData.rcFrondImageUrl}
                                  alt="RC Front Preview"
                                  className="mt-2 w-full h-32 object-cover rounded-lg"
                                />
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-600 mb-1">Back Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "rcBackImageUrl")}
                                className="text-sm"
                              />
                              {validationErrors.rcBackImage && (
                                <span className="text-red-500 text-xs">{validationErrors.rcBackImage}</span>
                              )}
                              {formData.rcBackImageUrl && (
                                <img
                                  src={formData.rcBackImageUrl}
                                  alt="RC Back Preview"
                                  className="mt-2 w-full h-32 object-cover rounded-lg"
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleSubmit("rc")}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingField(null)}
                              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valid From</span>
                            <span className="font-medium text-gray-800">
                              {safelyFormatDate(driverData.vehicle_details.rcStartDate, "dd MMM yyyy")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valid Till</span>
                            <span className="font-medium text-gray-800">
                              {safelyFormatDate(driverData.vehicle_details.rcExpiryDate, "dd MMM yyyy")}
                            </span>
                          </div>
                          <button
                            onClick={() => handleEdit("rc")}
                            className="text-blue-600 flex items-center gap-2 text-sm hover:text-blue-800 transition-colors"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                    {!editingField && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Front View</div>
                          <ZoomableImage src={driverData.vehicle_details.rcFrondImageUrl} alt="RC Front" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Back View</div>
                          <ZoomableImage src={driverData.vehicle_details.rcBackImageUrl} alt="RC Back" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Vehicle Insurance</h3>
                      <DocumentStatus expiryDate={driverData.vehicle_details.insuranceExpiryDate} title="Insurance" />
                    </div>
                    <div className="space-y-4">
                      {editingField === "insurance" ? (
                        <div className="flex flex-col gap-4">
                          <div>
                            <input
                              type="date"
                              name="insuranceStartDate"
                              value={formData.insuranceStartDate?.split("T")[0] || ""}
                              onChange={handleInputChange}
                              className="border rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {validationErrors.insuranceStartDate && (
                              <span className="text-red-500 text-xs">{validationErrors.insuranceStartDate}</span>
                            )}
                          </div>
                          <div>
                            <input
                              type="date"
                              name="insuranceExpiryDate"
                              value={formData.insuranceExpiryDate?.split("T")[0] || ""}
                              onChange={handleInputChange}
                              className="border rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {validationErrors.insuranceExpiryDate && (
                              <span className="text-red-500 text-xs">{validationErrors.insuranceExpiryDate}</span>
                            )}
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1">Insurance Certificate</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, "insuranceImageUrl")}
                              className="text-sm"
                            />
                            {validationErrors.insuranceImage && (
                              <span className="text-red-500 text-xs">{validationErrors.insuranceImage}</span>
                            )}
                            {formData.insuranceImageUrl && (
                              <img
                                src={formData.insuranceImageUrl}
                                alt="Insurance Preview"
                                className="mt-2 w-full h-40 object-cover rounded-lg"
                              />
                            )}
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleSubmit("insurance")}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingField(null)}
                              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valid From</span>
                            <span className="font-medium text-gray-800">
                              {safelyFormatDate(driverData.vehicle_details.insuranceStartDate, "dd MMM yyyy")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valid Till</span>
                            <span className="font-medium text-gray-800">
                              {safelyFormatDate(driverData.vehicle_details.insuranceExpiryDate, "dd MMM yyyy")}
                            </span>
                          </div>
                          <button
                            onClick={() => handleEdit("insurance")}
                            className="text-blue-600 flex items-center gap-2 text-sm hover:text-blue-800 transition-colors"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                    {!editingField && (
                      <div className="mt-4">
                        <div className="text-sm text-gray-600 mb-1">Insurance Certificate</div>
                        <ZoomableImage src={driverData.vehicle_details.insuranceImageUrl} alt="Insurance" />
                      </div>
                    )}
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Pollution Certificate</h3>
                      <DocumentStatus expiryDate={driverData.vehicle_details.pollutionExpiryDate} title="Pollution" />
                    </div>
                    <div className="space-y-4">
                      {editingField === "pollution" ? (
                        <div className="flex flex-col gap-4">
                          <div>
                            <input
                              type="date"
                              name="pollutionStartDate"
                              value={formData.pollutionStartDate?.split("T")[0] || ""}
                              onChange={handleInputChange}
                              className="border rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {validationErrors.pollutionStartDate && (
                              <span className="text-red-500 text-xs">{validationErrors.pollutionStartDate}</span>
                            )}
                          </div>
                          <div>
                            <input
                              type="date"
                              name="pollutionExpiryDate"
                              value={formData.pollutionExpiryDate?.split("T")[0] || ""}
                              onChange={handleInputChange}
                              className="border rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {validationErrors.pollutionExpiryDate && (
                              <span className="text-red-500 text-xs">{validationErrors.pollutionExpiryDate}</span>
                            )}
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1">Pollution Certificate</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, "pollutionImageUrl")}
                              className="text-sm"
                            />
                            {validationErrors.pollutionImage && (
                              <span className="text-red-500 text-xs">{validationErrors.pollutionImage}</span>
                            )}
                            {formData.pollutionImageUrl && (
                              <img
                                src={formData.pollutionImageUrl}
                                alt="Pollution Preview"
                                className="mt-2 w-full h-40 object-cover rounded-lg"
                              />
                            )}
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleSubmit("pollution")}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingField(null)}
                              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valid From</span>
                            <span className="font-medium text-gray-800">
                              {safelyFormatDate(driverData.vehicle_details.pollutionStartDate, "dd MMM yyyy")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valid Till</span>
                            <span className="font-medium text-gray-800">
                              {safelyFormatDate(driverData.vehicle_details.pollutionExpiryDate, "dd MMM yyyy")}
                            </span>
                          </div>
                          <button
                            onClick={() => handleEdit("pollution")}
                            className="text-blue-600 flex items-center gap-2 text-sm hover:text-blue-800 transition-colors"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                    {!editingField && (
                      <div className="mt-4">
                        <div className="text-sm text-gray-600 mb-1">Pollution Certificate</div>
                        <ZoomableImage src={driverData.vehicle_details.pollutionImageUrl} alt="Pollution" />
                      </div>
                    )}
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2 transition-all duration-300 hover:shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Vehicle Images</h3>
                      {editingField === "carImage" ? (
                        <div className="flex gap-3">
                          <div>
                            <label className="text-sm text-gray-600 mb-1">Front Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, "carFrondImageUrl")}
                              className="text-sm"
                            />
                            {validationErrors.carFrontImage && (
                              <span className="text-red-500 text-xs">{validationErrors.carFrontImage}</span>
                            )}
                            {formData.carFrondImageUrl && (
                              <img
                                src={formData.carFrondImageUrl}
                                alt="Car Front Preview"
                                className="mt-2 w-full h-48 object-cover rounded-lg"
                              />
                            )}
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1">Back Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, "carBackImageUrl")}
                              className="text-sm"
                            />
                            {validationErrors.carBackImage && (
                              <span className="text-red-500 text-xs">{validationErrors.carBackImage}</span>
                            )}
                            {formData.carBackImageUrl && (
                              <img
                                src={formData.carBackImageUrl}
                                alt="Car Back Preview"
                                className="mt-2 w-full h-48 object-cover rounded-lg"
                              />
                            )}
                          </div>
                          <div className="flex gap-3 items-end">
                            <button
                              onClick={() => handleSubmit("carImage")}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingField(null)}
                              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit("carImage")}
                          className="text-blue-600 flex items-center gap-2 text-sm hover:text-blue-800 transition-colors"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                      )}
                    </div>
                    {!editingField && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Front View</div>
                          <ZoomableImage src={driverData.vehicle_details.carFrondImageUrl} alt="Car Front" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Back View</div>
                          <ZoomableImage src={driverData.vehicle_details.carBackImageUrl} alt="Car Back" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "earnings" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                      <h3 className="text-base text-gray-500 mb-1">Total Earnings</h3>
                      <div className="text-3xl font-bold text-gray-800">
                        {formatCurrency(driverData.RideDetails.totalEarnings)}
                      </div>
                      <div className="flex items-center mt-2 text-green-500 text-sm">
                        <span>+5.2%</span>
                        <span className="ml-1 text-xs text-gray-500">vs last month</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                      <h3 className="text-base text-gray-500 mb-1">Total Rides</h3>
                      <div className="text-3xl font-bold text-gray-800">
                        {driverData.RideDetails.completedRides}
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-green-500 text-sm">
                          Completion Rate:{" "}
                          {(
                            (driverData.RideDetails.completedRides /
                              (driverData.RideDetails.completedRides + driverData.RideDetails.cancelledRides)) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                      <h3 className="text-base text-gray-500 mb-1">Average Rating</h3>
                      <div className="text-3xl font-bold text-gray-800 flex items-center">
                        {driverData.totalRatings}
                        <Star size={24} className="ml-2 text-yellow-500 fill-yellow-500" />
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Based on {driverData.feedbacks.length} reviews
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-3 bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Transaction History</h3>
                      <button
                        onClick={handleClick}
                        className="text-blue-600 flex items-center gap-2 text-sm hover:text-blue-800"
                      >
                        <ChevronRight size={16} />
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {driverData.wallet.transactions.map((transaction: Transaction, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center border-b pb-4 last:border-0 transition-all duration-300 hover:bg-gray-50 p-2 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                transaction.status === "Credited" ? "bg-green-100" : "bg-red-100"
                              }`}
                            >
                              {transaction.status === "Credited" ? (
                                <CheckCircle size={16} className="text-green-600" />
                              ) : (
                                <AlertCircle size={16} className="text-red-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{transaction.details}</div>
                              <div className="text-sm text-gray-500">
                                {safelyFormatDate(transaction.date, "dd MMM yyyy")}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`font-semibold ${
                              transaction.status === "Credited" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.status === "Credited" ? "+" : "-"} {formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-3 bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Ride Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-gray-600 text-sm font-medium">Completed Rides</div>
                        <div className="text-2xl font-bold text-gray-800">
                          {driverData.RideDetails.completedRides}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Across {Math.round(driverData.RideDetails.completedRides / 30)} months
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-gray-600 text-sm font-medium">Cancelled Rides</div>
                        <div className="text-2xl font-bold text-gray-800">
                          {driverData.RideDetails.cancelledRides}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {(
                            (driverData.RideDetails.cancelledRides /
                              (driverData.RideDetails.completedRides + driverData.RideDetails.cancelledRides)) *
                            100
                          ).toFixed(1)}
                          % of total
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "feedback" && (
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Customer Feedback</h3>
                      <div className="text-gray-500 text-sm">
                        Average Rating: {driverData.totalRatings}{" "}
                        <Star size={16} className="inline text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      {driverData.feedbacks.map((feedback: Feedback, index: number) => (
                        <div
                          key={index}
                          className="border-b pb-4 last:border-0 transition-all duration-300 hover:bg-gray-50 p-2 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-800">Ride #{feedback.ride_id}</div>
                              <div className="text-sm text-gray-500">
                                {safelyFormatDate(feedback.date, "dd MMM yyyy")}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < feedback.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-gray-600">{feedback.feedback}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-center gap-3">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled
                      >
                        Previous
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {editingField === "driverImage" && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Update Driver Image</h3>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "driverImageUrl")}
                    className="mb-4 text-sm"
                  />
                  {validationErrors.driverImage && (
                    <span className="text-red-500 text-xs">{validationErrors.driverImage}</span>
                  )}
                </div>
                {formData.driverImageUrl && (
                  <img
                    src={formData.driverImageUrl}
                    alt="Driver Preview"
                    className="w-32 h-32 object-cover rounded-full mb-4 mx-auto"
                  />
                )}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => handleSubmit("driverImage")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}