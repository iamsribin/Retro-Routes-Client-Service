// import FaMobileAlt from "@mui/icons-material/Smartphone";
// import FaUser from "@mui/icons-material/Person";
// import FaEnvelope from "@mui/icons-material/AlternateEmail";
// import FaKey from "@mui/icons-material/VpnKey";
// import FaUsers from "@mui/icons-material/Group";

import {
  FaMobileAlt,
  FaUser,
  FaEnvelope,
  FaKey,
  FaUsers,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ConfirmationResult } from "firebase/auth";
import DriverIdentificationPage from "../../../../pages/driver/authentication/DriverVehiclePage";
import { auth } from "../../../../services/firebase";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PinInput, PinInputField, HStack } from "@chakra-ui/react";
import axiosDriver from "../../../../services/axios/driverAxios";
import Loader from "../../../shimmer/Loader";
import { sendOtp } from "../../../../hooks/auth";

function DriverSignup() {
  const [counter, setCounter] = useState(40);
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [otpPage, setOtpPage] = useState(false);
  const [identificationPage, setIdentificationPage] = useState(true);

  useEffect(() => {
    if (otpPage) {
      counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }
  }, [counter, otpPage]);

  const [otp, setotpInput] = useState<number>(0);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  useEffect(() => {
    setOtpPage(false);
    setIdentificationPage(true);
  }, []);

  // Handle-OTP change
  const handleOtpChange = (index: number, newValue: number) => {
    const newOtp = [...otp.toString()];
    newOtp[index] = newValue.toString();
    setotpInput(parseInt(newOtp.join("")));
  };

  //Formik-Yup setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      re_password: "",
      reffered_Code: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Type a valid name")
        .required("Please enter a name"),
      email: Yup.string()
        .email("Please enter a valid email")
        .required("Please enter an email"),
      mobile: Yup.string()
        .length(10, "Please enter a valid number")
        .required("Please enter an email"),
      password: Yup.string()
        .matches(/^(?=.*[A-Z])/, "Must include One uppercase letter")
        .matches(/^(?=.*\d)/, "Must include one digit")
        .required("Passowrd is required"),
      re_password: Yup.string()
        .oneOf([Yup.ref("password")], "Password must match")
        .required("Please re-enter the password"),
      reffered_Code: Yup.string()
        .min(5, "Enter a valid code")
        .matches(/^(?=.*\d)/, "Enter a valid code"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setLoad(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        await signupHandle(values);
      } catch (error) {
        console.log("coming");

        toast.error((error as Error).message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // check-user API

  const signupHandle = async (formData: unknown) => {
    try {
      const { data } = await axiosDriver().post(`/checkDriver`, formData);
      if (data.message === "Driver login") {
        toast.error("Driver Already registered! Please Login to continue");
        navigate("/driver/login");
      } else if (data.message === "Driver must fill documents") {
        toast.info("Driver Already registered!\n Please verify the documents");
        console.log(data);
        localStorage.setItem("driverId", data.driverId);
        setIdentificationPage(true);
      } else {
        sendOtp(setotpInput, auth, formik.values.mobile, setConfirmationResult);
        setLoad(false); 
        setOtpPage(true);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  // OTP and Captcha-verification
  const otpVerify = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setLoad(true);
    event.preventDefault();
    if (otp && confirmationResult) {
      const otpValue: string = otp.toString();
      confirmationResult
        .confirm(otpValue)
        .then(async () => {
          registerSubmit();
        })
        .catch(() => {
          toast.error("Enter a valid otp");
        });
    } else {
      toast.error("Enter a valid otp");
    }
  };

  // signup-form submition API

  const registerSubmit = async () => {
    try {
      const response = await axiosDriver().post(
        `/registerDriver`,
        formik.values
      );
      if (response.data.message === "Success") {
        toast.success("OTP verified successfully");
        localStorage.setItem("driverId", response.data.driverId);
        setLoad(false);
        setIdentificationPage(true);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const iconsColor = "text-gray-400";
  const with_error_class = "pl-2 outline-none border-b border-red-400 w-full";
  const without_error_class = "pl-2 outline-none border-b w-full";
  return (
    <>
      {/* <nav className="bg-black text-white flex justify-between items-center p-6 ">
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gray-300">
            <img
              src="/images/images__1_-removebg-preview.png"
              alt="Logo"
              className=" w-[40%]"
            />
          </Link>
        </div>
      </nav> */}
      {identificationPage ? (
        <DriverIdentificationPage />
      ) : (
        <>
          <div className="bg-white driver-registration-container h-screen flex justify-center items-center">
            <div className="w-5/6 md:w-4/6 md:h-4/5  md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
              {otpPage ? (
                <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16  md:w-2/3 i justify-around items-center mb-3 md:m-0">
                  <div className=" w-full justify-center pt-10 items-center">
                    <h1 className="text-gradient font-bold text-4xl mx-7 md:mx-0  md:text-6xl user-otp-title">
                      don’t share your secret OTP!
                    </h1>
                    <h1 className="text-black font-normal text-sm mt-3 mx-7 md:mx-0  md:text-lg md:mt-3 user-signup-title">
                      Please enter the One-Time-Password sent to your registered
                      mobile number
                    </h1>
                  </div>
                  <div
                    className="hidden md:block"
                    style={{ marginTop: "-30px" }}
                  >
                    <img
                      style={{ height: "360px", width: "auto" }}
                      src="/images/otp.jpg"
                      alt=""
                    />
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 i justify-around items-center mb-3 md:m-0">
                  <div className="flex w-full justify-center pt-10 items-center">
                    <h1 className="text-gradient font-bold md:mb-8 text-4xl mx-7 md:mx-0  md:text-5xl driver-signup-title">
                      Unlock exciting benefits by registering as a driver!
                    </h1>
                  </div>
                  <div
                    className="hidden  md:flex md:items-center"
                    style={{ marginTop: "-40px" }}
                  >
                    {load ? (
                      <Loader />
                    ) : (
                      <img
                        style={{ height: "330px", width: "auto" }}
                        src="/images/login.jpg"
                        alt=""
                      />
                    )}
                  </div>
                </div>
              )}

              {otpPage ? (
                <div className="flex md:w-1/2 justify-center px-4  pb-10 md:py-10 items-center">
                  <div className="user-otp-form md:w-10/12 px-9 py-10  bg-white drop-shadow-2xl">
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
                              onChange={(e) =>
                                handleOtpChange(index, parseInt(e.target.value))
                              }
                            />
                          ))}
                        </PinInput>
                      </HStack>

                      <button
                        onClick={otpVerify}
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
                            onClick={(e) => {
                              e.preventDefault();
                              setCounter(40);
                              sendOtp(
                                setotpInput,
                                auth,
                                formik.values.mobile,
                                setConfirmationResult
                              );
                              setLoad(false);
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
                  <div className="driver-signup-form md:w-8/12 px-9 py-8  bg-white drop-shadow-xl">
                    <form onSubmit={formik.handleSubmit}>
                      <div className="flex items-center  py-2 px-3 rounded-2xl mb-2">
                        <FaUser className={iconsColor} />
                        <input
                          className={
                            formik.touched.name && formik.errors.name
                              ? with_error_class
                              : without_error_class
                          }
                          type="text"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="name"
                          placeholder="Full name"
                        />
                      </div>
                      {formik.touched.name && formik.errors.name && (
                        <p className="form-error-p-tag">{formik.errors.name}</p>
                      )}
                      <div className="flex items-center  py-2 px-3 rounded-2xl mb-2">
                        <FaEnvelope className={iconsColor} />
                        <input
                          className={
                            formik.touched.email && formik.errors.email
                              ? with_error_class
                              : without_error_class
                          }
                          type="text"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="email"
                          placeholder="Email Address"
                        />
                      </div>
                      {formik.touched.email && formik.errors.email && (
                        <p className="form-error-p-tag">
                          {formik.errors.email}
                        </p>
                      )}
                      <div className="flex items-center  py-2 px-3 rounded-2xl mb-2">
                        <FaMobileAlt className={iconsColor} />

                        <input
                          className={
                            formik.touched.mobile && formik.errors.mobile
                              ? with_error_class
                              : without_error_class
                          }
                          type="text"
                          name="mobile"
                          value={formik.values.mobile}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="mobile"
                          placeholder="Mobile number"
                        />
                      </div>
                      {formik.touched.mobile && formik.errors.mobile && (
                        <p className="form-error-p-tag">
                          {formik.errors.mobile}
                        </p>
                      )}
                      <div className="flex items-center  py-2 px-3 rounded-2xl mb-2">
                        <FaKey className={iconsColor} />
                        <input
                          className={
                            formik.touched.password && formik.errors.password
                              ? with_error_class
                              : without_error_class
                          }
                          type="password"
                          name="password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="password"
                          placeholder="Enter the Password"
                        />
                      </div>
                      {formik.touched.password && formik.errors.password && (
                        <p className="form-error-p-tag">
                          {formik.errors.password}
                        </p>
                      )}
                      <div className="flex items-center  py-2 px-3 rounded-2xl mb-2">
                        <FaKey className={iconsColor} />
                        <input
                          className={
                            formik.touched.re_password &&
                            formik.errors.re_password
                              ? with_error_class
                              : without_error_class
                          }
                          type="password"
                          name="re_password"
                          value={formik.values.re_password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="re_password"
                          placeholder="Retype-Password"
                        />
                      </div>
                      {formik.touched.re_password &&
                        formik.errors.re_password && (
                          <p className="form-error-p-tag">
                            {formik.errors.re_password}
                          </p>
                        )}
                      <div className="flex items-center  py-2 px-3 rounded-2xl">
                        <FaUsers className={iconsColor} />
                        <input
                          className={
                            formik.touched.reffered_Code &&
                            formik.errors.reffered_Code
                              ? with_error_class
                              : without_error_class
                          }
                          type="text"
                          name="reffered_code"
                          value={formik.values.reffered_Code}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="reffered_Code"
                          placeholder="Referral Code"
                        />
                      </div>
                      {formik.touched.reffered_Code &&
                        formik.errors.reffered_Code && (
                          <p className="form-error-p-tag">
                            {formik.errors.reffered_Code}
                          </p>
                        )}
                      <button
                        type="submit"
                        className={`block w-full bg-black py-2 rounded-2xl text-white font-semibold mb-2 ${
                          load
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-900"
                        }`}
                        disabled={load}
                      >
                        {load ? "Loading..." : "Register now"}
                      </button>

                      <div className="text-center">
                        <span
                          onClick={() => {
                            navigate("/Driver/login", {
                              state: { status: "" },
                            });
                          }}
                          className="text-sm ml-2 hover:text-blue-500 cursor-pointer"
                        >
                          Already a member? Login here
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div id="recaptcha-container"></div>
        </>
      )}
    </>
  );
}

export default DriverSignup;
