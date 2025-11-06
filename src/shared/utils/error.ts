import { toast } from "@/shared/hooks/use-toast";

type ThrownError = {
  status: number;
  message: string;
};

/**
 * Normalize and throw an error object that handleCustomError can consume.
 * This function always throws.
 */
export const throwCustomError = (err: any): never => {
  console.log("throwCustomError",err.response);
  
  if (err?.response) {
    const { status, data } = err.response;
    throw {
      status,
      message: data?.message || "An unexpected error occurred!",
    } as ThrownError;
  } else {
    throw {
      status: -1,
      message: err?.message || "An unexpected error occurred!",
    } as ThrownError;
  }
};

/**
 * Read an error (either an axios error or the thrown object above)
 * and call toast with title, description and variant.
 */
export const handleCustomError = (err: any) => {
  console.log("handleCustomError",err);

  // Try multiple places for status/message.
  const status: number =
    typeof err?.status === "number" ? 
    err.status : typeof err?.response?.status === "number" ? 
    err.response.status
      : -1;

  const message: string =
    err?.message ||
    err?.response?.data?.message ||
    (err?.response && JSON.stringify(err.response.data)) ||
    "An unexpected error occurred!";

  // map status to title + variant + fallback description
  let title = "Error ❌";
  let variant: "default" | "error" | "info" | "warning" | "success" | "destructive" =
    "error";
  const description = message;

  // if (isJwtExpired) {
  //   title = "Session expired";
  //   description = "Refresh the application!";
  //   variant = "info";
  // } else {
    switch (status) {
      case 400:
        title = "Bad request";
        variant = "error";
        break;
      case 401:
        title = "Unauthorized";
        variant = "error";
        break;
      case 404:
        title = "Not found";
        variant = "warning";
        break;
      case 409:
        title = "Conflict";
        variant = "warning";
        break;
      case 410:
        title = "Resource gone";
        variant = "info";
        break;
      case 500:
        title = "Server error";
        variant = "default";
        break;
      case 501:
      case 504:
        title = "Network or server issue";
        variant = "error";
        break;
      case 0:
        title = "Network error";
        variant = "info";
        break;
      case -1:
      default:
        title = "Something went wrong";
        variant = "error";
        break;
    }
  // }

  toast({
    title,
    description,
    variant,
  });
};
