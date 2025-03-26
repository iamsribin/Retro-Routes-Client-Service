/* eslint-disable @typescript-eslint/no-explicit-any */
import "./singup.scss";
import { useFormik } from "formik";
import axiosUser from "../../../../services/axios/userAxios";
import { toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";

import {
  ChakraProvider,
  Input,
  InputGroup,
  InputLeftElement,
  PinInput,
  PinInputField,
  HStack,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  PhoneIcon,
  EmailIcon,
  LockIcon,
  AtSignIcon,
  SmallAddIcon,
} from "@chakra-ui/icons";

import { signupValidation } from "../../../../utils/validation";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function Signup() {
  const [counter, setCounter] = useState(30);
  const [otpPage, setOtpPage] = useState(false);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    
    if (otpPage && counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter, otpPage]);

  const [otp, setOtp] = useState<number>(0);

  useEffect(() => {
    setOtpPage(false);
  }, []);

  const initialValues = {
    name: "",
    email: "",
    mobile: "",
    password: "",
    re_password: "",
    referred_code: "", 
    userImage: null,
    otp: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: signupValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await signipHandle(values.email, values.mobile);
      } catch (error) {
        setSubmitting(false);
      }
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    setImageUrl: (url: string | null) => void
  ) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue(fieldName, file);
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    } else {
      setImageUrl(null);
      formik.setFieldValue(fieldName, null);
    }
  };

  const signupSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", formik.values.name);
      formData.append("email", formik.values.email);
      formData.append("mobile", formik.values.mobile);
      formData.append("password", formik.values.password);
      formData.append("re_password", formik.values.re_password);
      formData.append("referred_code", formik.values.referred_code); // Fixed typo
      formData.append("otp", otp.toString());
      
      if (formik.values.userImage) {
        formData.append("userImage", formik.values.userImage);
      }
      if (counter <= 0) {
        return toast.error("Time expired, tap to resend");
      }      

      const { data } = await axiosUser().post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.message === "Success") {
        toast.success("OTP verified successfully");
        toast.success("Account created successfully");
        navigate("/login");
      } else if (data.message === "Invalid OTP") {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const signipHandle = async (email: string, mobile: string) => {
    try {
      const { data } = await axiosUser().post("/checkUser", { email, mobile });
      console.log("data", data);
      if (data.message === "user already have an account !") {
        toast.info("User already registered. Please login to continue");
        navigate("/login");
      } else {
        toast.success("Please check your OTP");
        setOtpPage(true);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const resendOtp = async () => {
    try {
      const { data } = await axiosUser().post("/resendOtp", formik.values);
      if (data.message === "OTP resent successfully") {
        toast.success(data.message); // Fixed typo in data.mesaage
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  useEffect(() => {
    formik.setFieldValue("otp", otp);
  }, [otp]);

  const handleOtpChange = (index: number, newValue: string) => {
    const parsedValue = parseInt(newValue) || 0;
    const newOtp = [...otp.toString().padStart(6, "0")];
    newOtp[index] = parsedValue.toString();    
    setOtp(parseInt(newOtp.join("")) || 0);

  };

  return (
    <ChakraProvider>

      {/* Main Content */}
      <div className="registration-container h-screen bg-white  flex justify-center items-center">
        <div className="registration-container-second md:w-4/6 w-5/6 md:h-4/5 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
          <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 justify-around items-center mb-3 md:m-0">
            <div className="flex w-full justify-center pt-10 items-center">
              <h1 className="text-gradient font-bold text-4xl mx-7 md:mx-0 md:text-6xl user-signup-title md:mb-4">
                Signup and get a free first ride!
              </h1>
            </div>
            <div className="hidden md:flex md:items-center justify-center">
              {otpPage ? (
                <img
                  className="mt-2"
                  style={{ height: "330px", width: "auto" }}
                  src="/images/otp.jpg"
                  alt=""
                />
              ) : (
                <img
                  className="mt-2"
                  style={{ height: "330px", width: "auto" }}
                  src="/images/login.jpg"
                  alt=""
                />
              )}
            </div>
          </div>

          {otpPage ? (
            <div className="flex md:w-1/2 justify-center px-4 pb-10 md:py-10 items-center">
              <div className="user-otp-form md:w-10/12 px-9 py-10 bg-white drop-shadow-2xl">
                <form>
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    textAlign="center"
                    mb={5}
                    color="gray.800"
                  >
                    Enter the OTP sent to your email
                  </Text>

                  <HStack justify="center" mb={4}>
                    <PinInput size="sm" otp placeholder="">
                      {[...Array(6)].map((_, index) => (
                        <PinInputField
                          key={index}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                        />
                      ))}
                    </PinInput>
                  </HStack>

                  <Button
                    onClick={signupSubmit}
                    type="submit"
                    w="full"
                    colorScheme="blue"
                    mt={4}
                    mb={2}
                  >
                    Verify
                  </Button>

                  <Text textAlign="center" fontSize="sm" color="gray.500" mt={4}>
                    {counter > 0 ? (
                      `Resend OTP in 00:${counter}`
                    ) : (
                      <Text
                        as="span"
                        color="blue.800"
                        cursor="pointer"
                        onClick={() => {
                          setCounter(40);
                          setOtp(0);
                          resendOtp();
                        }}
                      >
                        Resend OTP
                      </Text>
                    )}
                  </Text>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex md:w-1/2 justify-center pb-10 md:py-10 items-center">
              <div className="user-signup-form md:w-8/12 px-9 py-8 bg-white drop-shadow-xl">
                <form onSubmit={formik.handleSubmit}>
                  <VStack spacing={2} align="stretch">
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <AtSignIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Full Name"
                        borderColor={
                          formik.touched.name && formik.errors.name
                            ? "red.400"
                            : "gray.200"
                        }
                      />
                    </InputGroup>
                    {formik.touched.name && formik.errors.name && (
                      <Text color="red.500" fontSize="xs">
                        {formik.errors.name}
                      </Text>
                    )}

                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <EmailIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Email Address"
                        borderColor={
                          formik.touched.email && formik.errors.email
                            ? "red.400"
                            : "gray.200"
                        }
                      />
                    </InputGroup>
                    {formik.touched.email && formik.errors.email && (
                      <Text color="red.500" fontSize="xs">
                        {formik.errors.email}
                      </Text>
                    )}

                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <PhoneIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="text"
                        name="mobile"
                        value={formik.values.mobile}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Mobile Number"
                        borderColor={
                          formik.touched.mobile && formik.errors.mobile
                            ? "red.400"
                            : "gray.200"
                        }
                      />
                    </InputGroup>
                    {formik.touched.mobile && formik.errors.mobile && (
                      <Text color="red.500" fontSize="xs">
                        {formik.errors.mobile}
                      </Text>
                    )}

                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <LockIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Password"
                        borderColor={
                          formik.touched.password && formik.errors.password
                            ? "red.400"
                            : "gray.200"
                        }
                      />
                    </InputGroup>
                    {formik.touched.password && formik.errors.password && (
                      <Text color="red.500" fontSize="xs">
                        {formik.errors.password}
                      </Text>
                    )}

                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <LockIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="password"
                        name="re_password"
                        value={formik.values.re_password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Confirm Password"
                        borderColor={
                          formik.touched.re_password && formik.errors.re_password
                            ? "red.400"
                            : "gray.200"
                        }
                      />
                    </InputGroup>
                    {formik.touched.re_password && formik.errors.re_password && (
                      <Text color="red.500" fontSize="xs">
                        {formik.errors.re_password}
                      </Text>
                    )}

                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <SmallAddIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="text"
                        name="referred_code"
                        value={formik.values.referred_code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Referral Code"
                        borderColor={
                          formik.touched.referred_code && formik.errors.referred_code
                            ? "red.400"
                            : "gray.200"
                        }
                      />
                    </InputGroup>
                    {formik.touched.referred_code && formik.errors.referred_code && (
                      <Text color="red.500" fontSize="xs">
                        {formik.errors.referred_code}
                      </Text>
                    )}

                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" fontWeight="bold" color="blue.800">
                        Upload Your Profile Image
                      </Text>
                      <Input
                        id="rcImage"
                        type="file"
                        name="rcImage"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "userImage", setUserImageUrl)}
                        variant="unstyled"
                        pt={1}
                      />
                      {formik.touched.userImage && formik.errors.userImage && (
                        <Text color="red.500" fontSize="xs">
                          {formik.errors.userImage}
                        </Text>
                      )}
                    </VStack>

                    <Button type="submit" w="full"  bg="black" color="white" _hover={{ color: "black",bg:"white" }} mt={3}>
                      Register Now
                    </Button>

                    <Text textAlign="center" fontSize="sm">
                      <Text
                        as="span"
                        color="black"
                        cursor="pointer"
                        onClick={() => navigate("/login")}
                      >
                        Already a member? Login here
                      </Text>
                    </Text>
                  </VStack>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </ChakraProvider>
  );
}

export default Signup;