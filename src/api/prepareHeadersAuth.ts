import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "auth_access_token";

export async function prepareHeadersWithAuth(headers: Headers) {
  try {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

    if (accessToken && accessToken.trim().length > 0) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  } catch (error) {
    // Optional: log to Sentry / console in dev
    if (__DEV__) {
      console.warn("Failed to read auth token", error);
    }
  }

  return headers;
}
