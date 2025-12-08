import { AxiosError, AxiosResponse } from "axios";

interface ErrorResponse {
  non_field_errors?: string[];
  [key: string]: any; // Allow additional properties if needed
}

export const handleResponse = (response: AxiosResponse) => {
  return response; // Return the response as-is
};

export const handleError = (error: AxiosError<ErrorResponse>) => {
  const customError = {
    message: error.message || "An error occurred", // Default error message
    status: error.response?.status || "Unknown Status", // Safe optional chaining
    url: error.config?.url || "Unknown URL", // Safe optional chaining
    method: error.config?.method || "Unknown Method", // Safe optional chaining
    backendMessage: error.response?.data?.message || null, // Safely access non_field_errors
  };

  console.error("Enhanced Axios Error:", customError);

  // Optionally, propagate the custom error for further handling
  return Promise.reject(customError);
};
