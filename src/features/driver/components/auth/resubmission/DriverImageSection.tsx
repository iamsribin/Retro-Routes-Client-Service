import { FormikProps } from 'formik';
import { ResubmissionData, ResubmissionFormValues, Previews } from '@/shared/utils/types';

interface DriverImageSectionProps {
  formik: FormikProps<ResubmissionFormValues>;
  previews: Previews;
  handleFileInput: (field: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  resubmissionData: ResubmissionData;
}

const DriverImageSection: React.FC<DriverImageSectionProps> = ({ formik, previews, handleFileInput, resubmissionData }) => {
  if (!resubmissionData.fields.includes('driverImage')) return null;

  return (
    <div className="mb-6">
      <h1 className="text-blue-800 font-bold text-lg">Driver Image</h1>
      <input
        type="file"
        name="driverImage"
        accept="image/*"
        onChange={(e) => handleFileInput('driverImage', e)}
        className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
      />
      {previews.driverImage && <img src={previews.driverImage} alt="Driver Preview" className="mt-2 h-20 w-auto" />}
      {formik.touched.driverImage && formik.errors.driverImage && <p className="text-red-500 text-sm">{formik.errors.driverImage}</p>}
    </div>
  );
};

export default DriverImageSection;