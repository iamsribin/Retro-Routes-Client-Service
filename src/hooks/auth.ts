import {
  ApplicationVerifier,
  Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { toast } from "sonner";

export const onCaptchaVerify = (auth: Auth) => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "invisible",
      callback: (respose: any) => {
        console.log("recaptcha verified result:", respose);
      },
      "expired-callback": () => {
        toast.error("Verification Expired");
        window.recaptchaVerifier?.clear();
      },
      "error-callback": (error: any) => {
        console.error("Recaptcha Error:", error);
        toast.error("Verification failed");
      },
    }
  );
};

export const sendOtp = async (
  setotpInput: any,
  auth: any,
  mobile: string,
  setConfirmationResult: any
) => {
  try {
    const number = "+91" + mobile;

    onCaptchaVerify(auth);

    const appVerifier: ApplicationVerifier | undefined =
      window?.recaptchaVerifier;

    if (!appVerifier) {
      throw new Error("RecaptchaVerifier could not be created");
    }

    const result = await signInWithPhoneNumber(auth, number, appVerifier);
    setConfirmationResult(result);
    toast.success("OTP sent successfully");
    setotpInput(true)
  } catch (error) {
    console.error("OTP Send Error:", error);

    // More detailed error handling
    if (error instanceof Error) {
      switch (error.message) {
        case "auth/invalid-app-credential":
          toast.error(
            "Invalid app credentials. Please check your Firebase configuration."
          );
          break;
        case "auth/too-many-requests":
          toast.error("Too many requests. Please try again later.");
          break;
        default:
          toast.error(`OTP Send Failed: ${error.message}`);
      }
    } else {
      toast.error("An unexpected error occurred");
    }
  }
};
