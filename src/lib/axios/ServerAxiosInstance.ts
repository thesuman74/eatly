import axios from "axios";
import { getServerAccessToken } from "./custom/ServerAccessToken"; // Helper to get the server token
import { handleError, handleResponse } from "./custom/PreparedResponse";

const BaseURL = process.env.BASEURL || process.env.NEXT_PUBLIC_BASEURL;

// Create Axios instance for server-side
export const serverAxiosInstance = axios.create({
  baseURL: BaseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// // Request Interceptor for Token Inclusion
// serverAxiosInstance.interceptors.request.use(
//   async (config) => {
//     // Fetch the access token using server-side logic
//     const accessToken = await getServerAccessToken();
//     console.log("accessToken from serverAxiosInstance", accessToken);

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     } else {
//       console.warn("No access token found for server-side request.");
//     }

//     return config;
//   },
//   (error) => {
//     console.error("Request Interceptor Error (Server):", error);
//     return Promise.reject(error);
//   }
// );

// // Response and Error Interceptor
// serverAxiosInstance.interceptors.response.use(handleResponse, handleError);
