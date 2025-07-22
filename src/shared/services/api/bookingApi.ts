import axiosDriver from "@/shared/services/axios/driverAxios";
import ApiEndpoints from "@/constants/api-end-pointes";
import { Dispatch } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { isAbortError } from "@/shared/utils/checkAbortControllerError";
import { StatusCode } from "@/shared/types/enum";
import { AdminAllowedVehicleModel } from "@/shared/types/commonTypes";

export const fetchVehicleModels = async (
  dispatch: Dispatch,
  setVehicleModels:any       
) => {
  try {
    const response = await axiosDriver(dispatch).get(ApiEndpoints.ADMIN_VEHICLE_MODELS);
    setVehicleModels(response.data.message)
  } catch (error) {
    toast.error("Failed to load vehicle models");
    return [];
  } 
};
