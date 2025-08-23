import { getAxios } from "../axios/initAxios";

type Role = "Admin" | "Driver" | "User";

export const fetchData = async  <T>(url: string, role: Role): Promise<T> => {
    const axios = getAxios(role);
    const {data} = await axios.get<T>(url);
    return data;
};

export const postData = async  <T>(url: string, role: Role, data?: any): Promise<T> => {
    const axios = getAxios(role);
    const response = await axios.post<T>(url, data || null);
    return response.data;
};


export const updateData = async  <T>(url: string, role: Role, data?: any): Promise<T> => {
    const axios = getAxios(role);
    const response = await axios.put<T>(url, data || null);
    return response.data;
};

export const patchData = async  <T>(url: string, role: Role, data?: any): Promise<T> => {
    const axios = getAxios(role);
    const response = await axios.patch(url, data || null);
    return response.data;
};

export const deleteData = async  <T>(url: string, role: Role): Promise<T> => {
    const axios = getAxios(role);
    const response = await axios.delete(url);
    return response.data;
};
