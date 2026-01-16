import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { IconSymbol } from "components/ui/icon-symbol";
import { SESSIONS } from "src/data/charging-sessions";

export default function SessionDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = useMemo(
    () => SESSIONS.find((item) => item.id === id),
    [id]
  );

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Session not found</Text>
        <Pressable
          onPress={() => router.replace("/recent")}
          style={styles.backButton}
        >
          <IconSymbol name="chevron.right" size={18} color="#0F172A" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.replace("/recent")}
          style={styles.backButton}
        >
          <IconSymbol
            name="chevron.right"
            size={18}
            color="#0F172A"
            style={styles.backIcon}
          />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.topTitle}>Session details</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={styles.iconWrap}>
            <IconSymbol name="charger.fill" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>{session.stationName}</Text>
            <Text style={styles.summaryMeta}>{session.location}</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Status</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>
              {session.isLive ? "Charging" : "Completed"}
            </Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Started</Text>
          <Text style={styles.summaryValue}>{session.startedAt}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Ended</Text>
          <Text style={styles.summaryValue}>
            {session.endedAt ?? "Live session"}
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridCard}>
          <Text style={styles.gridLabel}>Energy</Text>
          <Text style={styles.gridValue}>{session.energyKwh} kWh</Text>
        </View>
        <View style={styles.gridCard}>
          <Text style={styles.gridLabel}>Duration</Text>
          <Text style={styles.gridValue}>{session.durationMin} min</Text>
        </View>
        <View style={styles.gridCard}>
          <Text style={styles.gridLabel}>Cost</Text>
          <Text style={styles.gridValue}>${session.cost.toFixed(2)}</Text>
        </View>
        <View style={styles.gridCard}>
          <Text style={styles.gridLabel}>Battery</Text>
          <Text style={styles.gridValue}>
            {session.batteryStartPct}% → {session.batteryEndPct ?? "--"}%
          </Text>
        </View>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Connector</Text>
        <Text style={styles.detailValue}>{session.connectorType}</Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Payment</Text>
        <Text style={styles.detailValue}>{session.paymentMethod}</Text>
      </View>
    </ScrollView>
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
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    transform: [{ rotate: "180deg" }],
  },
  backText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.12)",
    shadowColor: "#0B2A5E",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2EC6C9",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryText: {
    marginLeft: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#13233D",
  },
  summaryMeta: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#6C7CA6",
  },
  summaryRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6C7CA6",
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A2850",
  },
  statusPill: {
    backgroundColor: "rgba(33, 179, 167, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0F6A6A",
  },
  grid: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.12)",
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8B97B2",
    textTransform: "uppercase",
  },
  gridValue: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#1A2850",
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.12)",
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8B97B2",
    textTransform: "uppercase",
  },
  detailValue: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#1A2850",
  },
});
