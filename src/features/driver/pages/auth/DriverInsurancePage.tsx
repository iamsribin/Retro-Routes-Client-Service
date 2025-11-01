import { useFormik } from "formik";
import { useState, useEffect } from "react";
import DriverLocationPage from "./DriverLocationPage";
import { InsuranceValidation } from "@/shared/utils/validation";
import { InsuranceFormValues } from "./type";
import { postData } from "@/shared/services/api/api-service";
import DriverApiEndpoints from "@/constants/driver-api-end-pontes";
import { FaShieldAlt, FaLeaf, FaCalendarAlt, FaUpload, FaFileAlt } from "react-icons/fa";
import { getItem, removeItem, setItem } from "@/shared/utils/localStorage";
import { useNavigate } from "react-router-dom";
import { toast } from "@/shared/hooks/use-toast";
import { handleCustomError } from "@/shared/utils/error";

function Insurance() {
  const [locationPage, setLocationPage] = useState(false);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const [previews, setPreviews] = useState({
    pollutionImage: null as string | null,
    insuranceImage: null as string | null,
  });
        const driverId = getItem("driverId");

        useEffect(() => {
          if (!driverId) {
          toast({description:"Driver ID not found. Please register again.", variant: "error"});
          navigate("/driver/signup");
          removeItem("currentStep");
          setLoad(false);
          return;
        }
        }, []);

  const initialValues: InsuranceFormValues = {
    pollutionImage: null,
    insuranceImage: null,
    insuranceStartDate: "",
    insuranceExpiryDate: "",
    pollutionStartDate: "",
    pollutionExpiryDate: "",
  };

  const formik = useFormik<InsuranceFormValues>({
    initialValues,
    validationSchema: InsuranceValidation,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
          const value = values[key as keyof InsuranceFormValues];
          if (value !== null) {
            formData.append(key, value);
          }
        });
        formData.append("driverId", driverId as string);
        setLoad(true);
         const res = await postData(DriverApiEndpoints.DRIVER_INSURANCE, formData);
         if(res?.status === 200){
           setLocationPage(true);
           setItem("currentStep", "location");
           toast({description: "Insurance details submitted successfully", variant: "success"});
         }
      } catch (error) {
        handleCustomError(error);
      } finally {
        setLoad(false);
      }
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof InsuranceFormValues
  ) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue(fieldName, file);
      const imageUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [fieldName]: imageUrl }));
    } else {
      formik.setFieldValue(fieldName, null);
      setPreviews((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <>
      {locationPage ? (
        <DriverLocationPage />
      ) : (
        <div className="min-h-screen w-full relative flex items-center justify-center p-4">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/pick2me-bg.png')",
              filter: "brightness(0.7)",
            }}
          />
          
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Content Container */}
          <div className="relative z-10 w-full max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Branding */}
              <div className="hidden lg:flex flex-col justify-center space-y-6 text-white">
                <h1 className="text-5xl xl:text-6xl font-bold leading-tight">
                  Insurance & <span className="text-yellow-400">Certification</span>
                </h1>
                <p className="text-xl text-gray-200">
                  Complete your registration with required documents
                </p>
                
                <div className="space-y-4 mt-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <FaShieldAlt className="text-gray-900 text-xl" />
                    </div>
                    <span className="text-lg">Insurance protection required</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <FaLeaf className="text-gray-900 text-xl" />
                    </div>
                    <span className="text-lg">Valid pollution certificate needed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-lg">Quick verification process</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="w-full">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10 max-h-[85vh] overflow-y-auto scrollbar-hide ">
                  {/* Header */}
                  <div className="text-center mb-8 lg:hidden">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Insurance <span className="text-yellow-600">Documents</span>
                    </h2>
                    <p className="text-gray-600">Upload your insurance and pollution certificates</p>
                  </div>

                  <div className="hidden lg:block text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Document Submission
                    </h2>
                    <p className="text-gray-600">Complete your vehicle documentation</p>
                  </div>

                  <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Pollution Certificate Section */}
                    <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="bg-green-100 rounded-full p-3 mr-3">
                          <FaLeaf className="text-green-600 text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Pollution Certificate</h3>
                      </div>

                      {/* Pollution Image Upload */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Certificate Document
                        </label>
                        <input
                          type="file"
                          name="pollutionImage"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "pollutionImage")}
                          className="hidden"
                          id="pollutionImage"
                        />
                        <label
                          htmlFor="pollutionImage"
                          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 transition-colors bg-white"
                        >
                          {previews.pollutionImage ? (
                            <div className="relative w-full h-full">
                              <img 
                                src={previews.pollutionImage} 
                                alt="Pollution Certificate" 
                                className="w-full h-full object-contain rounded-xl p-2" 
                              />
                              <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                ✓ Uploaded
                              </div>
                            </div>
                          ) : (
                            <>
                              <FaUpload className="text-gray-400 text-3xl mb-2" />
                              <span className="text-sm text-gray-500 font-medium">Upload Pollution Certificate</span>
                              <span className="text-xs text-gray-400 mt-1">Click to browse files</span>
                            </>
                          )}
                        </label>
                        {formik.touched.pollutionImage && formik.errors.pollutionImage && (
                          <p className="text-red-500 text-sm mt-1">{formik.errors.pollutionImage}</p>
                        )}
                      </div>

                      {/* Pollution Dates */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-500" />
                            Start Date
                          </label>
                          <input
                            className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
                            type="date"
                            name="pollutionStartDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.pollutionStartDate}
                          />
                          {formik.touched.pollutionStartDate && formik.errors.pollutionStartDate && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.pollutionStartDate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-500" />
                            Expiry Date
                          </label>
                          <input
                            className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
                            type="date"
                            name="pollutionExpiryDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.pollutionExpiryDate}
                          />
                          {formik.touched.pollutionExpiryDate && formik.errors.pollutionExpiryDate && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.pollutionExpiryDate}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Insurance Document Section */}
                    <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 rounded-full p-3 mr-3">
                          <FaShieldAlt className="text-blue-600 text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Insurance Document</h3>
                      </div>

                      {/* Insurance Image Upload */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Insurance Policy Document
                        </label>
                        <input
                          type="file"
                          name="insuranceImage"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "insuranceImage")}
                          className="hidden"
                          id="insuranceImage"
                        />
                        <label
                          htmlFor="insuranceImage"
                          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors bg-white"
                        >
                          {previews.insuranceImage ? (
                            <div className="relative w-full h-full">
                              <img 
                                src={previews.insuranceImage} 
                                alt="Insurance Document" 
                                className="w-full h-full object-contain rounded-xl p-2" 
                              />
                              <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                ✓ Uploaded
                              </div>
                            </div>
                          ) : (
                            <>
                              <FaUpload className="text-gray-400 text-3xl mb-2" />
                              <span className="text-sm text-gray-500 font-medium">Upload Insurance Document</span>
                              <span className="text-xs text-gray-400 mt-1">Click to browse files</span>
                            </>
                          )}
                        </label>
                        {formik.touched.insuranceImage && formik.errors.insuranceImage && (
                          <p className="text-red-500 text-sm mt-1">{formik.errors.insuranceImage}</p>
                        )}
                      </div>

                      {/* Insurance Dates */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-500" />
                            Start Date
                          </label>
                          <input
                            className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                            type="date"
                            name="insuranceStartDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.insuranceStartDate}
                          />
                          {formik.touched.insuranceStartDate && formik.errors.insuranceStartDate && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.insuranceStartDate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-500" />
                            Expiry Date
                          </label>
                          <input
                            className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                            type="date"
                            name="insuranceExpiryDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.insuranceExpiryDate}
                          />
                          {formik.touched.insuranceExpiryDate && formik.errors.insuranceExpiryDate && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.insuranceExpiryDate}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <FaFileAlt className="text-yellow-600 text-xl mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Important Information</h4>
                          <p className="text-sm text-gray-700">
                            Please ensure all documents are clear and valid. Expired documents will be rejected and may delay your approval process.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={load}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {load ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Submit Documents"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Insurance;