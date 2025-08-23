import axiosDriver from "@/shared/services/axios/driverAxios";
import ApiEndpoints from "@/constants/api-end-pointes";
import { Dispatch } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const fetchVehicleModels = async (
  dispatch: Dispatch,
  setVehicleModels:any       
) => {
  try {
    const {data} = await axiosDriver(dispatch).get(ApiEndpoints.ADMIN_VEHICLE_MODELS);    
    setVehicleModels(data)
  } catch (error) {
    toast.error("Failed to load vehicle models");
    return [];
  } 
};
