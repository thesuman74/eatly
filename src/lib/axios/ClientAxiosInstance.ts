import axios from "axios";
import { getClientAccessToken } from "./custom/ClientAccesstoken";
import { handleError, handleResponse } from "./custom/PreparedResponse";

const BaseURL = process.env.NEXT_PUBLIC_BASEURL;

export const clientAxiosInstance = axios.create({
  baseURL: BaseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor for Dynamic Token Inclusion
clientAxiosInstance.interceptors.request.use(
  async (config) => {
    if (config.requiresAuth) {
      const accessToken = await getClientAccessToken();
      // console.log("accessToken from clientAxiosInstance", accessToken);

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        console.warn("No access token found for client-side request.");
      }
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

clientAxiosInstance.interceptors.response.use(handleResponse, handleError);
