import { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "sonner";
import { ResubmissionValidation } from "@/shared/utils/validation";
import ResubmissionHeader from "../../components/auth/resubmission/ResubmissionHeader";
import ResubmissionForm from "@/features/driver/components/forms/ResubmissionForm";
import Loader from "@/shared/components/loaders/shimmer";
import DriverPhotoPage from "./DriverIdentificationPage";
import LoadingSpinner from "@/shared/components/loaders/LoadingSpinner";
import {
  Previews,
  ResponseCom,
  ResubmissionData,
  ResubmissionFormValues,
} from "@/shared/types/commonTypes";
import { getItem, removeItem } from "@/shared/utils/localStorage";
import { fetchData, postData } from "@/shared/services/api/api-service";
import DriverApiEndpoints from "@/constants/driver-api-end-pontes";

const ResubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const [resubmissionData, setResubmissionData] =
    useState<ResubmissionData | null>(null);
  const [photoPage, setPhotoPage] = useState(false);
  const [load, setLoad] = useState(false);
  const [previews, setPreviews] = useState<Previews>({
    aadharFront: null,
    aadharBack: null,
    licenseFront: null,
    licenseBack: null,
    rcFront: null,
    rcBack: null,
    carFront: null,
    carBack: null,
    insurance: null,
    pollution: null,
    driverImage: null,
  });
  const [latitude, setLatitude] = useState(23.226390067116835);
  const [longitude, setLongitude] = useState(79.17271614074708);

  const driverId = getItem("driverId");

  useEffect(() => {
    const controller = new AbortController();
    const fetchResubmissionData = async () => {
      const data = await fetchData<ResponseCom>(
        DriverApiEndpoints.DRIVER_RESUBMISSION + `/${driverId}`,
        "Driver"
      );

      const fields: string[] = data.data?.fields;
      if (!Array.isArray(fields)) {
        throw new Error("Fields is not an array");
      }

      const fixedData = {
        ...data.data,
        fields,
      };

      setResubmissionData(fixedData);
    };
    fetchResubmissionData();
    removeItem("role");
    return () => controller.abort();
  }, [driverId, navigate]);

  const formik = useFormik<ResubmissionFormValues>({
    initialValues: {
      aadharID: "",
      aadharFrontImage: null,
      aadharBackImage: null,
      licenseID: "",
      licenseFrontImage: null,
      licenseBackImage: null,
      licenseValidity: "",
      registrationId: "",
      model: "",
      rcFrontImage: null,
      rcBackImage: null,
      carFrontImage: null,
      carBackImage: null,
      insuranceImage: null,
      insuranceStartDate: "",
      insuranceExpiryDate: "",
      pollutionImage: null,
      pollutionStartDate: "",
      pollutionExpiryDate: "",
      driverImage: null,
      latitude,
      longitude,
    },
    validationSchema: ResubmissionValidation(resubmissionData?.fields || []),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const formData = new FormData();
      const fieldMappings: { [key: string]: string[] } = {
        aadhar: ["aadharID", "aadharFrontImage", "aadharBackImage"],
        license: [
          "licenseID",
          "licenseFrontImage",
          "licenseBackImage",
          "licenseValidity",
        ],
        registrationId: ["registrationId"],
        model: ["model"],
        rc: ["rcFrontImage", "rcBackImage"],
        carImage: ["carFrontImage", "carBackImage"],
        insurance: [
          "insuranceImage",
          "insuranceStartDate",
          "insuranceExpiryDate",
        ],
        pollution: [
          "pollutionImage",
          "pollutionStartDate",
          "pollutionExpiryDate",
        ],
        driverImage: ["driverImage"],
        location: ["latitude", "longitude"],
      };

      resubmissionData?.fields.forEach((field) => {
        const fieldsToAppend = fieldMappings[field] || [];
        fieldsToAppend.forEach((key) => {
          const value = values[key as keyof ResubmissionFormValues];
          if (value !== null && value !== "")
            formData.append(key, value as string | Blob);
        });
      });

      try {
        await postData(
          `${DriverApiEndpoints.DRIVER_RESUBMISSION}?driverId=${driverId}`,
          "Driver",
          formData
        );
        toast.success("Resubmission successfully completed");
        navigate("/driver/login");
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || error.message || "Unknown error"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (load || !resubmissionData)
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader />
      </div>
    );
  if (photoPage) return <DriverPhotoPage />;

  return (
    <div className="driver-registration-container h-screen flex justify-center items-center bg-white">
      <div className="w-6/7 md:w-5/6 md:h-5/6 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
        <Suspense fallback={<LoadingSpinner />}>
          <ResubmissionHeader />
          <ResubmissionForm
            formik={formik}
            resubmissionData={resubmissionData}
            previews={previews}
            setPreviews={setPreviews}
            latitude={latitude}
            longitude={longitude}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
            driverId={driverId}
            load={load}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ResubmissionPage;
