import { handleFileInput } from '@/shared/utils/resubmissionHelpers';
import AadhaarSection from '../../components/auth/resubmission/AadhaarSection';
import LicenseSection from '../../components/auth/resubmission/LicenseSection';
import VehicleSection from '../../components/auth/resubmission/VehicleSection';
import InsurancePollutionSection from '../../components/auth/resubmission/InsurancePollutionSection';
import DriverImageSection from '../../components/auth/resubmission/DriverImageSection';
import LocationSection from '../../components/auth/resubmission/LocationSection';
import { ResubmissionFormProps } from './type';

const ResubmissionForm: React.FC<ResubmissionFormProps> = ({
  formik,
  resubmissionData,
  previews,
  setPreviews,
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  load,
}) => {
  return (
    <div className="flex md:w-1/2 justify-center pb-10 md:py-10 px-2 md:px-0 items-center">
      <div className="user-signup-form md:w-10/12 px-9 py-8 bg-white drop-shadow-xl overflow-y-auto max-h-[80vh]">
        <form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); }}>
          <AadhaarSection formik={formik} previews={previews} handleFileInput={(field, e) => handleFileInput(field, e, formik, setPreviews)} resubmissionData={resubmissionData} />
          <LicenseSection formik={formik} previews={previews} handleFileInput={(field, e) => handleFileInput(field, e, formik, setPreviews)} resubmissionData={resubmissionData} />
          <VehicleSection formik={formik} previews={previews} handleFileInput={(field, e) => handleFileInput(field, e, formik, setPreviews)} resubmissionData={resubmissionData} />
          <InsurancePollutionSection formik={formik} previews={previews} handleFileInput={(field, e) => handleFileInput(field, e, formik, setPreviews)} resubmissionData={resubmissionData} />
          <DriverImageSection formik={formik} previews={previews} handleFileInput={(field, e) => handleFileInput(field, e, formik, setPreviews)} resubmissionData={resubmissionData} />
          <LocationSection formik={formik} latitude={latitude} longitude={longitude} setLatitude={setLatitude} setLongitude={setLongitude} resubmissionData={resubmissionData} />
          <button
            type="submit"
            className={`block w-full bg-blue-800 py-2 rounded-2xl text-white font-semibold mb-2 ${load || formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={load || formik.isSubmitting}
          >
            {load || formik.isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResubmissionForm;