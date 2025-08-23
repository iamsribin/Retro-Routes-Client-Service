import { toast } from "sonner";
import { showNotification } from "../redux/slices/notificationSlice";
import logoutLocalStorage from "@/shared/utils/localStorage";
import driverAxios from "@/shared/services/axios/driverAxios";
import { Dispatch } from "@reduxjs/toolkit";
import { driverLogout } from "../redux/slices/driverAuthSlice";
import { StatusCode } from "@/shared/types/enum";

export const submitUpdatedDriverProfile = async (
  field: any,
  editValues: any,
  dispatch: Dispatch,
  setLoading: any
) => {
  try {
        setLoading(true);
    const formData = new FormData();
    formData.append("field", field);
    if (field === "name") {
      formData.append("name", editValues.name);
    } else if (field === "profilePhoto" && editValues.profilePhoto) {
      formData.append("profilePhoto", editValues.profilePhoto);
    }

    const { data } = await driverAxios(dispatch).put(
      `/update-driver-profile`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (data.status == StatusCode.OK) {
      dispatch(driverLogout());
      logoutLocalStorage("Driver");
      dispatch(
        showNotification({
          type: "info",
          message:
            "Profile updated successfully! Logging out for admin verification.",
          data: null,
          navigate: "/driver/login",
        })
      );
    } else {
      toast.error("something went wrong try later");
    }
  } catch (error: any) {
    console.error("Error updating profile:", error);
    toast.error(
      error.response?.data?.message ||
        "Failed to update profile. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
