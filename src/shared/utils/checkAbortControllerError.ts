export const isAbortError = (error: any) =>
  error.name === "AbortError" || error.name === "CanceledError";