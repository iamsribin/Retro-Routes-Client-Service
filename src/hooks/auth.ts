/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ApplicationVerifier,
    Auth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
  } from "firebase/auth";
import {toast} from 'sonner' ;

export const onCaptchaVerify = (auth: Auth,setotpInput:any) => {
if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
        size: "invisible",
        callback: () => {
        toast.success("Otp sent successfully");
        setotpInput(true);
        },
        "expired-callback": () => {
        toast.error("TimeOut");
        },
    }
    );
}
};

export const sendOtp = async (setotpInput:any,auth:any,mobile:string,setConfirmationResult:any) => {
    try {
      onCaptchaVerify(auth,setotpInput);
      const number = "+91" + mobile;
      const appVerifier: ApplicationVerifier | undefined =
        window?.recaptchaVerifier;
      if (appVerifier !== undefined) {
        console.log("no")
        const result = await signInWithPhoneNumber(auth, number, appVerifier);
        setConfirmationResult(result);
      } else {
        throw new Error("RecaptchaVerifier is not defined.");
      }
    } catch (error) {
      console.log("error")
      toast.error((error as Error).message);
    }
  };