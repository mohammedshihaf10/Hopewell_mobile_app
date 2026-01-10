import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { IconSymbol } from "components/ui/icon-symbol";
import { ChargingSession, SESSIONS } from "./_session-data";

type RecentProps = {
  showHeader?: boolean;
  topPadding?: number;
  withContainer?: boolean;
};

export function RecentContent({
  showHeader = true,
  topPadding = 40,
  withContainer = true,
}: RecentProps) {
  const router = useRouter();
  const liveSession = useMemo(
    () => SESSIONS.find((session) => session.isLive),
    []
  );
  const pastSessions = useMemo(
    () => SESSIONS.filter((session) => !session.isLive),
    []
  );

  const openDetails = (sessionId: string) => {
    router.push({ pathname: "/recent/[id]", params: { id: sessionId } });
  };

  const renderSession = (item: ChargingSession) => (
    <Pressable onPress={() => openDetails(item.id)} style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.iconWrap}>
          <IconSymbol name="charger.fill" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardMeta}>
            {item.stationName} • {item.location}
          </Text>
          <View style={styles.cardFoot}>
            <Text style={styles.cardValue}>{item.energyKwh} kWh</Text>
            <Text style={styles.cardDot}>•</Text>
            <Text style={styles.cardValue}>${item.cost.toFixed(2)}</Text>
            <Text style={styles.cardDot}>•</Text>
            <Text style={styles.cardValue}>{item.durationMin} min</Text>
          </View>
        </View>
      </View>
      <Text style={styles.cardTime}>
        {item.startedAt}
        {item.endedAt ? ` - ${item.endedAt}` : ""}
      </Text>
    </Pressable>
  );

  const content = (
    <>
      {showHeader ? (
        <>
          <Text style={styles.header}>Charging Sessions</Text>
          <Text style={styles.subheader}>Live status and past activity</Text>
        </>
      ) : null}

      <FlatList
        data={pastSessions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          liveSession ? (
            <View style={styles.liveWrap}>
              <Text style={styles.sectionLabel}>Live now</Text>
              <Pressable
                onPress={() => openDetails(liveSession.id)}
                style={styles.liveCard}
              >
                <View style={styles.liveHeader}>
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveBadgeText}>Charging</Text>
                  </View>
                  <Text style={styles.liveTime}>{liveSession.startedAt}</Text>
                </View>
                <Text style={styles.liveTitle}>{liveSession.stationName}</Text>
                <Text style={styles.liveMeta}>{liveSession.location}</Text>
                <View style={styles.liveStats}>
                  <View>
                    <Text style={styles.statLabel}>Energy</Text>
                    <Text style={styles.statValue}>
                      {liveSession.energyKwh} kWh
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.statLabel}>Duration</Text>
                    <Text style={styles.statValue}>
                      {liveSession.durationMin} min
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.statLabel}>Battery</Text>
                    <Text style={styles.statValue}>
                      {liveSession.batteryStartPct}% →{" "}
                      {liveSession.batteryEndPct}%
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View style={styles.sectionFooter}>
            <Text style={styles.sectionLabel}>Previous sessions</Text>
          </View>
        }
        renderItem={({ item }) => renderSession(item)}
      />
    </>
  );

  if (!withContainer) {
    return content;
  }

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>{content}</View>
  );
}

export default function Recent() {
  return <RecentContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FB",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },
  subheader: {
    fontSize: 14,
    color: "#60739A",
    marginTop: 6,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6C7CA6",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  sectionFooter: {
    marginTop: 6,
    marginBottom: 10,
  },
  liveWrap: {
    marginBottom: 12,
  },
  liveCard: {
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
  liveHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(33, 179, 167, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#21B3A7",
    marginRight: 6,
  },
  liveBadgeText: {
    color: "#0F6A6A",
    fontSize: 12,
    fontWeight: "700",
  },
  liveTime: {
    fontSize: 12,
    color: "#6C7CA6",
    fontWeight: "600",
  },
  liveTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  liveMeta: {
    marginTop: 4,
    color: "#60739A",
    fontSize: 13,
    fontWeight: "600",
  },
  liveStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  statLabel: {
    fontSize: 11,
    color: "#8B97B2",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "#1A2850",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.12)",
    shadowColor: "#0B2A5E",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2EC6C9",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#13233D",
  },
  cardMeta: {
    marginTop: 4,
    fontSize: 12,
    color: "#6C7CA6",
    fontWeight: "600",
  },
  cardFoot: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  cardValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A2850",
  },
  cardDot: {
    marginHorizontal: 8,
    color: "#A1AEC8",
    fontWeight: "700",
  },
  cardTime: {
    marginTop: 12,
    color: "#5E6F8F",
    fontSize: 12,
    fontWeight: "600",
  },
});
