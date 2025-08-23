import React, { useState, useEffect, ChangeEvent } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  Car,
  XCircle,
  Wallet,
  Edit3,
  Eye,
  CreditCard,
  Camera,
  AlertTriangle,
  Save,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import DriverNavbar from "@/features/driver/components/DriverNavbar";
import { Alert, AlertDescription } from "@chakra-ui/react";
import driverAxios from "@/shared/services/axios/driverAxios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { RootState } from "@/shared/services/redux/store";
import { submitUpdatedDriverProfile } from "@/shared/services/api/driverApi";
import { DriverProfileData } from "./type";

interface EditValues {
  name: string;
  profilePhoto: File | null;
}

// Validation Schema
const profileSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  profilePhoto: yup
    .mixed()
    .test("fileSize", "File size must be less than 5MB", (value: any) =>
      value ? value.size <= 5 * 1024 * 1024 : true
    )
    .test("fileType", "Only image files are allowed", (value: any) =>
      value
        ? ["image/jpeg", "image/png", "image/gif"].includes(value.type)
        : true
    ),
});

// Utility Functions
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

const DriverProfile: React.FC = () => {
  const [driverData, setDriverData] = useState<DriverProfileData | null>(null);
  const [isEditing, setIsEditing] = useState({
    name: false,
    profilePhoto: false,
  });
  const [editValues, setEditValues] = useState<EditValues>({
    name: "",
    profilePhoto: null,
  });
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    profilePhoto?: string;
  }>({});
  const [showWarning, setShowWarning] = useState(false);
  const [editingField, setEditingField] = useState<
    "name" | "profilePhoto" | ""
  >("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const driverId = useSelector((state: RootState) => state.driver.driverId);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDriverProfile = async () => {
      if (!driverId) {
        toast.error("Driver ID not found. Please log in again.");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const { data } = await driverAxios(dispatch).get<DriverProfileData>(
          "/get-driver-profile"
        );
        setDriverData(data);
        setEditValues({ name: data.name, profilePhoto: null });
      } catch (error) {
        toast.error("Failed to load profile. Please try again.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchDriverProfile();
  }, [dispatch, navigate, driverId]);

  const handleEditStart = (field: "name" | "profilePhoto") => {
    setEditingField(field);
    setShowWarning(true);
  };

  const handleEditConfirm = async (field: "name" | "profilePhoto") => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
    setShowWarning(false);
    setValidationErrors({});
  };

  const handleEditCancel = (field: "name" | "profilePhoto") => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
    setEditValues((prev) => ({
      ...prev,
      [field]: field === "name" ? driverData?.name || "" : null,
    }));
    setValidationErrors({});
    setEditingField("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditValues((prev) => ({ ...prev, profilePhoto: file }));
      setValidationErrors((prev) => ({ ...prev, profilePhoto: "" }));
    }
  };

  const validateForm = async (
    field: "name" | "profilePhoto"
  ): Promise<boolean> => {
    try {
      await profileSchema.validate(
        { [field]: editValues[field] },
        { abortEarly: false }
      );

      setValidationErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setValidationErrors(errors);
        return false;
      }
      return false;
    }
  };

  const handleSave = async (field: "name" | "profilePhoto") => {
    if (!driverId) {
      toast.error("Driver ID not found. Please log in again.");
      return;
    }
     submitUpdatedDriverProfile(field,editValues,dispatch,setLoading)
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-200 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading || !driverData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-700 animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DriverNavbar />
      <div className="sm:ml-64 mb-16 sm:mb-0 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={
                        editValues.profilePhoto
                          ? URL.createObjectURL(editValues.profilePhoto)
                          : driverData.driverImage
                      }
                      alt={driverData.name}
                    />
                    <AvatarFallback className="text-2xl">
                      {driverData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {!isEditing.profilePhoto ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      onClick={() => handleEditStart("profilePhoto")}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="absolute -bottom-2 -right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() => handleSave("profilePhoto")}
                        disabled={loading || !editValues.profilePhoto}
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() => handleEditCancel("profilePhoto")}
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                  )}

                  {validationErrors.profilePhoto && isEditing.profilePhoto && (
                    <span className="text-red-500 text-xs absolute -bottom-10 left-0">
                      {validationErrors.profilePhoto}
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    {!isEditing.name ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold">
                          {driverData.name}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditStart("name")}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Input
                            name="name"
                            value={editValues.name}
                            onChange={handleInputChange}
                            className="text-2xl font-semibold"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSave("name")}
                            disabled={loading}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCancel("name")}
                            disabled={loading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {validationErrors.name && (
                          <span className="text-red-500 text-xs">
                            {validationErrors.name}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">{driverData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">
                      +91 {driverData.mobile}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <span className="text-gray-700">{driverData.address}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  Active Driver
                </Badge>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Rating
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-bold">
                        {driverData.totalRatings}
                      </span>
                      <div className="flex">
                        {renderStars(driverData.totalRatings)}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Joined</p>
                    <p className="text-lg font-semibold">
                      {formatDate(driverData.joiningDate)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Car className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Completed
                      </p>
                      <p className="text-lg font-semibold">
                        {driverData.completedRides}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Cancelled
                    </p>
                    <p className="text-lg font-semibold">
                      {driverData.cancelledRides}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-4">
                  ₹{driverData.walletBalance.toFixed(2)}
                </div>
                <Button className="w-full">View Transaction History</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Admin Commission Due
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 mb-4">
                  ₹{driverData.adminCommission.toFixed(2)}
                </div>
                <Button className="w-full" variant="outline">
                  Pay Commission
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {showWarning && (
        <Dialog open={showWarning} onOpenChange={setShowWarning}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Important Notice
              </DialogTitle>
            </DialogHeader>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                If you update this field, you will be logged out and can only
                log in after admin verification. You will receive an email
                notification once the verification is complete.
              </AlertDescription>
            </Alert>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() =>
                  handleEditConfirm(editingField as "name" | "profilePhoto")
                }
                className="flex-1"
              >
                Continue
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowWarning(false);
                  setEditingField("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DriverProfile;
