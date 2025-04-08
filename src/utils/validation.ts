import * as yup from "yup";

export const signupValidation = yup.object({
  name: yup
    .string()
    .min(3, "Type a valid name")
    .required("Please enter a name"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  mobile: yup
    .string()
    .length(10, "Please enter a valid number")
    .required("Please enter an email"),
  password: yup
    .string()
    .matches(/^(?=.*[A-Z])/, "Must include One uppercase letter")
    .matches(/^(?=.*\d)/, "Must include one digit")
    .required("Passowrd is required"),
  re_password: yup
    .string()
    .oneOf([yup.ref("password")], "Password must match")
    .required("Please re-enter the password"),
  reffered_Code: yup
    .string()
    .min(5, "Enter a valid code")
    .matches(/^(?=.*\d)/, "Enter a valid code"),
});
export const DriverIdentificationValidation=yup.object().shape({
  aadharImage:yup.mixed().required('Please upload the adhaar image'),
  aadharID:yup.string().required("Enter the adhaar ID"),
  licenseImage:yup.string().required("Please upload the license image"),
  licenseID:yup.string().required("Enter the license ID"),
})

export const VehicleValidation = yup.object().shape({
  registerationID: yup.string()
    .matches(
      /^[A-Z]{2}\d{2}\s?[A-Z]{0,2}\s?\d{1,4}$/,
      "Invalid Indian RC format (e.g., MH04 AB 1234)"
    )
    .required("Registration ID is required"),
  model: yup.string().required("Vehicle model is required"),
  rcFrontImage: yup.mixed()
    .required("RC front image is required")
    .test("fileType", "Only image files are allowed", (value:any) => value && value.type.startsWith("image/"))
    .test("fileSize", "File size must be less than 5MB", (value:any) => value && value.size <= 5 * 1024 * 1024),
  rcBackImage: yup.mixed()
    .required("RC back image is required")
    .test("fileType", "Only image files are allowed", (value:any) => value && value.type.startsWith("image/"))
    .test("fileSize", "File size must be less than 5MB", (value:any) => value && value.size <= 5 * 1024 * 1024),
  carFrontImage: yup.mixed()
    .required("Vehicle front image is required")
    .test("fileType", "Only image files are allowed", (value:any) => value && value.type.startsWith("image/"))
    .test("fileSize", "File size must be less than 5MB", (value:any) => value && value.size <= 5 * 1024 * 1024),
  carSideImage: yup.mixed()
    .required("Vehicle side image is required")
    .test("fileType", "Only image files are allowed", (value:any) => value && value.type.startsWith("image/"))
    .test("fileSize", "File size must be less than 5MB", (value:any) => value && value.size <= 5 * 1024 * 1024),
  rcStartDate: yup.date()
    .max(new Date(), "RC start date cannot be in the future")
    .required("RC start date is required"),
  rcExpiryDate: yup.date()
    .min(new Date(), "RC expiry date must be in the future")
    .required("RC expiry date is required"),
});

export const SignupLocationValidation= yup.object({
  latitude: yup.number()
      .min(8.4, "Choose a valid location in India")
      .max(37.6, "Choose a valid location in India"),
  longitude: yup.number()
      .min(68.7, "Choose a valid location in India")
      .max(97.25, "Choose a valid location in India"),
})

// eslint-disable-next-line react-refresh/only-export-components
export const adminValidation= yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  password: yup
    .string()
    .matches(/^(?=.*[A-Z])/, "Must include One uppercase letter")
    .matches(/^(?=.*\d)/, "Must include one digit")
    .required("Passowrd is required"),
})


export const loginValidation = yup.object({
      mobile: yup
        .string()
        .length(10, "Enter a valid mobile number")
        .required("please enter the mobile number"),
    })

export const driverImageValidation = yup.object({
        driverImage:yup.mixed().required('Please upload your photo')
})

export const userBlockUnblockVaidation =  yup.object({
  reason: yup.string().required("Please provide a valid reason!").min(5, "Enter a valid reason"),
  status: yup.string().required("Please select the status"),
})