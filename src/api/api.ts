import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";

import { prepareHeadersWithAuth } from "./prepareHeadersAuth";
import { logout } from "@/features/auth/slice";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: prepareHeadersWithAuth,
});

const baseQueryWithAuthHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    try {
      await SecureStore.deleteItemAsync("auth_access_token");
      await SecureStore.deleteItemAsync("auth_refresh_token");
    } finally {
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["WalletBalance", "WalletTransactions"],
  baseQuery: baseQueryWithAuthHandling,
  keepUnusedDataFor: 60 * 20,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
