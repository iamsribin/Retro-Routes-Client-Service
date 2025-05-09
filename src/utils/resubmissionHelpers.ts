import { toast } from 'sonner';
import axiosDriver from '@/services/axios/driverAxios';
import { FormikProps } from 'formik';
import { ResubmissionData, ResubmissionFormValues, Previews } from './types';

export const fetchResubmissionData = async (
  driverId: string | null,
  dispatch: any,
  navigate: (path: string) => void,
  setResubmissionData: React.Dispatch<React.SetStateAction<ResubmissionData | null>>,
  setLoad: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!driverId) {
    toast.error('Driver ID not found');
    navigate('/driver/login');
    return;
  }
  try {
    setLoad(true);
    const response = await axiosDriver(dispatch).get(`/resubmission/${driverId}`);
    console.log(response);

    const fields = response.data.data?.fields;
    if (!Array.isArray(fields)) {
      throw new Error('Fields is not an array');
    }

    const fixedData = {
      ...response.data.data,
      fields: fields.map((field: string) =>
        field === 'driverImge' ? 'driverImage' : field === 'pollution' ? 'pollution' : field
      ),
    };
    setResubmissionData(fixedData);
  } catch (error: any) {
    console.log(error);
    toast.error('Failed to fetch resubmission requirements: ' + error.message);
    navigate('/driver/login');
  } finally {
    setLoad(false);
  }
};

export const handleFileInput = (
  fieldName: string,
  e: React.ChangeEvent<HTMLInputElement>,
  formik: FormikProps<ResubmissionFormValues>,
  setPreviews: React.Dispatch<React.SetStateAction<Previews>>
) => {
  const file = e.target.files?.[0] || null;
  if (file) {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    formik.setFieldValue(fieldName, file);
    const previewUrl = URL.createObjectURL(file);
    const previewKey = fieldName.replace('Image', '') as keyof Previews;
    setPreviews((prev) => ({ ...prev, [previewKey]: previewUrl }));
  } else {
    formik.setFieldValue(fieldName, null);
  }
};

export const handleGeolocation = (
  lat: number,
  lng: number,
  formik: FormikProps<ResubmissionFormValues>,
  setLatitude: React.Dispatch<React.SetStateAction<number>>,
  setLongitude: React.Dispatch<React.SetStateAction<number>>
) => {
  setLatitude(lat);
  setLongitude(lng);
  formik.setFieldValue('latitude', lat);
  formik.setFieldValue('longitude', lng);
};

export const handleGetCurrentLocation = (
  formik: FormikProps<ResubmissionFormValues>,
  setLatitude: React.Dispatch<React.SetStateAction<number>>,
  setLongitude: React.Dispatch<React.SetStateAction<number>>
) => {
  if (!navigator.geolocation) {
    toast.error('Geolocation is not supported by your browser');
    return;
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
  };

  const successCallback = async (position: GeolocationPosition) => {
    const newLat = position.coords.latitude;
    const newLng = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    if (accuracy > 100) {
      toast.info('Waiting for a more accurate location...');
      return;
    }

    formik.setFieldValue('latitude', newLat);
    formik.setFieldValue('longitude', newLng);
    setLatitude(newLat);
    setLongitude(newLng);
  };

  const errorCallback = (error: GeolocationPositionError) => {
    toast.error('Error getting location: ' + error.message);
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
};