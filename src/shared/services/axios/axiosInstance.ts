import { getAxios } from "./initAxios";

export const userAxios =  getAxios("User");
export const adminAxios =  getAxios("Admin");
export const driverAxios =  getAxios("Driver");