import { api } from "@/api/api";

type MeResponse = {
  id: string;
  full_name: string;
  email: string | null;
  phone_number: string;
  auth_provider: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  status: string;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<MeResponse, void>({
      query: () => ({ url: "/me", method: "GET" }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetMeQuery } = profileApi;
