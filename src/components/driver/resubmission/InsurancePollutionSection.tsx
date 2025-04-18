import { FormikProps } from 'formik';
import { ResubmissionData, ResubmissionFormValues, Previews } from '@/utils/types';

interface InsurancePollutionSectionProps {
  formik: FormikProps<ResubmissionFormValues>;
  previews: Previews;
  handleFileInput: (field: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  resubmissionData: ResubmissionData;
}

const InsurancePollutionSection: React.FC<InsurancePollutionSectionProps> = ({ formik, previews, handleFileInput, resubmissionData }) => {
  if (!['insurance', 'pollution'].some(field => resubmissionData.fields.includes(field))) return null;

  return (
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
            {previews.pollution && <img src={previews.pollution} alt="Pollution Cert" className="mt-2 rounded-xl h-20 w-auto" />}
            {formik.touched.pollutionImage && formik.errors.pollutionImage && <p className="text-red-500 text-sm">{formik.errors.pollutionImage}</p>}
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
              {formik.touched.pollutionStartDate && formik.errors.pollutionStartDate && <p className="text-red-500 text-sm">{formik.errors.pollutionStartDate}</p>}
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
              {formik.touched.pollutionExpiryDate && formik.errors.pollutionExpiryDate && <p className="text-red-500 text-sm">{formik.errors.pollutionExpiryDate}</p>}
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
            {previews.insurance && <img src={previews.insurance} alt="Insurance Doc" className="mt-2 rounded-xl h-20 w-auto" />}
            {formik.touched.insuranceImage && formik.errors.insuranceImage && <p className="text-red-500 text-sm">{formik.errors.insuranceImage}</p>}
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
              {formik.touched.insuranceStartDate && formik.errors.insuranceStartDate && <p className="text-red-500 text-sm">{formik.errors.insuranceStartDate}</p>}
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
              {formik.touched.insuranceExpiryDate && formik.errors.insuranceExpiryDate && <p className="text-red-500 text-sm">{formik.errors.insuranceExpiryDate}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InsurancePollutionSection;