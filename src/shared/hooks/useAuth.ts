import {
  ApplicationVerifier,
  Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { toast } from "./use-toast";

export const onCaptchaVerify = (auth: Auth) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response: any) => {
          console.log("recaptcha verified result:", response);
        },
        "expired-callback": () => {
          toast({ description: "Verification Expired", variant: "error" });
          window.recaptchaVerifier = null;
        },
        "error-callback": (error: any) => {
          console.error("Recaptcha Error:", error);
          toast({ description: "Verification failed", variant: "error" });
        },
      }
    );
  }
};


export const sendOtp = async (
  setOtpInput: any,
  auth: any,
  mobile: string,
  setConfirmationResult: any,
  setOtpPage: any
) => {
  try {
    const number = "+91" + mobile;

    if (!window.recaptchaVerifier) {
      onCaptchaVerify(auth);
    }

    const appVerifier: ApplicationVerifier | undefined =
      window?.recaptchaVerifier;

    if (!appVerifier) {
      throw new Error("RecaptchaVerifier could not be created");
    }

    const result = await signInWithPhoneNumber(auth, number, appVerifier);
    setConfirmationResult(result);
    setOtpPage(true);
    toast({ description: "OTP Sent Successfully", variant: "success" });
    setOtpInput("");
  } catch (error) {
    console.error("OTP Send Error:", error);

    // More detailed error handling
    if (error instanceof Error) {
      switch (error.message) {
        case "auth/invalid-app-credential":
          toast({
            description:
              "Invalid app credentials. Please check your Firebase configuration.",
            variant: "error",
          });
          break;
        case "auth/too-many-requests":
          toast({ description:"Too many requests. Please try again later.", variant: "error" });
          break;
        default:
          toast({ description:`OTP Send Failed: ${error.message}`, variant: "error" });
      }
    } else {
      toast({ description:"An unexpected error occurred", variant: "error" });
    }
  }
};
