import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { store } from "@/store";
import { Provider } from "react-redux";
import "../global.css";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

function AuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated,
  );

  const inAuthGroup = segments[0] === "(auth)";

  useEffect(() => {
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)/map");
    }
  }, [inAuthGroup, isAuthenticated, router]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <AuthGuard />
        <Stack>
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false }}
          />
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
