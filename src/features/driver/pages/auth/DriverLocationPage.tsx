/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import ExploreIcon from "@mui/icons-material/Explore";
import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import "mapbox-gl/dist/mapbox-gl.css";
import SignupMap from "./SignupMap";
import Loader from "@/shared/components/loaders/shimmer";
import { useJsApiLoader } from "@react-google-maps/api";
import { geocodeLatLng } from "@/shared/utils/locationToAddress";
import { getItem } from "@/shared/utils/localStorage";
import { toast } from "sonner";
import { postData } from "@/shared/services/api/api-service";
import DriverApiEndpoints from "@/constants/driver-api-end-pontes";
import { openPendingModal } from "@/shared/services/redux/slices/pendingModalSlice";
import { useDispatch } from "react-redux";

function DriverLocation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isGeolocationActive, setIsGeolocationActive] = useState(false);
  const [latitude, setLatitude] = useState(23.22639);
  const [longitude, setLongitude] = useState(79.17271);
  const [load, setLoad] = useState(false);
  const libraries: "places"[] = ["places"];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries,
  });

  const handleGeolocation = (lat: number, lng: number, status: any) => {
    setLatitude(lat);
    setLongitude(lng);
    formik.setFieldValue("latitude", lat);
    formik.setFieldValue("longitude", lng);
    setIsGeolocationActive(false);
  };

  const handleGetCurrentLocation = () => {
    setIsGeolocationActive(true);
  };

  const formik = useFormik({
    initialValues: {
      latitude: latitude,
      longitude: longitude,
    },
    validationSchema: Yup.object({
      latitude: Yup.number()
        .min(8.4, "Choose a valid location in India")
        .max(37.6, "Choose a valid location in India"),
      longitude: Yup.number()
        .min(68.7, "Choose a valid location in India")
        .max(97.25, "Choose a valid location in India"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (isLoaded) {
        try {
          setLoad(true);
          const address = await geocodeLatLng(
            values.latitude,
            values.longitude
          );
          const driverId = getItem("driverId");

          if (!driverId) {
            toast.error("Driver ID not found. Please try again.");
            navigate("/driver/signup");
            return;
          }

          setSubmitting(true);
          const requestData = {
            ...values,
            address,
          };
          postData(
            `${DriverApiEndpoints.DRIVER_LOCATION}?driverId=${driverId}`,
            "Driver",
            requestData
          );

          toast.success("Location saved successfully!");
          localStorage.removeItem("driverId");
          navigate("/driver/login");
          dispatch(openPendingModal());
        } catch (error) {
          toast.success("something went wrong try again");
          console.log(error);
        }
      }
    },
  });

  return (
    <div className="driver-registration-container h-screen flex justify-center items-center">
      <div className="w-5/6 md:w-4/6 md:h-4/5 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
        {/* Left Panel */}
        <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 justify-around items-center mb-3 md:m-0">
          <div className="flex w-full justify-center pt-10 items-center">
            <h1 className="text-blue-800 font-bold text-4xl mx-7 md:mx-0 md:mt-2 md:text-6xl user-signup-title">
              Choose your Location!
            </h1>
          </div>
          <h1 className="text-blue-800 text-sm mt-3 mx-7 md:mx-0 md:text-sm md:max-w-sm md:mt-3 user-signup-title">
            Select your preferred location to enhance navigation and provide
            efficient service to your passengers.
          </h1>
          <div className="hidden md:flex md:items-center justify-center">
            {load ? (
              <Loader />
            ) : (
              <img
                style={{ height: "300px", width: "auto" }}
                src="/images/location.jpg"
                alt="Location illustration"
              />
            )}
          </div>
        </div>
        {/* Right Panel - Map and Form */}
        <div className="flex md:w-1/2 justify-center pb-10 md:py-10 px-2 md:px-0 items-center">
          <form onSubmit={formik.handleSubmit}>
            <div className="user-signup-form driver-signup-map-form w-full h-full md:w-96 md:h-96 rounded-md drop-shadow-xl">
              <div className="mb-4 mt-4">
                <SignupMap
                  latitude={latitude}
                  longitude={longitude}
                  handleGeolocation={handleGeolocation}
                  isGeolocationActive={isGeolocationActive}
                />
              </div>
            </div>
            <div className="flex mt-6 justify-evenly">
              <div className="w-1/2 py-2.5 px-3 mr-1 flex justify-center items-center bg-blue-800 rounded-2xl">
                <ExploreIcon style={{ color: "white" }} />
                <button
                  onClick={handleGetCurrentLocation}
                  type="button"
                  className="w-full text-sm text-golden font-normal"
                >
                  Get Current Location
                </button>
              </div>
              <div className="w-1/2 ml-1 px-3 flex justify-center items-center bg-blue-800 rounded-2xl">
                <WhereToVoteIcon style={{ color: "white" }} />
                <button
                  type="submit"
                  className="w-full text-sm text-golden font-normal"
                >
                  Choose this location
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DriverLocation;
