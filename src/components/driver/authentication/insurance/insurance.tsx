  import { useFormik } from "formik";
  import { useState, useEffect } from "react";
  import axiosDriver from "../../../../services/axios/driverAxios";
  import { toast } from "sonner";
  import DriverLocationPage from "../../../../pages/driver/authentication/DriverLocationPage";
  import Loader from "../../../shimmer/Loader";
  import * as Yup from "yup";

  interface InsuranceFormValues {
    pollutionImage: File | null;
    insuranceImage: File | null;
    insuranceStartDate: string;
    insuranceExpiryDate: string;
    pollutionStartDate: string;
    pollutionExpiryDate: string;
  }

  const InsuranceValidation = Yup.object().shape({
    pollutionImage: Yup.mixed().required("Pollution certificate image is required"),
    insuranceImage: Yup.mixed().required("Insurance image is required"),
    insuranceStartDate: Yup.string().required("Insurance start date is required"),
    insuranceExpiryDate: Yup.string()
      .required("Insurance expiry date is required")
      .test("is-after-start", "Expiry date must be after start date", function (value) {
        const { insuranceStartDate } = this.parent;
        return insuranceStartDate && value ? new Date(value) > new Date(insuranceStartDate) : true;
      }),
    pollutionStartDate: Yup.string().required("Pollution start date is required"),
    pollutionExpiryDate: Yup.string()
      .required("Pollution expiry date is required")
      .test("is-after-start", "Expiry date must be after start date", function (value) {
        const { pollutionStartDate } = this.parent;
        return pollutionStartDate && value ? new Date(value) > new Date(pollutionStartDate) : true;
      }),
  });

  function Insurance() {
    const [locationPage, setLocationPage] = useState(false);
    const [load, setLoad] = useState(false);
    const [previews, setPreviews] = useState({
      pollutionImage: null as string | null,
      insuranceImage: null as string | null,
    });

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
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
          const value = values[key as keyof InsuranceFormValues];
          if (value !== null) {
            formData.append(key, value);
          }
        });

        try {
          setLoad(true);
          const driverId = localStorage.getItem("driverId");
          const { data } = await axiosDriver().post(
            `/insuranceDetails?driverId=${driverId}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          if (data.message === "Success") {
            toast.success("Insurance details submitted successfully");
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
          <div className="bg-white driver-registration-container h-screen flex justify-center items-center">
            <div className="w-5/6 md:w-4/6 md:h-4/5 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
              <div className="relative overflow-hidden h-full sm:pl-14 md:pl-13 md:w-1/2 justify-around items-center mb-3 md:m-0">
                <div className="flex w-full justify-center pt-10 items-center">
                  <h1 className="text-gradient font-bold text-4xl mx-7 md:mx-0 md:mt-4 md:text-5xl">
                    Submit Insurance Details
                  </h1>
                </div>
                <div className="hidden md:flex md:items-center justify-center">
                  {load ? (
                    <Loader />
                  ) : (
                    <img
                      style={{ height: "250px", width: "auto", marginTop: "50px" }}
                      src="/images/insurance-illustration.jpg"
                      alt="Insurance Illustration"
                    />
                  )}
                </div>
              </div>
              <div className="flex md:w-1/2 justify-center pb-10 md:py-10 px-2 mx-8 md:px-0 items-center">
                <div className="user-signup-form md:w-full px-9 py-8 bg-white drop-shadow-xl overflow-y-auto max-h-[80vh]">
                  <form onSubmit={formik.handleSubmit}>
                    {/* Pollution Image and Dates */}
                    <div className="mb-6">
                      <div className="text-left">
                        <h1 className="text-black font-bold text-xs">Pollution Certificate Image</h1>
                        <input
                          id="pollutionImage"
                          type="file"
                          name="pollutionImage"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "pollutionImage")}
                          className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                        />
                        {previews.pollutionImage && (
                          <img src={previews.pollutionImage} alt="Pollution Cert" className="mt-2 rounded-xl h-20 w-auto" />
                        )}
                        {formik.touched.pollutionImage && formik.errors.pollutionImage && (
                          <p className="text-xs text-red-500">{formik.errors.pollutionImage}</p>
                        )}
                      </div>
                      <div className="md:flex mt-4">
                        <div className="text-left md:pr-5">
                          <h1 className="text-black font-bold text-xs">Pollution Start Date</h1>
                          <input
                            id="pollutionStartDate"
                            className="pl-2 outline-none border-b w-full mb-2"
                            type="date"
                            name="pollutionStartDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.pollutionStartDate}
                          />
                          {formik.touched.pollutionStartDate && formik.errors.pollutionStartDate && (
                            <p className="text-xs text-red-500">{formik.errors.pollutionStartDate}</p>
                          )}
                        </div>
                        <div className="text-left">
                          <h1 className="text-black font-bold text-xs">Pollution Expiry Date</h1>
                          <input
                            id="pollutionExpiryDate"
                            className="pl-2 outline-none border-b w-full mb-2"
                            type="date"
                            name="pollutionExpiryDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.pollutionExpiryDate}
                          />
                          {formik.touched.pollutionExpiryDate && formik.errors.pollutionExpiryDate && (
                            <p className="text-xs text-red-500">{formik.errors.pollutionExpiryDate}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Insurance Image and Dates */}
                    <div className="mb-6">
                      <div className="text-left">
                        <h1 className="text-black font-bold text-xs">Insurance Document Image</h1>
                        <input
                          id="insuranceImage"
                          type="file"
                          name="insuranceImage"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "insuranceImage")}
                          className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                        />
                        {previews.insuranceImage && (
                          <img src={previews.insuranceImage} alt="Insurance Doc" className="mt-2 rounded-xl h-20 w-auto" />
                        )}
                        {formik.touched.insuranceImage && formik.errors.insuranceImage && (
                          <p className="text-xs text-red-500">{formik.errors.insuranceImage}</p>
                        )}
                      </div>
                      <div className="md:flex mt-4">
                        <div className="text-left md:pr-5">
                          <h1 className="text-black font-bold text-xs">Insurance Start Date</h1>
                          <input
                            id="insuranceStartDate"
                            className="pl-2 outline-none border-b w-full mb-2"
                            type="date"
                            name="insuranceStartDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.insuranceStartDate}
                          />
                          {formik.touched.insuranceStartDate && formik.errors.insuranceStartDate && (
                            <p className="text-xs text-red-500">{formik.errors.insuranceStartDate}</p>
                          )}
                        </div>
                        <div className="text-left">
                          <h1 className="text-black font-bold text-xs">Insurance Expiry Date</h1>
                          <input
                            id="insuranceExpiryDate"
                            className="pl-2 outline-none border-b w-full mb-2"
                            type="date"
                            name="insuranceExpiryDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.insuranceExpiryDate}
                          />
                          {formik.touched.insuranceExpiryDate && formik.errors.insuranceExpiryDate && (
                            <p className="text-xs text-red-500">{formik.errors.insuranceExpiryDate}</p>
                          )}
                        </div>
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

  export default Insurance;