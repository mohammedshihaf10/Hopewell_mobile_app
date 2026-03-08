import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { restoreSession } from "@/features/auth/slice";
import { store } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { Provider } from "react-redux";
import "../global.css";
import { useColorScheme } from "../hooks/use-color-scheme";

function SessionBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      const accessToken = await SecureStore.getItemAsync("auth_access_token");
      const refreshToken = await SecureStore.getItemAsync("auth_refresh_token");

      if (!isMounted) return;
      dispatch(restoreSession(Boolean(accessToken && refreshToken)));
    };

    bootstrapSession().catch(() => {
      if (!isMounted) return;
      dispatch(restoreSession(false));
    });

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <SessionBootstrap />
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: "Explore" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </Provider>
    </ThemeProvider>
  );
}
