import { useEffect, useState } from "react";
import {
  ChevronRight,
  Star,
  MapPin,
  Wallet,
  Car,
  FileText,
  Award,
  Calendar,
  Clock,
  Phone,
  Mail,
  Edit2,
  ToggleRight,
  ToggleLeft,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import driverAxios from "@/services/axios/driverAxios";
import { RootState } from "@/services/redux/store";
import { useNavigate } from "react-router-dom";

// Define TypeScript interfaces (keeping same as original)
interface Transaction {
  date: string;
  details: string;
  amount: number;
  status: "Credited" | "Debited";
}

interface Feedback {
  feedback: string;
  ride_id: string;
  rating: number;
  date: string;
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

interface Wallet {
  balance: number;
  transactions: Transaction[];
}

interface RideDetails {
  completedRides: number;
  cancelledRides: number;
  totalEarnings: number;
}

interface Location {
  longitude: string;
  latitude: string;
}

interface DriverData {
  name: string;
  email: string;
  mobile: number;
  driverImage: string;
  joiningDate: string;
  aadhar: Aadhar;
  license: License;
  location: Location;
  vehicle_details: VehicleDetails;
  account_status: "Good" | "Pending" | "Incomplete" | "Suspended";
  wallet: Wallet;
  RideDetails: RideDetails;
  isAvailable: boolean;
  totalRatings: number;
  feedbacks: Feedback[];
}

// Format date to DD/MM/YYYY
const formatDate = (date: string | Date | null): string => {
  if (!date) return "N/A";
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Calculate days remaining for document expiry
const calculateDaysRemaining = (expiryDate: string | null): number | null => {
  if (!expiryDate) return null;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Component for document status
const DocumentStatus: React.FC<{ expiryDate: string | null; title: string }> = ({ expiryDate, title }) => {
  const daysRemaining = calculateDaysRemaining(expiryDate);

  if (!expiryDate) {
    return (
      <div className="flex items-center gap-1 text-red-500">
        <AlertCircle size={16} />
        <span className="text-xs">Missing</span>
      </div>
    );
  }

  if (daysRemaining !== null && daysRemaining < 0) {
    return (
      <div className="flex items-center gap-1 text-red-500">
        <AlertCircle size={16} />
        <span className="text-xs">Expired</span>
      </div>
    );
  }

  if (daysRemaining !== null && daysRemaining < 30) {
    return (
      <div className="flex items-center gap-1 text-amber-500">
        <AlertCircle size={16} />
        <span className="text-xs">{daysRemaining} days left</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-green-500">
      <CheckCircle size={16} />
      <span className="text-xs">Valid</span>
    </div>
  );
};

export default function DriverProfile() {
  const [activeTab, setActiveTab] = useState<"profile" | "documents" | "earnings" | "feedback">("profile");
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
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
        const { data } = await driverAxios(dispatch).get<DriverData>(`/getDriverDetails/${driverId}`);
        setDriverData(data);
        setIsAvailable(data.isAvailable);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch driver data:", err);
        setError("Unable to load driver profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [dispatch, driverId]);

  const toggleAvailability = () => {
    setIsAvailable((prev) => !prev);
    // TODO: Add API call to update availability status
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
    // Initialize form data based on field
    switch (field) {
      case "rc":
        setFormData({
          rcFrondImageUrl: driverData?.vehicle_details.rcFrondImageUrl,
          rcBackImageUrl: driverData?.vehicle_details.rcBackImageUrl,
          rcStartDate: driverData?.vehicle_details.rcStartDate,
          rcExpiryDate: driverData?.vehicle_details.rcExpiryDate,
        });
        break;
      case "model":
        setFormData({ model: driverData?.vehicle_details.model });
        break;
      case "registerationID":
        setFormData({ registerationID: driverData?.vehicle_details.registerationID });
        break;
      case "carImage":
        setFormData({
          carFrondImageUrl: driverData?.vehicle_details.carFrondImageUrl,
          carBackImageUrl: driverData?.vehicle_details.carBackImageUrl,
        });
        break;
      case "insurance":
        setFormData({
          insuranceImageUrl: driverData?.vehicle_details.insuranceImageUrl,
          insuranceStartDate: driverData?.vehicle_details.insuranceStartDate,
          insuranceExpiryDate: driverData?.vehicle_details.insuranceExpiryDate,
        });
        break;
      case "pollution":
        setFormData({
          pollutionImageUrl: driverData?.vehicle_details.pollutionImageUrl,
          pollutionStartDate: driverData?.vehicle_details.pollutionStartDate,
          pollutionExpiryDate: driverData?.vehicle_details.pollutionExpiryDate,
        });
        break;
      case "location":
        setFormData({
          longitude: driverData?.location.longitude,
          latitude: driverData?.location.latitude,
        });
        break;
      case "license":
        setFormData({
          licenseId: driverData?.license.licenseId,
          licenseFrontImageUrl: driverData?.license.licenseFrontImageUrl,
          licenseBackImageUrl: driverData?.license.licenseBackImageUrl,
          licenseValidity: driverData?.license.licenseValidity,
        });
        break;
      case "aadhar":
        setFormData({
          aadharId: driverData?.aadhar.aadharId,
          aadharFrontImageUrl: driverData?.aadhar.aadharFrontImageUrl,
          aadharBackImageUrl: driverData?.aadhar.aadharBackImageUrl,
        });
        break;
      case "driverImage":
        setFormData({ driverImage: driverData?.driverImage });
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (field: string) => {
    try {
      // Send update to backend
      await driverAxios(dispatch).post(`/updateDriverDetails/${driverId}`, {
        field,
        data: formData,
      });

      // Update resubmission
      await driverAxios(dispatch).post(`/resubmission`, {
        driverId,
        fields: [field],
      });

      // Logout user
      // Assuming you have a logout action in your redux store
      dispatch({ type: "driver/logout" });
      navigate("/login");
    } catch (err) {
      console.error("Failed to update driver data:", err);
      setError("Failed to update data. Please try again.");
    }
    setEditingField(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading driver profile...</div>
      </div>
    );
  }

  if (error || !driverData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-red-600">{error || "Failed to load driver profile."}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold">Driver Profile</h1>
            <div className="flex items-center gap-3 mt-2 md:mt-0">
              <div
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-all duration-300 ${
                  driverData.account_status === "Good"
                    ? "bg-green-500"
                    : driverData.account_status === "Pending"
                    ? "bg-yellow-500"
                    : driverData.account_status === "Incomplete"
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
              >
                <Shield size={14} />
                <span>{driverData.account_status}</span>
              </div>
              <button
                onClick={toggleAvailability}
                className={`flex items-center gap-2 px-4 py-1 rounded-full text-sm transition-all duration-300 hover:opacity-90 ${
                  isAvailable ? "bg-green-500" : "bg-gray-500"
                }`}
              >
                {isAvailable ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {isAvailable ? "Online" : "Offline"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Driver Summary */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative group">
              <img
                src={driverData.driverImage}
                alt={driverData.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow transition-transform duration-300 group-hover:scale-105"
              />
              <button
                onClick={() => handleEdit("driverImage")}
                className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-1 cursor-pointer hover:bg-blue-700 transition-colors duration-300"
              >
                <Edit2 size={14} color="white" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold">{driverData.name}</h2>
              <div className="flex flex-col md:flex-row md:gap-6 text-gray-600 mt-1">
                <div className="flex items-center justify-center md:justify-start gap-1">
                  <Mail size={14} />
                  <span>{driverData.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-1">
                  <Phone size={14} />
                  <span>+91 {driverData.mobile}</span>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{driverData.totalRatings}</span>
                </div>
                <div className="border-l border-gray-300 pl-4">
                  <span className="text-gray-600">Joined on {formatDate(driverData.joiningDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mt-4 md:mt-0">
              <div className="bg-blue-50 p-3 rounded-lg w-full transition-all duration-300 hover:shadow-md">
                <div className="text-blue-600 font-semibold text-center">Wallet Balance</div>
                <div className="text-2xl font-bold text-center">{formatCurrency(driverData.wallet.balance)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {["profile", "documents", "earnings", "feedback"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-3 font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab(tab as "profile" | "documents" | "earnings" | "feedback")}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-6">
        <div className="container mx-auto px-4">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Aadhar Number</span>
                    {editingField === "aadhar" ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          name="aadharId"
                          value={formData.aadharId || ""}
                          onChange={handleInputChange}
                          className="border rounded p-1"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "aadharFrontImageUrl")}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "aadharBackImageUrl")}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSubmit("aadhar")}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            className="bg-gray-300 text-black px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{driverData.aadhar.aadharId}</span>
                        <button
                          onClick={() => handleEdit("aadhar")}
                          className="text-blue-600 hover:underline"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">{driverData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobile</span>
                    <span className="font-medium">+91 {driverData.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joining Date</span>
                    <span className="font-medium">{formatDate(driverData.joiningDate)}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Vehicle Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Registration Number</span>
                    {editingField === "registerationID" ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="registerationID"
                          value={formData.registerationID || ""}
                          onChange={handleInputChange}
                          className="border rounded p-1"
                        />
                        <button
                          onClick={() => handleSubmit("registerationID")}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="bg-gray-300 text-black px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{driverData.vehicle_details.registerationID}</span>
                        <button
                          onClick={() => handleEdit("registerationID")}
                          className="text-blue-600 hover:underline"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vehicle Model</span>
                    {editingField === "model" ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="model"
                          value={formData.model || ""}
                          onChange={handleInputChange}
                          className="border rounded p-1"
                        />
                        <button
                          onClick={() => handleSubmit("model")}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="bg-gray-300 text-black px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{driverData.vehicle_details.model}</span>
                        <button
                          onClick={() => handleEdit("model")}
                          className="text-blue-600 hover:underline"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 text-sm">Completed Rides</div>
                    <div className="text-2xl font-bold">{driverData.RideDetails.completedRides}</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-red-600 text-sm">Cancelled Rides</div>
                    <div className="text-2xl font-bold">{driverData.RideDetails.cancelledRides}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-green-600 text-sm">Rating</div>
                    <div className="text-2xl font-bold flex items-center">
                      {driverData.totalRatings}
                      <Star size={18} className="ml-1 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-purple-600 text-sm">Total Earnings</div>
                    <div className="text-lg font-bold">{formatCurrency(driverData.RideDetails.totalEarnings)}</div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Recent Transactions</h3>
                  <button className="text-blue-600 flex items-center gap-1 text-sm hover:underline">
                    <ChevronRight size={16} />
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {driverData.wallet.transactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b pb-3 last:border-0"
                    >
                      <div>
                        <div className="font-medium">{transaction.details}</div>
                        <div className="text-sm text-gray-500">{formatDate(transaction.date)}</div>
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

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Driving License */}
              <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Driving License</h3>
                  <DocumentStatus expiryDate={driverData.license.licenseValidity} title="License" />
                </div>
                <div className="space-y-4">
                  {editingField === "license" ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        name="licenseId"
                        value={formData.licenseId || ""}
                        onChange={handleInputChange}
                        placeholder="License Number"
                        className="border rounded p-1"
                      />
                      <input
                        type="date"
                        name="licenseValidity"
                        value={formData.licenseValidity?.split("T")[0] || ""}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "licenseFrontImageUrl")}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "licenseBackImageUrl")}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmit("license")}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="bg-gray-300 text-black px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">License Number</span>
                        <span className="font-medium">{driverData.license.licenseId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid Till</span>
                        <span className="font-medium">{formatDate(driverData.license.licenseValidity)}</span>
                      </div>
                      <button
                        onClick={() => handleEdit("license")}
                        className="text-blue-600 flex items-center gap-1 text-sm hover:underline"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Front View</div>
                    <img
                      src={driverData.license.licenseFrontImageUrl}
                      alt="License Front"
                      className="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Back View</div>
                    <img
                      src={driverData.license.licenseBackImageUrl}
                      alt="License Back"
                      className="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Aadhar Card */}
              <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Aadhar Card</h3>
                  <div className="text-green-500 flex items-center gap-1">
                    <CheckCircle size={16} />
                    <span className="text-xs">Verified</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {editingField === "aadhar" ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        name="aadharId"
                        value={formData.aadharId || ""}
                        onChange={handleInputChange}
                        placeholder="Aadhar Number"
                        className="border rounded p-1"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "aadharFrontImageUrl")}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "aadharBackImageUrl")}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmit("aadhar")}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="bg-gray-300 text-black px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Aadhar Number</span>
                        <span className="font-medium">{driverData.aadhar.aadharId}</span>
                      </div>
                      <button
                        onClick={() => handleEdit("aadhar")}
                        className="text-blue-600 flex items-center gap-1 text-sm hover:underline"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Front View</div>
                    <img
                      src={driverData.aadhar.aadharFrontImageUrl}
                      alt="Aadhar Front"
                      className="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Back View</div>
                    <img
                      src={driverData.aadhar.aadharBackImageUrl}
                      alt="Aadhar Back"
                      className="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Registration */}
              <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Vehicle Registration</h3>
                  <DocumentStatus expiryDate={driverData.vehicle_details.rcExpiryDate} title="RC" />
                </div>
                <div className="space-y-4">
                  {editingField === "rc" ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="date"
                        name="rcStartDate"
                        value={formData.rcStartDate?.split("T")[0] || ""}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                      <input
                        type="date"
                        name="rcExpiryDate"
                        value={formData.rcExpiryDate?.split("T")[0] || ""}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "rcFrondImageUrl")}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "rcBackImageUrl")}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmit("rc")}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="bg-gray-300 text-black px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid From</span>
                        <span className="font-medium">{formatDate(driverData.vehicle_details.rcStartDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid Till</span>
                        <span className="font-medium">{formatDate(driverData.vehicle_details.rcExpiryDate)}</span>
                      </div>
                      <button
                        onClick={() => handleEdit("rc")}
                        className="text-blue-600 flex items-center gap-1 text-sm hover:underline"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Front View</div>
                    <img
                      src={driverData.vehicle_details.rcFrondImageUrl}
                      alt="RC Front"
                      className="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Back View</div>
                    <img
                      src={driverData.vehicle_details.rcBackImageUrl}
                      alt="RC Back"
                      className="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Insurance */}
              <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Vehicle Insurance</h3>
                  <DocumentStatus expiryDate={driverData.vehicle_details.insuranceExpiryDate} title="Insurance" />
                </div>
                <div className="space-y-4">
                  {editingField === "insurance" ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="date"
                        name="insuranceStartDate"
                        value={formData.insuranceStartDate?.split("T")[0] || ""}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                      <input
                        type="date"
                        name="insuranceExpiryDate"
                        value={formData.insuranceExpiryDate?.split("T")[0] || ""}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "insuranceImageUrl")}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmit("insurance")}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="bg-gray-300 text-black px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid From</span>
                        <span className="font-medium">{formatDate(driverData.vehicle_details.insuranceStartDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid Till</span>
                        <span className="font-medium">{formatDate(driverData.vehicle_details.insuranceExpiryDate)}</span>
                      </div>
                      <button
                        onClick={() => handleEdit("insurance")}
                        className="text-blue-600 flex items-center gap-1 text-sm hover:underline"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                    </>
                  )}
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-1">Insurance Certificate</div>
                  <img
                    src={driverData.vehicle_details.insuranceImageUrl}
                    alt="Insurance"
                    className="w-full h-40 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>

              {/* Pollution Certificate */}
              <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Pollution Certificate</h3>
                  <DocumentStatus expiryDate={driverData.vehicle_details.pollutionExpiryDate} title="Pollution" />
                </div>
                <div className="space-y-4">
                  {editingField === "pollution" ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="date"
                        name="pollutionStartDate"
                        value={formData.pollutionStartDate?.split("T")[0] || ""}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                      <input
                        type="date"
                        name="pollutionExpiryDate"
                        value={formData.pollutionExpiryDate?.split("T")[0] || ""}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "pollutionImageUrl")}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmit("pollution")}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="bg-gray-300 text-black px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid From</span>
                        <span className="font-medium">{formatDate(driverData.vehicle_details.pollutionStartDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid Till</span>
                        <span className="font-medium">{formatDate(driverData.vehicle_details.pollutionExpiryDate)}</span>
                      </div>
                      <button
                        onClick={() => handleEdit("pollution")}
                        className="text-blue-600 flex items-center gap-1 text-sm hover:underline"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                    </>
                  )}
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-1">Pollution Certificate</div>
                  <img
                    src={driverData.vehicle_details.pollutionImageUrl}
                    alt="Pollution"
                    className="w-full h-40 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>

              {/* Vehicle Images */}
              <div className="bg-white rounded-lg shadow p-6 md:col-span-2 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Vehicle Images</h3>
                  {editingField === "carImage" ? (
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "carFrondImageUrl")}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "carBackImageUrl")}
                      />
                      <button
                        onClick={() => handleSubmit("carImage")}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="bg-gray-300 text-black px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit("carImage")}
                      className="text-blue-600 flex items-center gap-1 text-sm hover:underline"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Front View</div>
                    <img
                      src={driverData.vehicle_details.carFrondImageUrl}
                      alt="Car Front"
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Back View</div>
                    <img
                      src={driverData.vehicle_details.carBackImageUrl}
                      alt="Car Back"
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Location</h3>
                </div>
                <div className="space-y-4">
                  {editingField === "location" ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        name="latitude"
                        value={formData.latitude || ""}
                        onChange={handleInputChange}
                        placeholder="Latitude"
                        className="border rounded p-1"
                      />
                      <input
                        type="text"
                        name="longitude"
                        value={formData.longitude || ""}
                        onChange={handleInputChange}
                        placeholder="Longitude"
                        className="border rounded p-1"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmit("location")}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="bg-gray-300 text-black px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Latitude</span>
                        <span className="font-medium">{driverData.location.latitude}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Longitude</span>
                        <span className="font-medium">{driverData.location.longitude}</span>
                      </div>
                      <button
                        onClick={() => handleEdit("location")}
                        className="text-blue-600 flex items-center gap-1 text-sm hover:underline"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Earnings & Rides Tab */}
          {activeTab === "earnings" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Earnings Summary */}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-base text-gray-500 mb-1">Total Earnings</h3>
                  <div className="text-3xl font-bold">{formatCurrency(driverData.RideDetails.totalEarnings)}</div>
                  <div className="flex items-center mt-2 text-green-500 text-sm">
                    <span>+5.2%</span>
                    <span className="ml-1 text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-base text-gray-500 mb-1">Total Rides</h3>
                  <div className="text-3xl font-bold">{driverData.RideDetails.completedRides}</div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-green-500 text-sm">
                      <span>
                        Completion Rate:{" "}
                        {(
                          (driverData.RideDetails.completedRides /
                            (driverData.RideDetails.completedRides + driverData.RideDetails.cancelledRides)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-base text-gray-500 mb-1">Average Rating</h3>
                  <div className="text-3xl font-bold flex items-center">
                    {driverData.totalRatings}
                    <Star size={24} className="ml-2 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="text-sm text-gray-500 mt-2">Based on {driverData.feedbacks.length} reviews</div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="md:col-span-3 bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Transaction History</h3>
                  <button className="text-blue-600 flex items-center gap-1 text-sm hover:underline"
                  onClick={handleClick}
                  >
                    <ChevronRight size={16} />
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {driverData.wallet.transactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b pb-3 last:border-0 transition-all duration-300 hover:bg-gray-50 p-2 rounded"
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
                          <div className="font-medium">{transaction.details}</div>
                          <div className="text-sm text-gray-500">{formatDate(transaction.date)}</div>
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

              {/* Ride Statistics */}
              <div className="md:col-span-3 bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Ride Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-600 text-sm">Completed Rides</div>
                    <div className="text-2xl font-bold">{driverData.RideDetails.completedRides}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Across {Math.round(driverData.RideDetails.completedRides / 30)} months
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-600 text-sm">Cancelled Rides</div>
                    <div className="text-2xl font-bold">{driverData.RideDetails.cancelledRides}</div>
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

          {/* Feedback Tab */}
          {activeTab === "feedback" && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Customer Feedback</h3>
                  <div className="text-gray-500 text-sm">
                    Average Rating: {driverData.totalRatings}{" "}
                    <Star size={16} className="inline text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
                <div className="space-y-6">
                  {driverData.feedbacks.map((feedback, index) => (
                    <div
                      key={index}
                      className="border-b pb-4 last:border-0 transition-all duration-300 hover:bg-gray-50 p-2 rounded"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-800">Ride #{feedback.ride_id}</div>
                          <div className="text-sm text-gray-500">{formatDate(feedback.date)}</div>
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
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
                    disabled
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Driver Image Edit Modal */}
      {editingField === "driverImage" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Update Driver Image</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "driverImage")}
              className="mb-4"
            />
            {formData.driverImage && (
              <img
                src={formData.driverImage}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full mb-4"
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleSubmit("driverImage")}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingField(null)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}