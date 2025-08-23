import { NavigateFunction } from "react-router-dom";
import axiosDriver from "@/shared/services/axios/driverAxios";
import ApiEndpoints from "@/constants/api-end-pointes";
import { Dispatch } from "@reduxjs/toolkit";
import { Coordinates, ResubmissionData } from "@/shared/types/commonTypes";
import { toast } from "sonner";
import { isAbortError } from "@/shared/utils/checkAbortControllerError";
import { StatusCode } from "@/shared/types/enum";
import { openPendingModal } from "@/shared/services/redux/slices/pendingModalSlice";
import { openRejectedModal } from "../redux/slices/rejectModalSlice";
import { Res_checkLogin } from "@/features/driver/components/forms/type";
import { geocodeLatLng } from "@/shared/utils/locationToAddress";

//fetch Resubmission fields
export const fetchResubmissionData = async (
  driverId: string | null,
  dispatch: Dispatch,
  navigate: (path: string) => void,
  setResubmissionData: React.Dispatch<
    React.SetStateAction<ResubmissionData | null>
  >,
  setLoad: React.Dispatch<React.SetStateAction<boolean>>,
  signal?: AbortSignal
) => {
  if (!driverId) {
    toast.error("Driver ID not found");
    navigate("/driver/login");
    return;
  }

  try {
    setLoad(true);
    const response = await axiosDriver(dispatch).get(
      ApiEndpoints.DRIVER_RESUBMISSION + `/${driverId}`,
      { signal }
    );

    const fields: string[] = response.data.data?.fields;
    if (!Array.isArray(fields)) {
      throw new Error("Fields is not an array");
    }

    const fixedData = {
      ...response.data.data,
      fields,
    };

    setResubmissionData(fixedData);
  } catch (error: any) {
    console.log("fetchResubmissionData", error);
    if (!isAbortError(error)) {
      toast.error(
        error?.message || "Failed to fetch resubmission requirements"
      );
      navigate("/driver/login");
    }
  } finally {
    setLoad(false);
  }
};

//resubmit driver details
export const submitResubmissionForm = async (
  driverId: string,
  formData: FormData,
  dispatch: Dispatch,
  navigate: any
) => {
  try {
    const { data } = await axiosDriver(dispatch).post(
      `${ApiEndpoints.DRIVER_RESUBMISSION}?driverId=${driverId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (data.status === 200) {
      toast.success("Resubmission successfully completed");
      navigate("/driver/login");
    } else {
      toast.error(data.message || "Submission failed");
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || error.message || "Unknown error"
    );
  }

};

export const handleLoginDriver = async (
  dispatch: Dispatch,
  values: any,
  setLoad: any,
  navigate: any
): Promise<Res_checkLogin | undefined> => {
  try {
    setLoad(true);

    const { data }: { data: Res_checkLogin } = await axiosDriver(dispatch).post(
      ApiEndpoints.DRIVER_CHECK_LOGIN,
      values
    );
console.log("datadatadata",data);

    switch (data.message) {
      case "Success":
        return data;

      case "Incomplete":
        toast.info("Please complete the verification!");
        navigate("/driver/signup");
        break;

      case "Blocked":
        toast.info("Your account is blocked!");
        break;

      case "Pending":
        dispatch(openPendingModal());
        break;

      case "Rejected":
        localStorage.setItem("role", "Resubmission");
        localStorage.setItem("driverId", data.driverId || "");
        dispatch(openRejectedModal());
        break;

      default:
        toast.error("Not registered! Please register to continue.");
    }
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  } finally {
    setLoad(false);
  }
};


export const handleDriverGoogleLogin = async (
  dispatch: Dispatch,
  decode: any,
  driverLogin: any,
  navigate: any
) => {
  try {
    const { data } = await axiosDriver(dispatch).post(
      ApiEndpoints.DRIVER_CHECK_GOOGLE_LOGIN,
      {
        email: decode.email,
      }
    );
    if (data.status == StatusCode.OK) {
      switch (data.message) {
        case "Success":
          toast.success("Login success!");
          localStorage.setItem("driverToken", data.token);
          localStorage.setItem("DriverRefreshToken", data.refreshToken);
          dispatch(
            driverLogin({ name: data.name, driverId: data._id, role: "Driver" })
          );

          break;
        case "Incomplete registration":
          toast.info("Please complete the registration!");
          navigate("/driver/signup");
          break;
        case "Blocked":
          toast.info("Your account is blocked!");
          break;
        case "Not verified":
          dispatch(openPendingModal());
          break;
        case "Rejected":
          localStorage.setItem("role", "Resubmission");
          localStorage.setItem("driverId", data.driverId);
          dispatch(openRejectedModal());
          break;
        default:
          toast.error("Not registered! Please register to continue.");
      }
    } else {
      throw new Error("something went wrong");
    }
  } catch (error) {
    console.log(error);
    toast.error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
};

//submit driver identification
export const submitDriverIdentification = async (
  driverId: string,
  formData: FormData,
  dispatch: Dispatch,
  setLoad: any,
  setPhotoPage: any
) => {
  try {
    setLoad(true);
    const { data } = await axiosDriver(dispatch).post(
      `${ApiEndpoints.DRIVER_IDENTIFICATION}?driverId=${driverId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (data.status === StatusCode.OK) {
      setPhotoPage(true);
      toast.success("Identification details submitted successfully");
    } else {
      toast.error(data.message || "Submission failed");
    }
  } catch (error: any) {
    toast.error(error.message || "Submission failed");
  } finally {
    setLoad(false);
  }
};

//submit driver image
export const submitDriverImage = async (
  dispatch: Dispatch,
  values: any,
  setLoad: any,
  setVehiclePage: any
) => {
  setLoad(true);
  try {
    const driverId = localStorage.getItem("driverId");
    if (!driverId) throw new Error("Driver ID not found");

    if (values.driverImage) {
      const blob = await fetch(values.driverImage).then((res) => res.blob());
      const file = new File([blob], "driverImage.jpeg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("driverImage", file);

      const { data } = await axiosDriver(dispatch).post(
        `${ApiEndpoints.DRIVER_UPLOAD_IMAGE}?driverId=${driverId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (data.status === StatusCode.OK) {
        toast.success("Successfully uploaded image");
        setVehiclePage(true);
      } else {
        toast.error(data.message);
      }
    }
  } catch (error) {
    toast.error((error as Error).message);
  } finally {
    setLoad(false);
  }
};

//submit driver vehicle data
export const submitVehicleData = async (
  dispatch: Dispatch,
  formData: any,
  setLoad: any,
  setLocationPage: any
) => {
  try {
    setLoad(true);
    const driverId = localStorage.getItem("driverId");
    if (!driverId) {
      toast.error("Driver ID not found. Please register again.");
      setLoad(false);
      return;
    }
    const { data } = await axiosDriver(dispatch).post(
      `${ApiEndpoints.DRIVER_ADD_VEHICLE_DETAILS}?driverId=${driverId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (data.status === StatusCode.OK) {
      toast.success("Vehicle details submitted successfully");
      setLocationPage(true);
    } else {
      toast.error(data.message || "Failed to submit vehicle details");
    }
  } catch (error: any) {
    toast.error(
      `Error submitting: ${error.response?.data?.message || error.message}`
    );
  } finally {
    setLoad(false);
  }
};

export const submitInsurance = async (
  dispatch: Dispatch,
  formData: any,
  setLoad: any,
  setLocationPage: any
) => {
  try {
    setLoad(true);
    const driverId = localStorage.getItem("driverId");
    const { data } = await axiosDriver(dispatch).post(
      ApiEndpoints.DRIVER_INSURANCE + `?driverId=${driverId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (data.status === StatusCode.OK) {
      toast.success("Insurance details submitted successfully");
      setLoad(false);
      setLocationPage(true);
    } else {
      toast.error(data.message);
    }
  } catch (error: any) {
    toast.error("Error submitting: " + error.message);
  } finally {
    setLoad(false);
  }
};

// submit driver location
export const submitDriverLocation = async (
  dispatch: Dispatch,
  navigate: NavigateFunction,
  setLoad: (loading: boolean) => void,
  setIsSubmitting: (loading: boolean) => void,
  values: Coordinates
): Promise<void> => {
  try {
    setLoad(true);
      const address = await geocodeLatLng(
                values.latitude,
                values.longitude
              );
   const driverId= localStorage.getItem("driverId");

    if (!driverId) {
      toast.error("Driver ID not found. Please try again.");
      navigate("/driver/signup");
      return;
    }

    setIsSubmitting(true);
const requestData ={
  ...values, address
}
    const { data } = await axiosDriver(dispatch).post(
      `${ApiEndpoints.DRIVER_LOCATION}?driverId=${driverId}`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data.status === StatusCode.OK) {
      toast.success("Location saved successfully!");
      localStorage.removeItem("driverId");
      navigate("/driver/login");
      dispatch(openPendingModal());
    } else {
      toast.error(data.message || "Failed to save location");
    }
  } catch (error: any) {
    console.error("Location submission error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to save location";

    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
    setLoad(false);
  }
};
