import { throwCustomError } from "@/shared/utils/error";
import { axiosInstance } from "../axios/createAxios";

const JSON_TYPE = { "Content-Type": "application/json" };

export const fetchData = async <T>(url: string, signal?: AbortSignal) => {
  try {
    const response = await axiosInstance.get<T>(url, {
      signal,
    });

    return response;
  } catch (error) {
    throwCustomError(error);
  }
};

export const postData = async <T>(url: string, data?: any) => {
  try {
    const response = await axiosInstance.post<T>(url, data, {
      headers: data instanceof FormData ? {} : JSON_TYPE,
    });
    return response;

  } catch (error) {
    throwCustomError(error);
  }
};

export const updateData = async <T>(url: string, data?: any) => {
  try {
    const response = await axiosInstance.put<T>(url, data, {
      headers: data instanceof FormData ? {} : JSON_TYPE,
    });
    return response;
  } catch (error) {
    throwCustomError(error);
  }
};

export const patchData = async <T>(url: string, data?: any) => {
  try {
    const response = await axiosInstance.patch(url, data || null, {
      headers: data instanceof FormData ? {} : JSON_TYPE,
    });

    return response;
  } catch (error) {
    throwCustomError(error);
  }
};

export const deleteData = async <T>(url: string) => {
  try {
    const response = await axiosInstance.delete(url);
    return response;
  } catch (error) {
    console.log("error in deleteData:", error);
    throwCustomError(error);
  }
};
