import { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import axiosDriver from '@/shared/services/axios/driverAxios';
import { ResubmissionValidation } from '@/shared/utils/validation';
import { ResubmissionData, ResubmissionFormValues, Previews } from '../type';
import { fetchResubmissionData } from '@/shared/utils/resubmissionHelpers';
import ResubmissionHeader from './ResubmissionHeader';
import ResubmissionForm from '../../forms/ResubmissionForm';
import Loader from '@/shared/components/loaders/shimmer';
import DriverPhotoPage from '../../../pages/auth/DriverIdentificationPage';
import LoadingSpinner from '@/shared/components/loaders/LoadingSpinner';
import ApiEndpoints from '@/constants/user-api-end-pointes';

const ResubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resubmissionData, setResubmissionData] = useState<ResubmissionData | null>(null);
  const [photoPage, setPhotoPage] = useState(false);
  const [load, setLoad] = useState(false);
  const [previews, setPreviews] = useState<Previews>({
    aadharFront: null,
    aadharBack: null,
    licenseFront: null,
    licenseBack: null,
    rcFront: null,
    rcBack: null,
    carFront: null,
    carBack: null,
    insurance: null,
    pollution: null,
    driverImage: null,
  });
  const [latitude, setLatitude] = useState(23.226390067116835);
  const [longitude, setLongitude] = useState(79.17271614074708);

  const driverId = localStorage.getItem('driverId');

  useEffect(() => {
    fetchResubmissionData(driverId, dispatch, navigate, setResubmissionData, setLoad);
    localStorage.removeItem('role');
  }, [driverId, navigate, dispatch]);

  const formik = useFormik<ResubmissionFormValues>({
    initialValues: {
      aadharID: '', aadharFrontImage: null, aadharBackImage: null,
      licenseID: '', licenseFrontImage: null, licenseBackImage: null, licenseValidity: '',
      registerationID: '', model: '', rcFrontImage: null, rcBackImage: null,
      carFrontImage: null, carBackImage: null,
      insuranceImage: null, insuranceStartDate: '', insuranceExpiryDate: '',
      pollutionImage: null, pollutionStartDate: '', pollutionExpiryDate: '',
      driverImage: null, latitude, longitude,
    },
    validationSchema: ResubmissionValidation(resubmissionData?.fields || []),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const formData = new FormData();
      const fieldMappings: { [key: string]: string[] } = {
        aadhar: ['aadharID', 'aadharFrontImage', 'aadharBackImage'],
        license: ['licenseID', 'licenseFrontImage', 'licenseBackImage', 'licenseValidity'],
        registerationID: ['registerationID'],
        model: ['model'],
        rc: ['rcFrontImage', 'rcBackImage'],
        carImage: ['carFrontImage', 'carBackImage'],
        insurance: ['insuranceImage', 'insuranceStartDate', 'insuranceExpiryDate'],
        pollution: ['pollutionImage', 'pollutionStartDate', 'pollutionExpiryDate'],
        driverImage: ['driverImage'],
        location: ['latitude', 'longitude'],
      };

      resubmissionData?.fields.forEach((field) => {
        const fieldsToAppend = fieldMappings[field] || [];
        fieldsToAppend.forEach((key) => {
          const value = values[key as keyof ResubmissionFormValues];
          if (value !== null && value !== '') formData.append(key, value as string | Blob);
        });
      });

      try {
        console.log("========nbhgjhg=======");
      
        const response = await axiosDriver(dispatch).post(
          `${ApiEndpoints.DRIVER_RESUBMISSION}?driverId=${driverId}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        if (response.data.message === 'Success') {
          toast.success('Resubmission successful');
          navigate('/driver/login');
        } else {
          toast.error(response.data.message || 'Submission failed');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || error.message || 'Unknown error');
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (load || !resubmissionData) return <div className="flex items-center justify-center h-screen bg-white"><Loader /></div>;
  if (photoPage) return <DriverPhotoPage />;

  return (
    <div className="driver-registration-container h-screen flex justify-center items-center bg-white">
      <div className="w-6/7 md:w-5/6 md:h-5/6 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
        <Suspense fallback={<LoadingSpinner />}>
          <ResubmissionHeader />
          <ResubmissionForm
            formik={formik}
            resubmissionData={resubmissionData}
            previews={previews}
            setPreviews={setPreviews}
            latitude={latitude}
            longitude={longitude}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
            driverId={driverId}
            load={load}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ResubmissionPage;