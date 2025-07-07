import { useFormik } from "formik";
import { useState, useEffect } from "react";
import axiosDriver from "@/shared/services/axios/driverAxios";
import { toast } from "sonner";
import Loader from "@/shared/components/loaders/shimmer";
import { VehicleValidation } from "@/shared/utils/validation";
import DriverInsurancePage from "./DriverInsurancePage";
import { useDispatch } from "react-redux";
import ApiEndpoints from "@/constants/api-end-pointes";

interface VehicleFormValues {
  registrationID: string;
  model: string;
  rcFrontImage: File | null;
  rcBackImage: File | null;
  carFrontImage: File | null;
  carSideImage: File | null;
  rcStartDate: string;
  rcExpiryDate: string;
}

function Vehicle() {
  const [locationPage, setLocationPage] = useState(false);
  const [load, setLoad] = useState(false);
  const [previews, setPreviews] = useState({
    rcFrontImage: null as string | null,
    rcBackImage: null as string | null,
    carFrontImage: null as string | null,
    carSideImage: null as string | null,
  });
  const dispatch = useDispatch()

  const initialValues: VehicleFormValues = {
    registrationID: "",
    model: "",
    rcFrontImage: null,
    rcBackImage: null,
    carFrontImage: null,
    carSideImage: null,
    rcStartDate: "",
    rcExpiryDate: "",
  };

  const formik = useFormik<VehicleFormValues>({
    initialValues,
    validationSchema: VehicleValidation,
    onSubmit: async (values) => {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        
        const value = values[key as keyof VehicleFormValues];
        if (value !== null) {
          formData.append(key, value);
        }
      });

      try {
        setLoad(true);  
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }      
        const driverId = localStorage.getItem("driverId");
        const { data } = await axiosDriver(dispatch).post(ApiEndpoints.DRIVER_ADD_VEHICLE_DETAILS+`?driverId=${driverId}`, 
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (data.message === "Success") {
          toast.success("Vehicle details submitted successfully");
          setLoad(false);
          setLocationPage(true);
        } else {
          toast.error(data.message);
        }
      } catch (error: any) {
        setLoad(false);
        toast.error("Error submitting: " + error.message);
      }
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof VehicleFormValues
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
        <DriverInsurancePage />
      ) : (
        <div className="bg-white driver-registration-container h-screen flex justify-center items-center">
          <div className="w-5/6 md:w-4/6 md:h-4/5 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
            <div className="relative overflow-hidden h-full sm:pl-14 md:pl-13 md:w-1/2 justify-around items-center mb-3 md:m-0">
              <div className="flex w-full justify-center pt-10 items-center">
                <h1 className="text-gradient font-bold text-4xl mx-7 md:mx-0 md:mt-4 md:text-5xl">
                  Submit Your Vehicle Details
                </h1>
              </div>
              <div className="hidden md:flex md:items-center justify-center">
                {load ? (
                  <Loader />
                ) : (
                  <img
                    style={{ height: "250px", width: "auto", marginTop: "50px" }}
                    src="/images/image.jpg"
                    alt="Vehicle Illustration"
                  />
                )}
              </div>
            </div>
            <div className="flex md:w-1/2 justify-center pb-10 md:py-10 px-2 mx-8 md:px-0 items-center">
              <div className="user-signup-form md:w-full px-9 py-8 bg-white drop-shadow-xl overflow-y-auto max-h-[80vh]">
                <form onSubmit={formik.handleSubmit}>
                  {/* Registration ID and Model */}
                  <div className="md:flex mb-6">
                    <div className="text-left md:pr-5">
                      <h1 className="text-black font-bold text-xs">Vehicle Registration ID</h1>
                      <input
                        id="registrationID"
                        className="pl-2 outline-none border-b w-full mb-2"
                        type="text"
                        name="registrationID"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.registrationID}
                      />
                      {formik.touched.registrationID && formik.errors.registrationID && (
                        <p className="text-xs text-red-500">{formik.errors.registrationID}</p>
                      )}
                    </div>
                    <div className="text-left">
                      <h1 className="text-black font-bold text-xs">Vehicle Model</h1>
                      <select
                        id="model"
                        name="model"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="select w-full max-w-xs text-black"
                        value={formik.values.model}
                      >
                        <option value="" disabled>
                          Select the model
                        </option>
                        <option value="Sedan">Sedan</option>
                        <option value="Standard">Standard</option>
                        <option value="SUV">SUV</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                      {formik.touched.model && formik.errors.model && (
                        <p className="text-xs text-red-500">{formik.errors.model}</p>
                      )}
                    </div>
                  </div>
                  {/* RC Images */}
                  <div className="md:flex mb-6">
                    <div className="text-left md:pr-3">
                      <h1 className="text-black font-bold text-xs">RC Front Image</h1>
                      <input
                        id="rcFrontImage"
                        type="file"
                        name="rcFrontImage"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "rcFrontImage")}
                        className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                      />
                      {previews.rcFrontImage && (
                        <img src={previews.rcFrontImage} alt="RC Front" className="mt-2 rounded-xl h-20 w-auto" />
                      )}
                      {formik.touched.rcFrontImage && formik.errors.rcFrontImage && (
                        <p className="text-xs text-red-500">{formik.errors.rcFrontImage}</p>
                      )}
                    </div>
                    <div className="text-left">
                      <h1 className="text-black font-bold text-xs">RC Back Image</h1>
                      <input
                        id="rcBackImage"
                        type="file"
                        name="rcBackImage"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "rcBackImage")}
                        className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                      />
                      {previews.rcBackImage && (
                        <img src={previews.rcBackImage} alt="RC Back" className="mt-2 rounded-xl h-20 w-auto" />
                      )}
                      {formik.touched.rcBackImage && formik.errors.rcBackImage && (
                        <p className="text-xs text-red-500">{formik.errors.rcBackImage}</p>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Images */}
                  <div className="md:flex mb-6">
                    <div className="text-left md:pr-3">
                      <h1 className="text-black font-bold text-xs">Vehicle Front Image</h1>
                      <input
                        id="carFrontImage"
                        type="file"
                        name="carFrontImage"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "carFrontImage")}
                        className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                      />
                      {previews.carFrontImage && (
                        <img src={previews.carFrontImage} alt="Car Front" className="mt-2 rounded-xl h-20 w-auto" />
                      )}
                      {formik.touched.carFrontImage && formik.errors.carFrontImage && (
                        <p className="text-xs text-red-500">{formik.errors.carFrontImage}</p>
                      )}
                    </div>
                    <div className="text-left">
                      <h1 className="text-black font-bold text-xs">Vehicle Back Image</h1>
                      <input
                        id="carSideImage"
                        type="file"
                        name="carBackImage"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "carSideImage")}
                        className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                      />
                      {previews.carSideImage && (
                        <img src={previews.carSideImage} alt="Car Side" className="mt-2 rounded-xl h-20 w-auto" />
                      )}
                      {formik.touched.carSideImage && formik.errors.carSideImage && (
                        <p className="text-xs text-red-500">{formik.errors.carSideImage}</p>
                      )}
                    </div>
                  </div>

                  {/* RC Dates */}
                  <div className="md:flex mb-6">
                    <div className="text-left md:pr-5">
                      <h1 className="text-black font-bold text-xs">RC Start Date</h1>
                      <input
                        id="rcStartDate"
                        className="pl-2 outline-none border-b w-full mb-2"
                        type="date"
                        name="rcStartDate"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.rcStartDate}
                      />
                      {formik.touched.rcStartDate && formik.errors.rcStartDate && (
                        <p className="text-xs text-red-500">{formik.errors.rcStartDate}</p>
                      )}
                    </div>
                    <div className="text-left">
                      <h1 className="text-black font-bold text-xs">RC Expiry Date</h1>
                      <input
                        id="rcExpiryDate"
                        className="pl-2 outline-none border-b w-full mb-2"
                        type="date"
                        name="rcExpiryDate"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.rcExpiryDate}
                      />
                      {formik.touched.rcExpiryDate && formik.errors.rcExpiryDate && (
                        <p className="text-xs text-red-500">{formik.errors.rcExpiryDate}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`block w-full bg-black py-2 rounded-2xl text-white font-semibold mb-2 ${
                      load ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
                    }`}
                    disabled={load}
                  >
                    {load ? "Loading..." : "Submit"}
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

export default Vehicle;