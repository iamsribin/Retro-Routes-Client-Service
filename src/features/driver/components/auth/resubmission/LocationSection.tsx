import { lazy } from 'react';
import { handleGeolocation, handleGetCurrentLocation } from '@/shared/utils/resubmissionHelpers';
import ExploreIcon from '@mui/icons-material/Explore';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import { LocationSectionProps } from '../type';

const SignupMap = lazy(() => import('../../../pages/auth/SignupMap'));


const LocationSection: React.FC<LocationSectionProps> = ({ formik, latitude, longitude, setLatitude, setLongitude, resubmissionData }) => {
  if (!resubmissionData.fields.includes('location')) return null;

  return (
    <div className="mb-6">
      <h1 className="text-blue-800 font-bold text-lg">Choose Your Location</h1>
      <div className="user-signup-form driver-signup-map-form w-full h-96 rounded-md drop-shadow-xl mt-2">
        <SignupMap latitude={latitude} longitude={longitude} onLocationChange={(lat, lng) => handleGeolocation(lat, lng, formik, setLatitude, setLongitude)} />
      </div>
      <div className="flex mt-6 justify-evenly">
        <div className="w-1/2 py-2.5 px-3 mr-1 flex justify-center items-center bg-blue-800 rounded-2xl">
          <ExploreIcon style={{ color: 'white' }} />
          <button type="button" onClick={() => handleGetCurrentLocation(formik, setLatitude, setLongitude)} className="w-full text-sm text-white font-normal">Get Current Location</button>
        </div>
        <div className="w-1/2 ml-1 px-3 flex justify-center items-center bg-blue-800 rounded-2xl">
          <WhereToVoteIcon style={{ color: 'white' }} />
          <button type="button" onClick={() => formik.submitForm()} className="w-full text-sm text-white font-normal">Choose this location</button>
        </div>
      </div>
      {formik.touched.latitude && formik.errors.latitude && <p className="text-red-500 text-sm">{formik.errors.latitude}</p>}
      {formik.touched.longitude && formik.errors.longitude && <p className="text-red-500 text-sm">{formik.errors.longitude}</p>}
    </div>
  );
};

export default LocationSection;