import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { prepareHeadersWithAuth } from "./prepareHeadersAuth";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

export const api = createApi({
  reducerPath: "api",
  tagTypes: [],
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: prepareHeadersWithAuth,
  }),
  keepUnusedDataFor: 60 * 20,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
