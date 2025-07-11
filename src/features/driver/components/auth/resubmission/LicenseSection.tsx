import { LicenseSectionProps } from '../type';

const LicenseSection: React.FC<LicenseSectionProps> = ({ formik, previews, handleFileInput, resubmissionData }) => {
  if (!resubmissionData.fields.includes('license')) return null;

  return (
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
      {formik.touched.licenseID && formik.errors.licenseID && <p className="text-red-500 text-sm">{formik.errors.licenseID}</p>}
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
          {previews.licenseFront && <img src={previews.licenseFront} alt="License Front Preview" className="mt-2 h-20 w-auto" />}
          {formik.touched.licenseFrontImage && formik.errors.licenseFrontImage && <p className="text-red-500 text-sm">{formik.errors.licenseFrontImage}</p>}
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
          {previews.licenseBack && <img src={previews.licenseBack} alt="License Back Preview" className="mt-2 h-20 w-auto" />}
          {formik.touched.licenseBackImage && formik.errors.licenseBackImage && <p className="text-red-500 text-sm">{formik.errors.licenseBackImage}</p>}
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
        {formik.touched.licenseValidity && formik.errors.licenseValidity && <p className="text-red-500 text-sm">{formik.errors.licenseValidity}</p>}
      </div>
    </div>
  );
};

export default LicenseSection;