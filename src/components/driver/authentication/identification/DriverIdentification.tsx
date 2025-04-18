import { useState } from "react";
import { useFormik } from "formik";
import axiosDriver from "../../../../services/axios/driverAxios";
import { toast } from "sonner";
import DriverPhotoPage from "../photo/DriverPhoto";
import Loader from "../../../shimmer/Loader";
import { Player } from "@lottiefiles/react-lottie-player";
import { useDispatch } from "react-redux";
import { DriverIdentificationValidation } from "@/utils/validation";
import ApiEndpoints from "@/constants/api-end-points";


function DriverIdentification() {
  const [photoPage, setPhotoPage] = useState(false);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const [previews, setPreviews] = useState({
    aadharFront: null,
    aadharBack: null,
    licenseFront: null,
    licenseBack: null,
  });

  const initialValues = {
    aadharID: "",
    aadharFrontImage: null,
    aadharBackImage: null,
    licenseID: "",
    licenseFrontImage: null,
    licenseBackImage: null,
    licenseValidity: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: DriverIdentificationValidation,
    onSubmit: async (values) => {
        const formData = new FormData();
      
        formData.append("aadharID", values.aadharID);
        if (values.aadharFrontImage) {
          formData.append("aadharFrontImage", values.aadharFrontImage);
        }
        if (values.aadharBackImage) {
          formData.append("aadharBackImage", values.aadharBackImage);
        }
      
        formData.append("licenseID", values.licenseID);
        if (values.licenseFrontImage) {
          formData.append("licenseFrontImage", values.licenseFrontImage);
        }
        if (values.licenseBackImage) {
          formData.append("licenseBackImage", values.licenseBackImage);
        }
      
        formData.append("licenseValidity", values.licenseValidity);
      
        handleUpload(formData);
      }
      
  });

  const handleUpload = async (formData:FormData) => {
    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
    
    const driverId = localStorage.getItem("driverId");
    setLoad(true);
    try {
      const response = await axiosDriver(dispatch).post(ApiEndpoints.DRIVER_IDENTIFICATION+`?driverId=${driverId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.message === "Success") {
        setLoad(false);
        setPhotoPage(true);
        toast.success("Identification details submitted successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      setLoad(false);
      toast.error("Error updating: " + error.message);
    }
  };

  const handleFileInput = (fieldName:string,e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(fieldName, file);
    }
  };

  const handleImageChange = (fieldName:string, file: File) => {
    formik.setFieldValue(fieldName, file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [fieldName.replace("Image", "")]: previewUrl }));
    }
  };

  return (
    <>
      {photoPage ? (
        <DriverPhotoPage />
      ) : (
        <div className="driver-registration-container h-screen flex justify-center items-center bg-white">
          <div className="w-6/7 md:w-5/6 md:h-5/6 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
            <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 justify-around items-center mb-3 md:m-0">
              <div className="flex w-full justify-center pt-10 items-center">
                <h1 className="text-blue-800 font-bold text-4xl mx-7 md:mx-0 md:mt-4 md:text-5xl">
                  Enter Your Identification Details
                </h1>
              </div>
              <div className="hidden md:flex md:items-center justify-center" style={{ marginTop: "-30px" }}>
                {load ? (
                  <Loader />
                ) : (
                  <Player
                    autoplay
                    loop
                    src="https://lottie.host/4d9f98cb-2a44-4a20-b422-649992c60069/MTxuwxSyrs.json"
                    style={{ height: "80%", width: "80%", background: "transparent" }}
                  />
                )}
              </div>
            </div>
            <div className="flex md:w-1/2 justify-center pb-10 md:py-10 px-2 md:px-0 items-center">
              <div className="user-signup-form md:w-10/12 px-9 py-8 bg-white drop-shadow-xl overflow-y-auto max-h-[80vh]">
                <form onSubmit={formik.handleSubmit}>
                  {/* Aadhaar Section */}
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
                          onChange={(e)=>handleFileInput("aadharFrontImage",e)}
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
                          onChange={(e)=>handleFileInput("aadharBackImage",e)}
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

                  {/* Driving License Section */}
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
                          onChange={(e)=>handleFileInput("licenseFrontImage",e)}
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
                          onChange={(e)=>handleFileInput("licenseBackImage",e)}
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

                  <button
                    type="submit"
                    className="block w-full bg-blue-800 py-2 rounded-2xl text-white font-semibold mb-2"
                    disabled={load}
                  >
                    {load ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DriverIdentification;