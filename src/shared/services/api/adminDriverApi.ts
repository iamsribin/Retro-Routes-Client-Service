import { axiosAdmin } from "../axios/adminAxios";
import ApiEndpoints from "@/constants/api-end-pointes";
import { toast } from "sonner";
import { Res_getDriversListByAccountStatus } from "@/features/admin/pages/type";
import { Dispatch } from "@reduxjs/toolkit";
import { DriverInterface } from "@/shared/types/driver/driverType";
import { isAbortError } from "@/shared/utils/checkAbortControllerError";

export const fetchAdminDrivers = {
  getActiveDrivers: async (
    dispatch: Dispatch,
    signal?: AbortSignal
  ): Promise<Res_getDriversListByAccountStatus[]> => {
    try {
      const { data } = await axiosAdmin(dispatch).get(ApiEndpoints.ADMIN_VERIFIED_DRIVERS, { signal });
      return data;
    } catch (error: any) {
      if (!isAbortError(error)) toast.error(error?.message || "Failed to fetch active drivers");
      throw error;
    }
  },

  getPendingDrivers: async (
    dispatch: Dispatch,
    signal?: AbortSignal
  ): Promise<Res_getDriversListByAccountStatus[]> => {
    try {
      const { data } = await axiosAdmin(dispatch).get(ApiEndpoints.ADMIN_PENDING_DRIVERS, { signal });
      return data;
    } catch (error: any) {
      if (!isAbortError(error)) toast.error(error?.message || "Failed to fetch pending drivers");
      throw error;
    }
  },

  getBlockedDrivers: async (
    dispatch: Dispatch,
    signal?: AbortSignal
  ): Promise<Res_getDriversListByAccountStatus[]> => {
    try {
      const { data } = await axiosAdmin(dispatch).get(ApiEndpoints.ADMIN_BLOCKED_DRIVERS, { signal });
      return data;
    } catch (error: any) {
      if (!isAbortError(error)) toast.error(error?.message || "Failed to fetch blocked drivers");
      throw error;
    }
  },

  fetchDriverDetails: async (dispatch: Dispatch,id: string,signal?: AbortSignal): Promise<(Omit<DriverInterface, 'password' | 'referralCode' | '_id'> & { _id: string }) | null> => {
    try {
      const { data } = await axiosAdmin(dispatch).get(`${ApiEndpoints.ADMIN_DRIVER_DETAILS}/${id}`, { signal });
      return data;
    } catch (error: any) {
      if (!isAbortError(error)) {
        toast.error(error?.message || "Failed to fetch driver details");
      }
      throw error;
    }
  },

  updateDriverStatus: async (
    dispatch: Dispatch,
    id: string,
    payload: { status: string; note: string; fields?: string[] }
  ) => {
    try {
      const response = await axiosAdmin(dispatch).post(`${ApiEndpoints.ADMIN_UPDATE_DRIVER_STATUS}${id}`, payload);
      return response;
    } catch (error: any) {
     if (!isAbortError(error)) toast.error(error?.message || "Failed to update driver status");
      throw error;
    }
  }
};
