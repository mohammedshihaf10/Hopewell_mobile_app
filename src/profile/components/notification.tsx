import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { IconName } from "components/ui/icon-names";
import { IconSymbol } from "components/ui/icon-symbol";

type NotificationItem = {
  id: string;
  title: string;
  time: string;
  icon: IconName;
  unread: boolean;
};

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title:
      "Your charging session has ended due to power fluctuation or current cut",
    time: "2025-11-27 03:17 PM",
    icon: "charger.fill",
    unread: true,
  },
  {
    id: "2",
    title: "Your charging session invoice paid successfully",
    time: "2025-11-27 03:17 PM",
    icon: "bell.fill",
    unread: true,
  },
  {
    id: "3",
    title: "Charging complete. Please unplug within 10 minutes.",
    time: "2025-11-26 06:04 PM",
    icon: "charger.fill",
    unread: false,
  },
  {
    id: "4",
    title: "Low battery alert. 15% remaining. Nearest station suggested.",
    time: "2025-11-26 02:40 PM",
    icon: "bell.fill",
    unread: false,
  },
];

export default function Notification() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(NOTIFICATIONS);

  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={styles.glowTop} />
      <View pointerEvents="none" style={styles.glowBottom} />

      <View style={styles.headerRow}>
        <View>
          {/* <Text style={styles.header}>Notifications</Text> */}
          <Text style={styles.subheader}>Charging updates and payments</Text>
        </View>
        <Pressable
          onPress={() => setNotifications([])}
          disabled={notifications.length === 0}
        >
          <Text
            style={[
              styles.clearAll,
              notifications.length === 0 && styles.clearAllDisabled,
            ]}
          >
            Clear all
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <IconSymbol name={item.icon} size={28} color="#FFFFFF" />
            </View>

            <View style={styles.textBlock}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>

            {item.unread ? <View style={styles.unreadDot} /> : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FB",
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subheader: {
    fontSize: 14,
    color: "#60739A",
    marginTop: 6,
    marginBottom: 16,
  },
  clearAll: {
    fontSize: 13,
    fontWeight: "700",
    color: "#21B3A7",
  },
  clearAllDisabled: {
    color: "#A7B4CC",
  },
  list: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.12)",
    shadowColor: "#0B2A5E",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2EC6C9",
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    color: "#13233D",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  time: {
    color: "#5E6F8F",
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#21B3A7",
    marginLeft: 8,
  },
  glowTop: {
    position: "absolute",
    top: -120,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(73, 155, 255, 0.22)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -140,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(46, 198, 201, 0.18)",
  },
});
