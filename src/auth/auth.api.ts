import { api } from "@/api/api";
import * as SecureStore from "expo-secure-store";

type LogoutResponse = {
  message: string;
};

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation<LogoutResponse, void>({
      query: async () => {
        const refreshToken =
          (await SecureStore.getItemAsync("auth_refresh_token")) ?? "";

        return {
          url: "/auth/logout",
          method: "POST",
          body: { refresh_token: refreshToken },
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLogoutMutation } = authApi;
