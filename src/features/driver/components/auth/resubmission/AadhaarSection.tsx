import { AadhaarSectionProps } from '../type';

const AadhaarSection: React.FC<AadhaarSectionProps> = ({ formik, previews, handleFileInput, resubmissionData }) => {
  if (!resubmissionData.fields.includes('aadhar')) return null;

  return (
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
      {formik.touched.aadharID && formik.errors.aadharID && <p className="text-red-500 text-sm">{formik.errors.aadharID}</p>}
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
          {previews.aadharFront && <img src={previews.aadharFront} alt="Aadhaar Front Preview" className="mt-2 h-20 w-auto" />}
          {formik.touched.aadharFrontImage && formik.errors.aadharFrontImage && <p className="text-red-500 text-sm">{formik.errors.aadharFrontImage}</p>}
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
          {previews.aadharBack && <img src={previews.aadharBack} alt="Aadhaar Back Preview" className="mt-2 h-20 w-auto" />}
          {formik.touched.aadharBackImage && formik.errors.aadharBackImage && <p className="text-red-500 text-sm">{formik.errors.aadharBackImage}</p>}
        </div>
      </div>
    </div>
  );
};

export default AadhaarSection;