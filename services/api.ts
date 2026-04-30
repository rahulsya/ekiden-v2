import axios from "axios";
import { getSession } from "next-auth/react";

// Create an Axios instance for Strava API
export const stravaApi = axios.create({
  baseURL: "https://www.strava.com/api/v3",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the NextAuth access token
stravaApi.interceptors.request.use(
  async (config) => {
    // getSession works on the client-side
    if (typeof window !== "undefined") {
      const session = await getSession();
      // @ts-expect-error - accessToken is added to the session in the NextAuth callbacks
      const token = session?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
