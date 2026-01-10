import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { IconSymbol } from "components/ui/icon-symbol";

export default function Wallet() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <IconSymbol name="arrow.left" size={18} color="#0F172A" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.title}>My Wallet</Text>

      <View style={styles.card}>
        <View style={styles.cardGlow} />
        <Text style={styles.cardLabel}>Current balance</Text>
        <Text style={styles.cardValue}>₹ 0.00</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/profile/add-money")}
        >
          <View style={styles.addIcon}>
            <IconSymbol name="plus" size={14} color="#D11D2E" />
          </View>
          <Text style={styles.addText}>Add money</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.transactionsRow}
        onPress={() => router.push("/profile/transactions")}
      >
        <Text style={styles.transactionsText}>View All Transactions</Text>
        <IconSymbol name="arrow.right" size={18} color="#1A2850" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FB",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2850",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#1E9FA3",
    borderRadius: 22,
    padding: 22,
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute",
    right: -80,
    top: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  cardLabel: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 14,
    fontWeight: "600",
  },
  cardValue: {
    marginTop: 10,
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  addButton: {
    marginTop: 20,
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  addIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(33, 179, 167, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  addText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A7F7C",
  },
  transactionsRow: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  transactionsText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A2850",
    marginRight: 6,
  },
});
