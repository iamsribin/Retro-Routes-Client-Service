import { AxiosInstance } from "axios";
import { createAxios } from "./createAxios";

type Role = "Admin" | "Driver" | "User";

let axiosMap: Partial<Record<Role, AxiosInstance>> = {};

export const initAxios = (dispatch: any) => {
  axiosMap = {
    Admin: createAxios("Admin",dispatch),
    Driver: createAxios("Driver",dispatch),
    User: createAxios("User",dispatch),
  };
};

export const getAxios = (role: Role): AxiosInstance => {
  if (!axiosMap[role]) throw new Error(`Axios for ${role} not initialized`);
  return axiosMap[role]!;
};


