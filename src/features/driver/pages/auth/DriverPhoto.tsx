import { useFormik } from "formik";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import DriverVehiclePage from "./DriverVehiclePage";
import { driverImageValidation } from "@/shared/utils/validation";
import { postData } from "@/shared/services/api/api-service";
import DriverApiEndpoints from "@/constants/driver-api-end-pontes";
import { FaCamera, FaRedo, FaCheckCircle } from "react-icons/fa";
import { toast } from "@/shared/hooks/use-toast";
import { removeItem } from "@/shared/utils/localStorage";
import { handleCustomError } from "@/shared/utils/error";
import { useNavigate } from "react-router-dom";

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

function DriverPhoto() {
  const [load, setLoad] = useState(false);
  const [initial, setInitial] = useState(true);
  const [vehiclePage, setVehiclePage] = useState(false);
  const navigate = useNavigate();
  const initialValues = {
    driverImage: null,
  };
  const validationSchema = driverImageValidation;
  const webcamRef = useRef<Webcam | null>(null);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoad(true);
        const driverId = localStorage.getItem("driverId");
        if (!driverId) {
          toast({description:"Driver ID not found signup again", variant: "error"});
          removeItem("currentStep");
          navigate("/driver/signup");
          return;
        }

        if (values.driverImage) {
          const blob = await fetch(values.driverImage).then((res) =>
            res.blob()
          );
          const file = new File([blob], "driverImage.jpeg", {
            type: "image/jpeg",
          });

          const formData = new FormData();
          formData.append("driverImage", file);

         const res = await postData(
            `${DriverApiEndpoints.DRIVER_UPLOAD_IMAGE}?driverId=${driverId}`,
            formData
          );
          if(res?.status == 200){
            toast({description:"Successfully uploaded image", variant: "success"});
            setVehiclePage(true);
          }
        }
      } catch (error) {
        handleCustomError(error);
      } finally {
        setLoad(false);
      }
    },
  });

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const driverImage = webcamRef.current.getScreenshot();
      formik.setFieldValue("driverImage", driverImage);
    }
  }, [formik]);

  return (
    <>
      {vehiclePage ? (
        <DriverVehiclePage />
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
                  Say <span className="text-yellow-400">Cheese!</span>
                </h1>
                <p className="text-xl text-gray-200">
                  Take a clear photo so riders can recognize you
                </p>
                
                <div className="space-y-4 mt-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-lg">Face the camera directly</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <span className="text-lg">Ensure good lighting</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-lg">Natural expression</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Camera/Photo Form */}
              <div className="w-full">
                {formik.values.driverImage ? (
                  // Photo Preview & Submit
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-6">
                      <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
                        <FaCheckCircle className="text-green-600 text-4xl" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Perfect Shot!
                      </h2>
                      <p className="text-gray-600">
                        Review your photo before submitting
                      </p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                      {/* Photo Preview */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <img
                            className="w-full max-w-sm h-auto rounded-2xl shadow-lg border-4 border-yellow-400"
                            src={formik.values.driverImage}
                            alt="Your Photo"
                          />
                          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            ✓ Captured
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("driverImage", null);
                          }}
                          className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-all duration-200"
                        >
                          <FaRedo />
                          <span>Retake Photo</span>
                        </button>

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
                              Uploading...
                            </span>
                          ) : (
                            "Submit Photo"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : initial ? (
                  // Initial State - Open Camera Button
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-8 lg:hidden">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Take Your <span className="text-yellow-600">Photo</span>
                      </h2>
                      <p className="text-gray-600">We need a clear photo of you</p>
                    </div>

                    <div className="hidden lg:block text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Profile Photo
                      </h2>
                      <p className="text-gray-600">Let's take your photo</p>
                    </div>

                    <div className="space-y-6">
                      {/* Camera Icon */}
                      <div className="flex justify-center">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-12">
                          <FaCamera className="text-white text-6xl" />
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                        <h3 className="font-bold text-gray-900 text-lg mb-3">Photo Guidelines:</h3>
                        <div className="flex items-start space-x-3">
                          <span className="text-yellow-600 font-bold">•</span>
                          <p className="text-gray-700">Face the camera directly with a neutral expression</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-yellow-600 font-bold">•</span>
                          <p className="text-gray-700">Ensure your face is well-lit and clearly visible</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-yellow-600 font-bold">•</span>
                          <p className="text-gray-700">Remove sunglasses or face coverings</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-yellow-600 font-bold">•</span>
                          <p className="text-gray-700">Use a plain background if possible</p>
                        </div>
                      </div>

                      {/* Open Camera Button */}
                      <button
                        type="button"
                        onClick={() => setInitial(false)}
                        className="w-full flex items-center justify-center space-x-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        <FaCamera className="text-xl" />
                        <span>Open Camera</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Camera View
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Position Yourself
                      </h2>
                      <p className="text-gray-600">
                        Make sure your face is centered and well-lit
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Webcam */}
                      <div className="relative flex justify-center">
                        <div className="relative">
                          <Webcam
                            className="rounded-2xl shadow-lg border-4 border-gray-200"
                            audio={false}
                            height={400}
                            ref={webcamRef}
                            width={400}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                          />
                          {/* Overlay Guide */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="h-full w-full border-2 border-dashed border-yellow-400 rounded-2xl opacity-50"></div>
                          </div>
                        </div>
                      </div>

                      {/* Capture Button */}
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={capture}
                          className="flex items-center justify-center space-x-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-4 px-12 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          <FaCamera className="text-xl" />
                          <span>Capture Photo</span>
                        </button>
                      </div>

                      {/* Cancel Button */}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setInitial(true)}
                          className="text-gray-600 hover:text-gray-800 font-semibold underline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DriverPhoto;