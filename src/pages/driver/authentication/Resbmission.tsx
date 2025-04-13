import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import axiosDriver from '@/services/axios/driverAxios';
import { useNavigate } from 'react-router-dom';
import { ResubmissionValidation } from '../../../utils/validation';
import Loader from '../../../components/shimmer/Loader';
import { Player } from '@lottiefiles/react-lottie-player';
import DriverPhotoPage from '../../../components/driver/authentication/identification/DriverIdentification';
import SignupMap from '../../../components/driver/authentication/map/SingupMap';
import ExploreIcon from '@mui/icons-material/Explore';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';

interface ResubmissionData {
  driverId: string;
  fields: string[];
}

const ResubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const [resubmissionData, setResubmissionData] = useState<ResubmissionData | null>(null);
  const [photoPage, setPhotoPage] = useState(false);
  const [load, setLoad] = useState(false);
  const [previews, setPreviews] = useState({
    aadharFront: null as string | null,
    aadharBack: null as string | null,
    licenseFront: null as string | null,
    licenseBack: null as string | null,
    rcFront: null as string | null,
    rcBack: null as string | null,
    carFront: null as string | null,
    carBack: null as string | null,
    insurance: null as string | null,
    pollution: null as string | null,
    driverImage: null as string | null,
  });
  const [longitude, setLongitude] = useState(79.17271614074708);
  const [latitude, setLatitude] = useState(23.226390067116835);

  const driverId = localStorage.getItem('driverId');

  useEffect(() => {
    const fetchResubmissionData = async () => {
      if (!driverId) {
        toast.error('Driver ID not found');
        navigate('/driver/login');
        return;
      }
      try {
        setLoad(true);
        const response = await axiosDriver().get(`/resubmission/${driverId}`);
        // Fix typos in fields
        const fixedData = {
          ...response.data,
          fields: response.data.fields.map((field: string) =>
            field === 'driverImge' ? 'driverImage' : field === 'polution' ? 'pollution' : field
          ),
        };
        setResubmissionData(fixedData);
        setLoad(false);
      } catch (error: any) {
        setLoad(false);
        toast.error('Failed to fetch resubmission requirements: ' + error.message);
        navigate('/driver/login');
      }
    };
    fetchResubmissionData();
  }, [driverId, navigate]);

  const formik = useFormik({
    initialValues: {
      aadharID: '',
      aadharFrontImage: null,
      aadharBackImage: null,
      licenseID: '',
      licenseFrontImage: null,
      licenseBackImage: null,
      licenseValidity: '',
      registerationID: '',
      model: '',
      rcFrontImage: null,
      rcBackImage: null,
      carFrontImage: null,
      carBackImage: null,
      insuranceImage: null,
      insuranceStartDate: '',
      insuranceExpiryDate: '',
      pollutionImage: null,
      pollutionStartDate: '',
      pollutionExpiryDate: '',
      driverImage: null,
      latitude,
      longitude,
    },
    validationSchema: ResubmissionValidation(resubmissionData?.fields || []),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      console.log('Submitting form with values:', values);

      const formData = new FormData();

      // Map resubmission fields to form field names
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

      // Append only fields relevant to resubmissionData.fields
      resubmissionData?.fields.forEach((field) => {
        const fieldsToAppend = fieldMappings[field] || [];
        fieldsToAppend.forEach((key) => {
          const value = values[key as keyof typeof values];
          if (value !== null && value !== '') {
            formData.append(key, value as string | Blob);
          }
        });
      });

      setLoad(true);
      setSubmitting(true);
      try {
        const response = await axiosDriver().post(`/resubmission?driverId=${driverId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data.message === 'Success') {
          toast.success('Resubmission successful');

            navigate('/driver/login');

        } else {
          toast.error(response.data.message || 'Submission failed');
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        toast.error('Error resubmitting: ' + errorMessage);
      } finally {
        setLoad(false);
        setSubmitting(false);
      }
    },
  });

  const handleFileInput = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
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
      const previewKey = fieldName.replace('Image', '');
      setPreviews((prev) => ({
        ...prev,
        [previewKey]: previewUrl,
      }));
    } else {
      formik.setFieldValue(fieldName, null);
    }
  };

  const handleGeolocation = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    formik.setFieldValue('latitude', lat);
    formik.setFieldValue('longitude', lng);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoad(true);
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
        setLoad(false);
        return;
      }

      formik.setFieldValue('latitude', newLat);
      formik.setFieldValue('longitude', newLng);
      setLatitude(newLat);
      setLongitude(newLng);
      setLoad(false);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      toast.error('Error getting location: ' + error.message);
      setLoad(false);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
  };

  useEffect(() => {
    console.log('Formik Errors:', formik.errors);
    console.log('Formik Touched:', formik.touched);
    console.log('Formik Values:', formik.values);
    console.log('Resubmission Fields:', resubmissionData?.fields);
  }, [formik.errors, formik.touched, formik.values, resubmissionData]);

  if (load || !resubmissionData) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader />
      </div>
    );
  }

  if (photoPage) {
    return <DriverPhotoPage />;
  }

  return (
    <div className="driver-registration-container h-screen flex justify-center items-center bg-white">
      <div className="w-6/7 md:w-5/6 md:h-5/6 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
        <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 justify-around items-center mb-3 md:m-0">
          <div className="flex w-full justify-center pt-10 items-center">
            <h1 className="text-blue-800 font-bold text-4xl mx-7 md:mx-0 md:mt-4 md:text-5xl">
              Resubmit Required Details
            </h1>
          </div>
          <div className="hidden md:flex md:items-center justify-center" style={{ marginTop: '-30px' }}>
            <Player
              autoplay
              loop
              src="https://lottie.host/4d9f98cb-2a44-4a20-b422-649992c60069/MTxuwxSyrs.json"
              style={{ height: '80%', width: '80%', background: 'transparent' }}
            />
          </div>
        </div>
        <div className="flex md:w-1/2 justify-center pb-10 md:py-10 px-2 md:px-0 items-center">
          <div className="user-signup-form md:w-10/12 px-9 py-8 bg-white drop-shadow-xl overflow-y-auto max-h-[80vh]">
            <form onSubmit={formik.handleSubmit}>
              {/* Aadhaar Section */}
              {resubmissionData.fields.includes('aadhar') && (
                <div className="mb-6">
                  <h1 className="text-blue-800 font-bold text-lg">Aadhaar ID</h1>
                  <input
                    className="pl-2 outline-none border-b w-full mb-2"
                    type="text"
                    name="aadharID"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.aadharID}
                  />
                  {formik.touched.aadharID && formik.errors.aadharID && (
                    <p className="text-red-500 text-sm">{formik.errors.aadharID}</p>
                  )}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="text-blue-800 font-bold text-sm">Front Image</label>
                      <input
                        type="file"
                        name="aadharFrontImage"
                        accept="image/*"
                        onChange={(e) => handleFileInput('aadharFrontImage', e)}
                        className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                      />
                      {previews.aadharFront && (
                        <img src={previews.aadharFront} alt="Aadhaar Front Preview" className="mt-2 h-20 w-auto" />
                      )}
                      {formik.touched.aadharFrontImage && formik.errors.aadharFrontImage && (
                        <p className="text-red-500 text-sm">{formik.errors.aadharFrontImage}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-blue-800 font-bold text-sm">Back Image</label>
                      <input
                        type="file"
                        name="aadharBackImage"
                        accept="image/*"
                        onChange={(e) => handleFileInput('aadharBackImage', e)}
                        className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                      />
                      {previews.aadharBack && (
                        <img src={previews.aadharBack} alt="Aadhaar Back Preview" className="mt-2 h-20 w-auto" />
                      )}
                      {formik.touched.aadharBackImage && formik.errors.aadharBackImage && (
                        <p className="text-red-500 text-sm">{formik.errors.aadharBackImage}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* License Section */}
              {resubmissionData.fields.includes('license') && (
                <div className="mb-6">
                  <h1 className="text-blue-800 font-bold text-lg">Driving License ID</h1>
                  <input
                    className="pl-2 outline-none border-b w-full mb-2"
                    type="text"
                    name="licenseID"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.licenseID}
                  />
                  {formik.touched.licenseID && formik.errors.licenseID && (
                    <p className="text-red-500 text-sm">{formik.errors.licenseID}</p>
                  )}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="text-blue-800 font-bold text-sm">Front Image</label>
                      <input
                        type="file"
                        name="licenseFrontImage"
                        accept="image/*"
                        onChange={(e) => handleFileInput('licenseFrontImage', e)}
                        className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                      />
                      {previews.licenseFront && (
                        <img src={previews.licenseFront} alt="License Front Preview" className="mt-2 h-20 w-auto" />
                      )}
                      {formik.touched.licenseFrontImage && formik.errors.licenseFrontImage && (
                        <p className="text-red-500 text-sm">{formik.errors.licenseFrontImage}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-blue-800 font-bold text-sm">Back Image</label>
                      <input
                        type="file"
                        name="licenseBackImage"
                        accept="image/*"
                        onChange={(e) => handleFileInput('licenseBackImage', e)}
                        className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                      />
                      {previews.licenseBack && (
                        <img src={previews.licenseBack} alt="License Back Preview" className="mt-2 h-20 w-auto" />
                      )}
                      {formik.touched.licenseBackImage && formik.errors.licenseBackImage && (
                        <p className="text-red-500 text-sm">{formik.errors.licenseBackImage}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h1 className="text-blue-800 font-bold text-lg">License Validity Date</h1>
                    <input
                      className="pl-2 outline-none border-b w-full mb-2"
                      type="date"
                      name="licenseValidity"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.licenseValidity}
                    />
                    {formik.touched.licenseValidity && formik.errors.licenseValidity && (
                      <p className="text-red-500 text-sm">{formik.errors.licenseValidity}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Vehicle Details Section */}
              {(resubmissionData.fields.includes('registerationID') ||
                resubmissionData.fields.includes('model') ||
                resubmissionData.fields.includes('rc') ||
                resubmissionData.fields.includes('carImage')) && (
                <div className="mb-6">
                  <h1 className="text-blue-800 font-bold text-lg">Vehicle Details</h1>
                  {resubmissionData.fields.includes('registerationID') && (
                    <div className="mt-2">
                      <input
                        className="pl-2 outline-none border-b w-full mb-2"
                        type="text"
                        name="registerationID"
                        placeholder="Registration ID"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.registerationID}
                      />
                      {formik.touched.registerationID && formik.errors.registerationID && (
                        <p className="text-red-500 text-sm">{formik.errors.registerationID}</p>
                      )}
                    </div>
                  )}
                  {resubmissionData.fields.includes('model') && (
                    <div className="mt-2">
                      <input
                        className="pl-2 outline-none border-b w-full mb-2"
                        type="text"
                        name="model"
                        placeholder="Vehicle Model"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.model}
                      />
                      {formik.touched.model && formik.errors.model && (
                        <p className="text-red-500 text-sm">{formik.errors.model}</p>
                      )}
                    </div>
                  )}
                  {resubmissionData.fields.includes('rc') && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="text-blue-800 font-bold text-sm">RC Front Image</label>
                        <input
                          type="file"
                          name="rcFrontImage"
                          accept="image/*"
                          onChange={(e) => handleFileInput('rcFrontImage', e)}
                          className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                        />
                        {previews.rcFront && (
                          <img src={previews.rcFront} alt="RC Front Preview" className="mt-2 h-20 w-auto" />
                        )}
                        {formik.touched.rcFrontImage && formik.errors.rcFrontImage && (
                          <p className="text-red-500 text-sm">{formik.errors.rcFrontImage}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-blue-800 font-bold text-sm">RC Back Image</label>
                        <input
                          type="file"
                          name="rcBackImage"
                          accept="image/*"
                          onChange={(e) => handleFileInput('rcBackImage', e)}
                          className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                        />
                        {previews.rcBack && (
                          <img src={previews.rcBack} alt="RC Back Preview" className="mt-2 h-20 w-auto" />
                        )}
                        {formik.touched.rcBackImage && formik.errors.rcBackImage && (
                          <p className="text-red-500 text-sm">{formik.errors.rcBackImage}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {resubmissionData.fields.includes('carImage') && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="text-blue-800 font-bold text-sm">Car Front Image</label>
                        <input
                          type="file"
                          name="carFrontImage"
                          accept="image/*"
                          onChange={(e) => handleFileInput('carFrontImage', e)}
                          className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                        />
                        {previews.carFront && (
                          <img src={previews.carFront} alt="Car Front Preview" className="mt-2 h-20 w-auto" />
                        )}
                        {formik.touched.carFrontImage && formik.errors.carFrontImage && (
                          <p className="text-red-500 text-sm">{formik.errors.carFrontImage}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-blue-800 font-bold text-sm">Car Back Image</label>
                        <input
                          type="file"
                          name="carBackImage"
                          accept="image/*"
                          onChange={(e) => handleFileInput('carBackImage', e)}
                          className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                        />
                        {previews.carBack && (
                          <img src={previews.carBack} alt="Car Back Preview" className="mt-2 h-20 w-auto" />
                        )}
                        {formik.touched.carBackImage && formik.errors.carBackImage && (
                          <p className="text-red-500 text-sm">{formik.errors.carBackImage}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Insurance and Pollution Section */}
              {(resubmissionData.fields.includes('insurance') || resubmissionData.fields.includes('pollution')) && (
                <div className="mb-6">
                  <h1 className="text-blue-800 font-bold text-lg">Insurance and Pollution Details</h1>
                  {resubmissionData.fields.includes('pollution') && (
                    <>
                      <div className="text-left mt-2">
                        <h1 className="text-blue-800 font-bold text-sm">Pollution Certificate Image</h1>
                        <input
                          type="file"
                          name="pollutionImage"
                          accept="image/*"
                          onChange={(e) => handleFileInput('pollutionImage', e)}
                          className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                        />
                        {previews.pollution && (
                          <img src={previews.pollution} alt="Pollution Cert" className="mt-2 rounded-xl h-20 w-auto" />
                        )}
                        {formik.touched.pollutionImage && formik.errors.pollutionImage && (
                          <p className="text-red-500 text-sm">{formik.errors.pollutionImage}</p>
                        )}
                      </div>
                      <div className="md:flex mt-4">
                        <div className="text-left md:pr-5">
                          <h1 className="text-blue-800 font-bold text-sm">Pollution Start Date</h1>
                          <input
                            className="pl-2 outline-none border-b w-full mb-2"
                            type="date"
                            name="pollutionStartDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.pollutionStartDate}
                          />
                          {formik.touched.pollutionStartDate && formik.errors.pollutionStartDate && (
                            <p className="text-red-500 text-sm">{formik.errors.pollutionStartDate}</p>
                          )}
                        </div>
                        <div className="text-left">
                          <h1 className="text-blue-800 font-bold text-sm">Pollution Expiry Date</h1>
                          <input
                            className="pl-2 outline-none border-b w-full mb-2"
                            type="date"
                            name="pollutionExpiryDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.pollutionExpiryDate}
                          />
                          {formik.touched.pollutionExpiryDate && formik.errors.pollutionExpiryDate && (
                            <p className="text-red-500 text-sm">{formik.errors.pollutionExpiryDate}</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {resubmissionData.fields.includes('insurance') && (
                    <>
                      <div className="text-left mt-2">
                        <h1 className="text-blue-800 font-bold text-sm">Insurance Document Image</h1>
                        <input
                          type="file"
                          name="insuranceImage"
                          accept="image/*"
                          onChange={(e) => handleFileInput('insuranceImage', e)}
                          className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                        />
                        {previews.insurance && (
                          <img src={previews.insurance} alt="Insurance Doc" className="mt-2 rounded-xl h-20 w-auto" />
                        )}
                        {formik.touched.insuranceImage && formik.errors.insuranceImage && (
                          <p className="text-red-500 text-sm">{formik.errors.insuranceImage}</p>
                        )}
                      </div>
                      <div className="md:flex mt-4">
                        <div className="text-left md:pr-5">
                          <h1 className="text-blue-800 font-bold text-sm">Insurance Start Date</h1>
                          <input
                            className="pl-2 outline-none border-b w-full mb-2"
                            type="date"
                            name="insuranceStartDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.insuranceStartDate}
                          />
                          {formik.touched.insuranceStartDate && formik.errors.insuranceStartDate && (
                            <p className="text-red-500 text-sm">{formik.errors.insuranceStartDate}</p>
                          )}
                        </div>
                        <div className="text-left">
                          <h1 className="text-blue-800 font-bold text-sm">Insurance Expiry Date</h1>
                          <input
                            className="pl-2 outline-none border-b w-full mb-2"
                            type="date"
                            name="insuranceExpiryDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.insuranceExpiryDate}
                          />
                          {formik.touched.insuranceExpiryDate && formik.errors.insuranceExpiryDate && (
                            <p className="text-red-500 text-sm">{formik.errors.insuranceExpiryDate}</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Driver Image Section */}
              {resubmissionData.fields.includes('driverImage') && (
                <div className="mb-6">
                  <h1 className="text-blue-800 font-bold text-lg">Driver Image</h1>
                  <input
                    type="file"
                    name="driverImage"
                    accept="image/*"
                    onChange={(e) => handleFileInput('driverImage', e)}
                    className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                  />
                  {previews.driverImage && (
                    <img src={previews.driverImage} alt="Driver Preview" className="mt-2 h-20 w-auto" />
                  )}
                  {formik.touched.driverImage && formik.errors.driverImage && (
                    <p className="text-red-500 text-sm">{formik.errors.driverImage}</p>
                  )}
                </div>
              )}

              {/* Location Section */}
              {resubmissionData.fields.includes('location') && (
                <div className="mb-6">
                  <h1 className="text-blue-800 font-bold text-lg">Choose Your Location</h1>
                  <div className="user-signup-form driver-signup-map-form w-full h-96 rounded-md drop-shadow-xl mt-2">
                    <SignupMap
                      latitude={latitude}
                      longitude={longitude}
                      onLocationChange={handleGeolocation}
                    />
                  </div>
                  <div className="flex mt-6 justify-evenly">
                    <div className="w-1/2 py-2.5 px-3 mr-1 flex justify-center items-center bg-blue-800 rounded-2xl">
                      <ExploreIcon style={{ color: 'white' }} />
                      <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        className="w-full text-sm text-white font-normal"
                      >
                        Get Current Location
                      </button>
                    </div>
                    <div className="w-1/2 ml-1 px-3 flex justify-center items-center bg-blue-800 rounded-2xl">
                      <WhereToVoteIcon style={{ color: 'white' }} />
                      <button
                        type="button"
                        onClick={() => formik.submitForm()}
                        className="w-full text-sm text-white font-normal"
                      >
                        Choose this location
                      </button>
                    </div>
                  </div>
                  {formik.touched.latitude && formik.errors.latitude && (
                    <p className="text-red-500 text-sm">{formik.errors.latitude}</p>
                  )}
                  {formik.touched.longitude && formik.errors.longitude && (
                    <p className="text-red-500 text-sm">{formik.errors.longitude}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                className={`block w-full bg-blue-800 py-2 rounded-2xl text-white font-semibold mb-2 ${
                  load || formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={load || formik.isSubmitting}
              >
                {load || formik.isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResubmissionPage;