import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "sonner";
import { ConfirmationResult } from "firebase/auth";
import { PinInput, PinInputField, HStack } from "@chakra-ui/react";
import { FaMobileAlt, FaUser, FaEnvelope, FaKey, FaUsers } from "react-icons/fa";
import axiosDriver from "@/services/axios/driverAxios";
import { sendOtp } from "@/hooks/useAuth";
import { signupValidation } from "@/utils/validation";
import { auth } from "@/services/firebase";
import { useDispatch } from "react-redux";
import ApiEndpoints from "@/constants/api-end-points";

interface DriverSignupFormProps {
  otpPage: boolean;
  setOtpPage: (value: boolean) => void;
  counter: number;
  setCounter: (value: number) => void;
  load: boolean;
  setLoad: (value: boolean) => void;
  otp: number;
  setOtp: (value: number) => void;
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: (value: ConfirmationResult | null) => void;
  setStep: (step: "credentials" | "documents" | "location" | "driverImage" | "vehicle" | "insurance") => void;
}

const DriverSignupForm = ({
  otpPage,
  setOtpPage,
  counter,
  setCounter,
  load,
  setLoad,
  otp,
  setOtp,
  confirmationResult,
  setConfirmationResult,
  setStep,
}: DriverSignupFormProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setOtpPage(false);
  }, [setOtpPage]);

  useEffect(() => {
    if (otpPage && counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter, otpPage, setCounter]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      re_password: "",
      referred_code: "",
    },
    validationSchema: signupValidation,
    onSubmit: async (values, { setSubmitting }) => {
      setLoad(true);
      try {
        await checkDriver(values);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setSubmitting(false);
        setLoad(false);
      }
    },
  });

  const checkDriver = async (formData: typeof formik.values) => {
    const { data } = await axiosDriver(dispatch).post("/checkDriver", formData);
    switch (data.message) {
      case "Document is pending":
        toast.info("Driver Already registered!\n Please verify the documents");
        console.log("===============", data.driverId);
        
        localStorage.setItem("driverId", data.driverId);
        setStep("documents");
        break;
      case "Driver image is pending":
        toast.info("Driver Already registered!\n Please submit your image");
        localStorage.setItem("driverId", data.driverId);
        setStep("driverImage");
        break;
      case "Location is pending":
        toast.info("Driver Already registered!\n Please submit your location");
        localStorage.setItem("driverId", data.driverId);
        setStep("location");
        break;
      case "Insurance is pending":
        toast.info("Driver Already registered!\n Please submit your insurance and pollution");
        localStorage.setItem("driverId", data.driverId);
        setStep("insurance");
        break;
      case "Vehicle details are pending":
        toast.info("Driver Already registered!\n Please submit your vehicle details");
        localStorage.setItem("driverId", data.driverId);
        setStep("vehicle");
        break;
      default:
        sendOtp(setOtp, auth, formData.mobile, setConfirmationResult);
        setOtpPage(true);
        break;
    }
  };
  

  const handleOtpChange = (index: number, newValue: string) => {
    const parsedValue = parseInt(newValue) || 0;
    const newOtp = [...otp.toString().padStart(6, "0")];
    newOtp[index] = parsedValue.toString();
    setOtp(parseInt(newOtp.join("")) || 0);
  };

  const handleOtpVerify = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoad(true);
    if (!otp || !confirmationResult) {
      toast.error("Enter a valid OTP");
      setLoad(false);
      return;
    }

    try {
      await confirmationResult.confirm(otp.toString());
      await registerDriver();
    } catch {
      toast.error("Enter a valid OTP");
      setLoad(false);
    }
  };

  const registerDriver = async () => {
    try {
      const { data } = await axiosDriver(dispatch).post(ApiEndpoints.DRIVER_REGISTER, formik.values);
      if (data.message === "Success") {
        toast.success("OTP verified successfully");
        localStorage.setItem("driverId", data.driverId);
        localStorage.setItem("role", "driverRegistration");
        setStep("documents");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
      {otpPage ? (
        <div className="flex md:w-1/2 justify-center px-4 pb-10 md:py-10 items-center">
          <div className="user-otp-form md:w-10/12 px-9 py-10 bg-white drop-shadow-2xl">
            <form>
              <div className="flex justify-center items-center mb-5">
                <h1 className="text-gray-800 font-bold text-xl text-center">
                  Enter the OTP sent to your mobile
                </h1>
              </div>
              <HStack>
                <PinInput otp placeholder="">
                  {[...Array(6)].map((_, index) => (
                    <PinInputField
                      key={index}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                    />
                  ))}
                </PinInput>
              </HStack>
              <button
                onClick={handleOtpVerify}
                type="submit"
                className="block w-full bg-black py-2 my-4 rounded-2xl text-white font-semibold mb-2"
              >
                Verify
              </button>
              <div className="text-center text-gray-500 mt-4">
                {counter > 0 ? (
                  <p className="text-sm">Resend OTP in 00:{counter}</p>
                ) : (
                  <p
                    className="text-sm text-blue-800 cursor-pointer"
                    onClick={() => {
                      setCounter(40);
                      setOtp(0);
                      sendOtp(setOtp, auth, formik.values.mobile, setConfirmationResult);
                      setOtpPage(true);
                    }}
                  >
                    Resend OTP
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex md:w-1/2 justify-center pb-10 md:py-10 items-center">
          <div className="driver-signup-form md:w-8/12 px-9 py-8 bg-white drop-shadow-xl">
            <form onSubmit={formik.handleSubmit}>
              <div className="flex items-center py-2 px-3 rounded-2xl mb-2">
                <FaUser className="text-gray-400" />
                <input
                  className={formik.touched.name && formik.errors.name ? "pl-2 outline-none border-b border-red-400 w-full" : "pl-2 outline-none border-b w-full"}
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="name"
                  placeholder="Full name"
                />
              </div>
              {formik.touched.name && formik.errors.name && <p className="form-error-p-tag">{formik.errors.name}</p>}
              <div className="flex items-center py-2 px-3 rounded-2xl mb-2">
                <FaEnvelope className="text-gray-400" />
                <input
                  className={formik.touched.email && formik.errors.email ? "pl-2 outline-none border-b border-red-400 w-full" : "pl-2 outline-none border-b w-full"}
                  type="text"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="email"
                  placeholder="Email Address"
                />
              </div>
              {formik.touched.email && formik.errors.email && <p className="form-error-p-tag">{formik.errors.email}</p>}
              <div className="flex items-center py-2 px-3 rounded-2xl mb-2">
                <FaMobileAlt className="text-gray-400" />
                <input
                  className={formik.touched.mobile && formik.errors.mobile ? "pl-2 outline-none border-b border-red-400 w-full" : "pl-2 outline-none border-b w-full"}
                  type="text"
                  name="mobile"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="mobile"
                  placeholder="Mobile number"
                />
              </div>
              {formik.touched.mobile && formik.errors.mobile && <p className="form-error-p-tag">{formik.errors.mobile}</p>}
              <div className="flex items-center py-2 px-3 rounded-2xl mb-2">
                <FaKey className="text-gray-400" />
                <input
                  className={formik.touched.password && formik.errors.password ? "pl-2 outline-none border-b border-red-400 w-full" : "pl-2 outline-none border-b w-full"}
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="password"
                  placeholder="Enter the Password"
                />
              </div>
              {formik.touched.password && formik.errors.password && <p className="form-error-p-tag">{formik.errors.password}</p>}
              <div className="flex items-center py-2 px-3 rounded-2xl mb-2">
                <FaKey className="text-gray-400" />
                <input
                  className={formik.touched.re_password && formik.errors.re_password ? "pl-2 outline-none border-b border-red-400 w-full" : "pl-2 outline-none border-b w-full"}
                  type="password"
                  name="re_password"
                  value={formik.values.re_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="re_password"
                  placeholder="Retype-Password"
                />
              </div>
              {formik.touched.re_password && formik.errors.re_password && <p className="form-error-p-tag">{formik.errors.re_password}</p>}
              <div className="flex items-center py-2 px-3 rounded-2xl">
                <FaUsers className="text-gray-400" />
                <input
                  className={formik.touched.referred_code && formik.errors.referred_code ? "pl-2 outline-none border-b border-red-400 w-full" : "pl-2 outline-none border-b w-full"}
                  type="text"
                  name="referred_code"
                  value={formik.values.referred_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="referred_code"
                  placeholder="Referral Code"
                />
              </div>
              {formik.touched.referred_code && formik.errors.referred_code && <p className="form-error-p-tag">{formik.errors.referred_code}</p>}
              <button
                type="submit"
                className={`block w-full bg-black py-2 rounded-2xl text-white font-semibold mb-2 ${load ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-900"}`}
                disabled={load}
              >
                {load ? "Loading..." : "Register now"}
              </button>
              <div className="text-center">
                <span
                  onClick={() => navigate("/driver/login", { state: { status: "" } })}
                  className="text-sm ml-2 hover:text-blue-500 cursor-pointer"
                >
                  Already a member? Login here
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverSignupForm;