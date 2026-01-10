import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { IconSymbol } from "components/ui/icon-symbol";

type RowItem = {
  id: string;
  label: string;
  value?: string;
};

const PROFILE_ITEMS: RowItem[] = [
  { id: "personal", label: "Personal info" },
  { id: "wallet", label: "Wallet", value: "₹ 2,450" },
  { id: "charging-history", label: "Charging history" },
  { id: "payment-methods", label: "Payment methods" },
  { id: "privacy", label: "Privacy & data" },
  { id: "notifications", label: "Notifications" },
  { id: "help", label: "Help & support" },
  { id: "logout", label: "Log out" },
];

export default function Profile() {
  const router = useRouter();

  const openScreen = (id: string) => {
    if (id === "wallet") {
      router.push("/profile/wallet");
      return;
    }
    router.push(`/profile/${id}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="arrow.left" size={18} color="#0F172A" />
          </Pressable>
          <Text style={styles.headerTitle}>Account</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.identity}>
          <Text style={styles.name}>Saravanan Selvaraj</Text>
          <Text style={styles.email}>saravanan.hp@gmail.com</Text>
        </View>

        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.card}>
          {PROFILE_ITEMS.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => openScreen(item.id)}
              style={[
                styles.row,
                index === PROFILE_ITEMS.length - 1 && styles.rowLast,
              ]}
            >
              <Text style={styles.rowLabel}>{item.label}</Text>
              <View style={styles.rowRight}>
                {item.value ? (
                  <Text style={styles.rowValue}>{item.value}</Text>
                ) : null}
                <IconSymbol name="chevron.right" size={18} color="#9AA7BF" />
              </View>
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FB",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.12)",
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  identity: {
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#6C7CA6",
  },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.12)",
    shadowColor: "#0B2A5E",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.08)",
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#13233D",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8B97B2",
  },
});
