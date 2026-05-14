import { stravaApi } from "./api";

// Strava API Service
export const stravaService = {
  getAthlete: async () => {
    const response = await stravaApi.get("/athlete");
    return response.data;
  },

  getActivities: async (params?: { page?: number; per_page?: number }) => {
    const response = await stravaApi.get("/athlete/activities", { params });
    return response.data;
  },

  getActivity: async (id: string | number) => {
    const response = await stravaApi.get(`/activities/${id}`);
    return response.data;
  },
  refreshToken: async (refreshToken: string) => {
    const response = await stravaApi.post(`/oauth/token`, {
      refresh_token: refreshToken,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      grant_type: "refresh_token",
    });
    return response.data;
  },
};
