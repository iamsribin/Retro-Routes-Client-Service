import { getAxios } from "../axios/initAxios";

type Role = "Admin" | "Driver" | "User";

export const fetchData = async <T>(
  url: string,
  role: Role,
  signal?: AbortSignal
): Promise<T> => {
  const axios = getAxios(role);
  const { data } = await axios.get<T>(url, { signal });
  console.log("fetchData", data);

  return data;
};
const JSON_TYPE = { "Content-Type": "application/json" };

export const postData = async <T>(
  url: string,
  role: Role,
  data?: any
): Promise<T> => {

  const axios = getAxios(role);
  const response = await axios.post<T>(url, data, {
    headers: data instanceof FormData ? {} : JSON_TYPE,
  });
  console.log("post data", response.data);

  return response.data;
};

export const updateData = async <T>(
  url: string,
  role: Role,
  data?: any
): Promise<T> => {
  const axios = getAxios(role);
  const response = await axios.put<T>(url, data, {
    headers: data instanceof FormData ? {} : JSON_TYPE,
  });
  console.log("updateData", response.data);

  return response.data;
};

export const patchData = async <T>(
  url: string,
  role: Role,
  data?: any
): Promise<T> => {
  const axios = getAxios(role);
  const response = await axios.patch(url, data || null, {
    headers: data instanceof FormData ? {} : JSON_TYPE,
  });
  console.log("patchData", response.data);

  return response.data;
};



export const deleteData = async <T>(url: string, role: Role): Promise<T> => {
  const axios = getAxios(role);
  const response = await axios.delete(url);
  console.log("deleteData", response.data);

  return response.data;
};
