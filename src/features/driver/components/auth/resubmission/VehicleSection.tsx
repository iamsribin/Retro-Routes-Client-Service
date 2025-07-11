import { VehicleSectionProps } from "../type";

const VehicleSection: React.FC<VehicleSectionProps> = ({ formik, previews, handleFileInput, resubmissionData }) => {
  if (!['registerationID', 'model', 'rc', 'carImage'].some(field => resubmissionData.fields.includes(field))) return null;

  return (
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
          {formik.touched.registerationID && formik.errors.registerationID && <p className="text-red-500 text-sm">{formik.errors.registerationID}</p>}
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
          {formik.touched.model && formik.errors.model && <p className="text-red-500 text-sm">{formik.errors.model}</p>}
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
            {previews.rcFront && <img src={previews.rcFront} alt="RC Front Preview" className="mt-2 h-20 w-auto" />}
            {formik.touched.rcFrontImage && formik.errors.rcFrontImage && <p className="text-red-500 text-sm">{formik.errors.rcFrontImage}</p>}
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
            {previews.rcBack && <img src={previews.rcBack} alt="RC Back Preview" className="mt-2 h-20 w-auto" />}
            {formik.touched.rcBackImage && formik.errors.rcBackImage && <p className="text-red-500 text-sm">{formik.errors.rcBackImage}</p>}
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
            {previews.carFront && <img src={previews.carFront} alt="Car Front Preview" className="mt-2 h-20 w-auto" />}
            {formik.touched.carFrontImage && formik.errors.carFrontImage && <p className="text-red-500 text-sm">{formik.errors.carFrontImage}</p>}
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
            {previews.carBack && <img src={previews.carBack} alt="Car Back Preview" className="mt-2 h-20 w-auto" />}
            {formik.touched.carBackImage && formik.errors.carBackImage && <p className="text-red-500 text-sm">{formik.errors.carBackImage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleSection;