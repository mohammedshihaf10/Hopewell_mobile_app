import { Tabs } from "expo-router";
import { Platform, View } from "react-native";

import { HapticTab } from "components/haptic-tab";
import { IconName } from "components/ui/icon-names";
import { IconSymbol } from "components/ui/icon-symbol";
import { Colors } from "constants/theme";
import { useColorScheme } from "hooks/use-color-scheme";

/* ---------------------------------------------
 * Static tab icon (no animation)
 * ------------------------------------------- */
function TabIcon({
  focused,
  color,
  name,
  size = 24,
}: {
  focused: boolean;
  color: string;
  name: IconName;
  size?: number;
}) {
  return (
    <View
      style={
        focused
          ? {
              width: 42,
              height: 42,
              borderRadius: 21,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: color,
            }
          : undefined
      }
    >
      <IconSymbol name={name} size={size} color={color} />
    </View>
  );
}

/* ---------------------------------------------
 * Floating QR primary action
 * ------------------------------------------- */
function QRFloatingButton({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: Platform.OS === "ios" ? 20 : 12,

        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 12,
      }}
    >
      <IconSymbol name="qrcode" size={28} color="#fff" />
    </View>
  );
}

/* ---------------------------------------------
 * Tabs layout (DEFAULT EXPORT)
 * ------------------------------------------- */
export default function TabLayout() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,

        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: "#8A8FAD",

        tabBarStyle: {
          position: "absolute",
          bottom: 24,
          left: 20,
          right: 20,
          height: 64,
          borderRadius: 32,
          backgroundColor: "rgba(20, 24, 40, 0.9)",
          borderTopWidth: 0,

          ...(Platform.OS === "ios"
            ? {
                shadowColor: "#000",
                shadowOpacity: 0.25,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 10 },
              }
            : {
                elevation: 20,
              }),
        },

        tabBarItemStyle: {
          marginVertical: 10,
        },
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} name="person.fill" />
          ),
        }}
      />

      <Tabs.Screen
        name="alerts"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} name="bell.fill" />
          ),
        }}
      />

      {/* ⭐ Primary QR button */}
      <Tabs.Screen
        name="qr"
        options={{
          tabBarIcon: () => <QRFloatingButton color={theme.tint} />,
        }}
      />

      <Tabs.Screen
        name="recent"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} name="clock.fill" />
          ),
        }}
      />

      <Tabs.Screen
        name="filters"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} name="bag.fill" />
          ),
        }}
      />
    </Tabs>
  );
}
