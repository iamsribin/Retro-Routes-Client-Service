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

export const VehcleValidation=yup.object({
  registerationID: yup.string().required("Please enter the registeration ID").min(12, "Enter a valid ID"),
  model: yup.string().required("Choose the vehicle model"),
  carImage: yup.string().required("Upload the car image"),
  rcImage: yup.string().required("Upload the RC image"),
})

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
