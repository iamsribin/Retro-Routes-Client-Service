import { useState, useCallback } from 'react';
import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import createAxiosUser from '@/services/axios/userAxios';
import createAxiosDriver from '@/services/axios/driverAxios';
import { axiosAdmin } from '@/services/axios/adminAxios';
import { useDispatch } from 'react-redux';

// Type definitions
interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiOptions {
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, string | number | boolean>;
}

type Role = 'user' | 'driver' | 'admin';

// Hook factory to create role-specific API hooks
const createApiHooks = (role: Role) => {
  const useApi = <T>(): {
    get: (url: string, options?: ApiOptions) => Promise<AxiosResponse<T>>;
    post: (url: string, data: any, options?: ApiOptions) => Promise<AxiosResponse<T>>;
    patch: (url: string, data: any, options?: ApiOptions) => Promise<AxiosResponse<T>>;
    put: (url: string, data: any, options?: ApiOptions) => Promise<AxiosResponse<T>>;
  } => {
    const dispatch = useDispatch();
    let axiosInstance: AxiosInstance;

    switch (role) {
      case 'user':
        axiosInstance = createAxiosUser(dispatch);
        break;
      case 'driver':
        axiosInstance = createAxiosDriver(dispatch);
        break;
      case 'admin':
        axiosInstance = axiosAdmin(dispatch);
        break;
      default:
        throw new Error('Invalid role specified');
    }

    const buildUrl = (url: string, options?: ApiOptions): string => {
      let finalUrl = url;

      // Handle path parameters
      if (options?.pathParams) {
        Object.entries(options.pathParams).forEach(([key, value]) => {
          finalUrl = finalUrl.replace(`:${key}`, String(value));
        });
      }

      // Handle query parameters
      if (options?.queryParams) {
        const queryString = new URLSearchParams(
          Object.entries(options.queryParams).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: String(value)
          }), {})
        ).toString();
        if (queryString) {
          finalUrl += `?${queryString}`;
        }
      }

      return finalUrl;
    };

    const get = async (url: string, options?: ApiOptions) => {
      const finalUrl = buildUrl(url, options);
      return axiosInstance.get<T>(finalUrl);
    };

    const post = async (url: string, data: any, options?: ApiOptions) => {
      const finalUrl = buildUrl(url, options);
      return axiosInstance.post<T>(finalUrl, data);
    };

    const patch = async (url: string, data: any, options?: ApiOptions) => {
      const finalUrl = buildUrl(url, options);
      return axiosInstance.patch<T>(finalUrl, data);
    };

    const put = async (url: string, data: any, options?: ApiOptions) => {
      const finalUrl = buildUrl(url, options);
      return axiosInstance.put<T>(finalUrl, data);
    };

    return { get, post, patch, put };
  };

  // Reusable hook for managing API state
  const useApiRequest = <T>(): {
    request: (apiCall: () => Promise<AxiosResponse<T>>) => Promise<T | null>;
    data: T | null;
    loading: boolean;
    error: string | null;
    reset: () => void;
  } => {
    const [state, setState] = useState<ApiResponse<T>>({
      data: null,
      loading: false,
      error: null
    });

    const request = useCallback(async (apiCall: () => Promise<AxiosResponse<T>>) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiCall();
        setState({ data: response.data, loading: false, error: null });
        return response.data;
      } catch (error) {
        const errorMessage = (error as AxiosError).message || 'An error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        return null;
      }
    }, []);

    const reset = useCallback(() => {
      setState({ data: null, loading: false, error: null });
    }, []);

    return { request, ...state, reset };
  };

  return { useApi, useApiRequest };
};

// Create role-specific hooks
export const { useApi: useUserApi, useApiRequest: useUserApiRequest } = createApiHooks('user');
export const { useApi: useDriverApi, useApiRequest: useDriverApiRequest } = createApiHooks('driver');
export const { useApi: useAdminApi, useApiRequest: useAdminApiRequest } = createApiHooks('admin');