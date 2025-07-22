import { useFormik } from "formik";
import { useState, useEffect } from "react";
import Loader from "@/shared/components/loaders/shimmer";
import { VehicleValidation } from "@/shared/utils/validation";
import DriverInsurancePage from "./DriverInsurancePage";
import { useDispatch } from "react-redux";
import { VehicleFormValues } from "./type";
import { submitVehicleData } from "@/shared/services/api/driverAuthApi";
import { fetchVehicleModels } from "@/shared/services/api/bookingApi";
import { AdminAllowedVehicleModel } from "@/shared/types/commonTypes";

function Vehicle() {
  const [locationPage, setLocationPage] = useState(false);
  const [load, setLoad] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<AdminAllowedVehicleModel | null>(
    null
  );
  const [previews, setPreviews] = useState({
    rcFrontImage: null as string | null,
    rcBackImage: null as string | null,
    carFrontImage: null as string | null,
    carSideImage: null as string | null,
  });
  const dispatch = useDispatch();

  const initialValues: VehicleFormValues = {
    registrationId: "",
    model: "",
    vehicleColor: "",
    vehicleNumber: "",
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
      submitVehicleData(dispatch, formData, setLoad, setLocationPage);
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

  const [vehicleModels, setVehicleModels] = useState<AdminAllowedVehicleModel[]>([]);

  useEffect(() => {
 fetchVehicleModels(dispatch,setVehicleModels);
  }, []);

  const handleVehicleSelect = (vehicle: AdminAllowedVehicleModel) => {
    setSelectedVehicle(vehicle);
    formik.setFieldValue("model", vehicle.vehicleModel);
    setIsDropdownOpen(false);
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
                    style={{
                      height: "250px",
                      width: "auto",
                      marginTop: "50px",
                    }}
                    src="/images/image.jpg"
                    alt="Vehicle Illustration"
                  />
                )}
              </div>
            </div>
            <div className="flex md:w-1/2 justify-center pb-10 md:py-10 px-2 mx-8 md:px-0 items-center">
              <div className="user-signup-form md:w-full px-9 py-8 bg-white drop-shadow-xl overflow-y-auto max-h-[80vh]">
                <form onSubmit={formik.handleSubmit}>
                  {/* Vehicle Number and Color */}
                  <div className="md:flex mb-6">
                    <div className="text-left md:pr-5">
                      <h1 className="text-black font-bold text-xs">
                        Vehicle Number
                      </h1>
                      <input
                        id="vehicleNumber"
                        className="pl-2 outline-none border-b w-full mb-2"
                        type="text"
                        name="vehicleNumber"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.vehicleNumber}
                      />
                      {formik.touched.vehicleNumber &&
                        formik.errors.vehicleNumber && (
                          <p className="text-xs text-red-500">
                            {formik.errors.vehicleNumber}
                          </p>
                        )}
                    </div>

                    <div className="text-left">
                      <h1 className="text-black font-bold text-xs">
                        Vehicle Color
                      </h1>
                      <input
                        id="vehicleColor"
                        className="pl-2 outline-none border-b w-full mb-2"
                        type="text"
                        name="vehicleColor"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.vehicleColor}
                      />
                      {formik.touched.vehicleColor &&
                        formik.errors.vehicleColor && (
                          <p className="text-xs text-red-500">
                            {formik.errors.vehicleColor}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Registration ID and Model */}
                  <div className="md:flex mb-6">
                    <div className="text-left md:pr-5">
                      <h1 className="text-black font-bold text-xs">
                        Vehicle Registration ID
                      </h1>
                      <input
                        id="registrationId"
                        className="pl-2 outline-none border-b w-full mb-2"
                        type="text"
                        name="registrationId"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.registrationId}
                      />
                      {formik.touched.registrationId &&
                        formik.errors.registrationId && (
                          <p className="text-xs text-red-500">
                            {formik.errors.registrationId}
                          </p>
                        )}
                    </div>

                    {/* Enhanced Vehicle Model Dropdown */}
                    <div className="text-left relative w-full">
                      <h1 className="text-black font-bold text-xs mb-2">
                        Vehicle Model
                      </h1>

                      {/* Custom Dropdown Button */}
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
                      >
                        <span
                          className={
                            selectedVehicle ? "text-black" : "text-gray-500"
                          }
                        >
                          {selectedVehicle
                            ? selectedVehicle.vehicleModel
                            : "Select a vehicle model"}
                        </span>
                        <svg
                          className={`w-5 h-5 transition-transform ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Dropdown Options */}
                      {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {vehicleModels.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500">
                              No vehicle models available
                            </div>
                          ) : (
                            vehicleModels.map((vehicle) => (
                              <div
                                key={vehicle._id}
                                onClick={() => handleVehicleSelect(vehicle)}
                                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                {/* Vehicle Image */}
                                <div className="flex-shrink-0 w-12 h-12 mr-3">
                                  <img
                                    src={vehicle.image}
                                    alt={vehicle.vehicleModel}
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "/images/default-vehicle.png";
                                    }}
                                  />
                                </div>

                                {/* Vehicle Details */}
                                <div className="flex-grow">
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-sm text-gray-900">
                                      {vehicle.vehicleModel}
                                    </h3>
                                    <span className="text-xs text-blue-600 font-medium">
                                      ETA: {vehicle.eta}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                    <span>Base: ₹{vehicle.basePrice}</span>
                                    <span>Per km: ₹{vehicle.pricePerKm}</span>
                                    <span>Min: {vehicle.minDistanceKm}km</span>
                                  </div>

                                  {/* Features */}
                                  <div className="flex flex-wrap gap-1">
                                    {vehicle.features
                                      .slice(0, 2)
                                      .map((feature, index) => (
                                        <span
                                          key={index}
                                          className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                                        >
                                          {feature}
                                        </span>
                                      ))}
                                    {vehicle.features.length > 2 && (
                                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                        +{vehicle.features.length - 2} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {/* Selected Vehicle Preview */}
                      {selectedVehicle && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center space-x-3">
                            <img
                              src={selectedVehicle.image}
                              alt={selectedVehicle.vehicleModel}
                              className="w-10 h-10 object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/images/default-vehicle.png";
                              }}
                            />
                            <div>
                              <p className="font-semibold text-sm text-blue-900">
                                {selectedVehicle.vehicleModel}
                              </p>
                              <p className="text-xs text-blue-700">
                                Base: ₹{selectedVehicle.basePrice} | Per km: ₹
                                {selectedVehicle.pricePerKm}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {formik.touched.model && formik.errors.model && (
                        <p className="text-xs text-red-500 mt-1">
                          {formik.errors.model}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* RC Images */}
                  <div className="md:flex mb-6">
                    <div className="text-left md:pr-3">
                      <h1 className="text-black font-bold text-xs">
                        RC Front Image
                      </h1>
                      <input
                        id="rcFrontImage"
                        type="file"
                        name="rcFrontImage"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "rcFrontImage")}
                        className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                      />
                      {previews.rcFrontImage && (
                        <img
                          src={previews.rcFrontImage}
                          alt="RC Front"
                          className="mt-2 rounded-xl h-20 w-auto"
                        />
                      )}
                      {formik.touched.rcFrontImage &&
                        formik.errors.rcFrontImage && (
                          <p className="text-xs text-red-500">
                            {formik.errors.rcFrontImage}
                          </p>
                        )}
                    </div>
                    <div className="text-left">
                      <h1 className="text-black font-bold text-xs">
                        RC Back Image
                      </h1>
                      <input
                        id="rcBackImage"
                        type="file"
                        name="rcBackImage"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "rcBackImage")}
                        className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                      />
                      {previews.rcBackImage && (
                        <img
                          src={previews.rcBackImage}
                          alt="RC Back"
                          className="mt-2 rounded-xl h-20 w-auto"
                        />
                      )}
                      {formik.touched.rcBackImage &&
                        formik.errors.rcBackImage && (
                          <p className="text-xs text-red-500">
                            {formik.errors.rcBackImage}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Vehicle Images */}
                  <div className="md:flex mb-6">
                    <div className="text-left md:pr-3">
                      <h1 className="text-black font-bold text-xs">
                        Vehicle Front Image
                      </h1>
                      <input
                        id="carFrontImage"
                        type="file"
                        name="carFrontImage"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "carFrontImage")}
                        className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                      />
                      {previews.carFrontImage && (
                        <img
                          src={previews.carFrontImage}
                          alt="Car Front"
                          className="mt-2 rounded-xl h-20 w-auto"
                        />
                      )}
                      {formik.touched.carFrontImage &&
                        formik.errors.carFrontImage && (
                          <p className="text-xs text-red-500">
                            {formik.errors.carFrontImage}
                          </p>
                        )}
                    </div>
                    <div className="text-left">
                      <h1 className="text-black font-bold text-xs">
                        Vehicle Back Image
                      </h1>
                      <input
                        id="carSideImage"
                        type="file"
                        name="carBackImage"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "carSideImage")}
                        className="block w-full px-3 py-1.5 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl"
                      />
                      {previews.carSideImage && (
                        <img
                          src={previews.carSideImage}
                          alt="Car Side"
                          className="mt-2 rounded-xl h-20 w-auto"
                        />
                      )}
                      {formik.touched.carSideImage &&
                        formik.errors.carSideImage && (
                          <p className="text-xs text-red-500">
                            {formik.errors.carSideImage}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* RC Dates */}
                  <div className="md:flex mb-6">
                    <div className="text-left md:pr-5">
                      <h1 className="text-black font-bold text-xs">
                        RC Start Date
                      </h1>
                      <input
                        id="rcStartDate"
                        className="pl-2 outline-none border-b w-full mb-2"
                        type="date"
                        name="rcStartDate"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.rcStartDate}
                      />
                      {formik.touched.rcStartDate &&
                        formik.errors.rcStartDate && (
                          <p className="text-xs text-red-500">
                            {formik.errors.rcStartDate}
                          </p>
                        )}
                    </div>
                    <div className="text-left">
                      <h1 className="text-black font-bold text-xs">
                        RC Expiry Date
                      </h1>
                      <input
                        id="rcExpiryDate"
                        className="pl-2 outline-none border-b w-full mb-2"
                        type="date"
                        name="rcExpiryDate"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.rcExpiryDate}
                      />
                      {formik.touched.rcExpiryDate &&
                        formik.errors.rcExpiryDate && (
                          <p className="text-xs text-red-500">
                            {formik.errors.rcExpiryDate}
                          </p>
                        )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`block w-full bg-black py-2 rounded-2xl text-white font-semibold mb-2 ${
                      load
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-800"
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
