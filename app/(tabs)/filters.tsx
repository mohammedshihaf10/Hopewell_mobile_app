import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Connector = {
  id: string;
  label: string;
};

type Dot = {
  x: number;
  y: number;
  r: number;
};

const ICON_SIZE = 34;

const CONNECTOR_LAYOUTS: Record<string, Dot[]> = {
  "gbt-ac": [
    { x: 0.5, y: 0.26, r: 0.07 },
    { x: 0.35, y: 0.42, r: 0.07 },
    { x: 0.65, y: 0.42, r: 0.07 },
    { x: 0.3, y: 0.64, r: 0.07 },
    { x: 0.7, y: 0.64, r: 0.07 },
    { x: 0.4, y: 0.78, r: 0.06 },
    { x: 0.6, y: 0.78, r: 0.06 },
  ],
  type1: [
    { x: 0.35, y: 0.32, r: 0.07 },
    { x: 0.65, y: 0.32, r: 0.07 },
    { x: 0.5, y: 0.5, r: 0.08 },
    { x: 0.35, y: 0.68, r: 0.06 },
    { x: 0.65, y: 0.68, r: 0.06 },
  ],
  type2: [
    { x: 0.5, y: 0.26, r: 0.07 },
    { x: 0.32, y: 0.38, r: 0.07 },
    { x: 0.68, y: 0.38, r: 0.07 },
    { x: 0.32, y: 0.6, r: 0.07 },
    { x: 0.68, y: 0.6, r: 0.07 },
    { x: 0.42, y: 0.78, r: 0.06 },
    { x: 0.58, y: 0.78, r: 0.06 },
  ],
  "3-pin": [
    { x: 0.5, y: 0.3, r: 0.08 },
    { x: 0.35, y: 0.62, r: 0.08 },
    { x: 0.65, y: 0.62, r: 0.08 },
  ],
  ccs1: [
    { x: 0.35, y: 0.3, r: 0.07 },
    { x: 0.65, y: 0.3, r: 0.07 },
    { x: 0.5, y: 0.5, r: 0.08 },
    { x: 0.35, y: 0.68, r: 0.06 },
    { x: 0.65, y: 0.68, r: 0.06 },
    { x: 0.36, y: 0.86, r: 0.1 },
    { x: 0.64, y: 0.86, r: 0.1 },
  ],
  ccs2: [
    { x: 0.5, y: 0.24, r: 0.07 },
    { x: 0.32, y: 0.36, r: 0.07 },
    { x: 0.68, y: 0.36, r: 0.07 },
    { x: 0.32, y: 0.56, r: 0.07 },
    { x: 0.68, y: 0.56, r: 0.07 },
    { x: 0.42, y: 0.72, r: 0.06 },
    { x: 0.58, y: 0.72, r: 0.06 },
    { x: 0.36, y: 0.88, r: 0.1 },
    { x: 0.64, y: 0.88, r: 0.1 },
  ],
  "gbt-dc": [
    { x: 0.5, y: 0.22, r: 0.07 },
    { x: 0.32, y: 0.38, r: 0.07 },
    { x: 0.68, y: 0.38, r: 0.07 },
    { x: 0.3, y: 0.58, r: 0.07 },
    { x: 0.7, y: 0.58, r: 0.07 },
    { x: 0.35, y: 0.82, r: 0.1 },
    { x: 0.65, y: 0.82, r: 0.1 },
  ],
  chademo: [
    { x: 0.32, y: 0.36, r: 0.08 },
    { x: 0.68, y: 0.36, r: 0.08 },
    { x: 0.32, y: 0.68, r: 0.08 },
    { x: 0.68, y: 0.68, r: 0.08 },
    { x: 0.5, y: 0.52, r: 0.07 },
  ],
  type6: [
    { x: 0.5, y: 0.28, r: 0.07 },
    { x: 0.3, y: 0.46, r: 0.07 },
    { x: 0.7, y: 0.46, r: 0.07 },
    { x: 0.4, y: 0.7, r: 0.07 },
    { x: 0.6, y: 0.7, r: 0.07 },
  ],
  ather: [
    { x: 0.35, y: 0.34, r: 0.07 },
    { x: 0.65, y: 0.34, r: 0.07 },
    { x: 0.5, y: 0.52, r: 0.07 },
    { x: 0.35, y: 0.7, r: 0.07 },
    { x: 0.65, y: 0.7, r: 0.07 },
  ],
};

const CONNECTORS: Connector[] = [
  { id: "gbt-ac", label: "GB/T AC" },
  { id: "type1", label: "Type 1" },
  { id: "type2", label: "Type 2" },
  { id: "3-pin", label: "3 Pin" },
  { id: "ccs1", label: "CCS1" },
  { id: "ccs2", label: "CCS2" },
  { id: "gbt-dc", label: "GB/T DC" },
  { id: "chademo", label: "CHAdeMO" },
  { id: "type6", label: "Type 6" },
  { id: "ather", label: "Ather" },
];

export default function Filters() {
  const [activeTab, setActiveTab] = useState<"my" | "other">("other");
  const [powerType, setPowerType] = useState<"all" | "ac" | "dc">("all");
  const [chargerType, setChargerType] = useState<
    "all" | "public" | "private"
  >("public");
  const [distanceKm, setDistanceKm] = useState(0);
  const [acRange, setAcRange] = useState(11);
  const [dcRange, setDcRange] = useState(60);
  const [selected, setSelected] = useState<string[]>([
    "type2",
    "ccs2",
    "gbt-dc",
  ]);

  const toggleConnector = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const acSteps = useMemo(() => [3.3, 7.4, 11, 22], []);
  const dcSteps = useMemo(() => [15, 30, 60], []);

  const renderConnectorIcon = (id: string, active: boolean) => {
    const dots = CONNECTOR_LAYOUTS[id] ?? [];
    const dotColor = active ? "#F2FFFC" : "#7B8AB0";
    const ringColor = active ? "#0F6A6A" : "#9FB0D1";
    const fillColor = active ? "#1BAFA6" : "#DDE6F6";

    return (
      <View
        style={[
          styles.connectorIcon,
          { borderColor: ringColor, backgroundColor: fillColor },
        ]}
      >
        {dots.map((dot, index) => {
          const size = ICON_SIZE * dot.r * 2;
          return (
            <View
              key={`${id}-${index}`}
              style={[
                styles.connectorDot,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  left: ICON_SIZE * dot.x - size / 2,
                  top: ICON_SIZE * dot.y - size / 2,
                  backgroundColor: dotColor,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filters</Text>
      </View>

      <View style={styles.segmented}>
        <Pressable
          onPress={() => setActiveTab("my")}
          style={[
            styles.segment,
            activeTab === "my" && styles.segmentActive,
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "my" && styles.segmentTextActive,
            ]}
          >
            My Vehicles
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("other")}
          style={[
            styles.segment,
            activeTab === "other" && styles.segmentActive,
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "other" && styles.segmentTextActive,
            ]}
          >
            Other Chargers
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sectionCard}>
          <View style={styles.chipRow}>
            {(["all", "ac", "dc"] as const).map((type) => (
              <Pressable
                key={type}
                onPress={() => setPowerType(type)}
                style={[
                  styles.chip,
                  powerType === type && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    powerType === type && styles.chipTextActive,
                  ]}
                >
                  {type.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.grid}>
            {CONNECTORS.map((connector) => {
              const isSelected = selected.includes(connector.id);
              return (
                <Pressable
                  key={connector.id}
                  onPress={() => toggleConnector(connector.id)}
                  style={[
                    styles.gridItem,
                    isSelected && styles.gridItemActive,
                  ]}
                >
                  {renderConnectorIcon(connector.id, isSelected)}
                  <Text
                    style={[
                      styles.gridLabel,
                      isSelected && styles.gridLabelActive,
                    ]}
                  >
                    {connector.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Charger Type</Text>
        <View style={styles.inlineOptions}>
          {(["all", "public", "private"] as const).map((type) => (
            <Pressable
              key={type}
              onPress={() => setChargerType(type)}
              style={styles.radioRow}
            >
              <View style={styles.radioOuter}>
                {chargerType === type ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={styles.radioLabel}>
                {type === "all"
                  ? "All Chargers"
                  : type === "public"
                  ? "Public Chargers"
                  : "Private Chargers"}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Distance from your place</Text>
        <View style={styles.sliderBlock}>
          <Text style={styles.sliderValue}>{distanceKm} km</Text>
          <View style={styles.track}>
            <View style={[styles.trackFill, { width: "8%" }]} />
            <View style={styles.thumb} />
          </View>
          <View style={styles.sliderSteps}>
            {[0, 5, 10, 20, 50].map((value) => (
              <Pressable
                key={value}
                onPress={() => setDistanceKm(value)}
              >
                <Text
                  style={[
                    styles.stepLabel,
                    distanceKm === value && styles.stepLabelActive,
                  ]}
                >
                  {value}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>AC Current range</Text>
        <View style={styles.sliderBlock}>
          <View style={styles.sliderSteps}>
            {acSteps.map((value) => (
              <Pressable key={value} onPress={() => setAcRange(value)}>
                <Text
                  style={[
                    styles.stepLabel,
                    acRange === value && styles.stepLabelActive,
                  ]}
                >
                  {value}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.track}>
            <View style={[styles.trackFill, { width: "62%" }]} />
            <View style={styles.thumb} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>DC Current range</Text>
        <View style={styles.sliderBlock}>
          <View style={styles.sliderSteps}>
            {dcSteps.map((value) => (
              <Pressable key={value} onPress={() => setDcRange(value)}>
                <Text
                  style={[
                    styles.stepLabel,
                    dcRange === value && styles.stepLabelActive,
                  ]}
                >
                  {value}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.track}>
            <View style={[styles.trackFill, { width: "88%" }]} />
            <View style={styles.thumb} />
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            onPress={() => {
              setPowerType("all");
              setChargerType("public");
              setDistanceKm(0);
              setAcRange(11);
              setDcRange(60);
              setSelected(["type2", "ccs2", "gbt-dc"]);
            }}
            style={styles.resetButton}
          >
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
          <Pressable style={styles.confirmButton}>
            <Text style={styles.confirmText}>Confirm</Text>
          </Pressable>
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
  header: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  segmented: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: "#E9EEF7",
    borderRadius: 14,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0B2A5E",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7B8AB0",
  },
  segmentTextActive: {
    color: "#0F172A",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.12)",
    shadowColor: "#0B2A5E",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  chipRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#EEF2FA",
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: "rgba(33, 179, 167, 0.15)",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6C7CA6",
  },
  chipTextActive: {
    color: "#0F6A6A",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "30%",
    backgroundColor: "#F2F5FB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  gridItemActive: {
    backgroundColor: "rgba(33, 179, 167, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(33, 179, 167, 0.4)",
  },
  connectorIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    borderWidth: 1.5,
    position: "relative",
  },
  connectorDot: {
    position: "absolute",
  },
  gridLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#6C7CA6",
    textAlign: "center",
  },
  gridLabelActive: {
    color: "#0F6A6A",
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "700",
    color: "#6C7CA6",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  inlineOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 10,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#21B3A7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#21B3A7",
  },
  radioLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A2850",
  },
  sliderBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.12)",
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A2850",
    textAlign: "center",
    marginBottom: 8,
  },
  track: {
    height: 6,
    backgroundColor: "#E4EAF5",
    borderRadius: 999,
    position: "relative",
    justifyContent: "center",
  },
  trackFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#2EC6C9",
  },
  thumb: {
    position: "absolute",
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#2EC6C9",
    top: -5,
  },
  sliderSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8B97B2",
  },
  stepLabelActive: {
    color: "#0F6A6A",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },
  resetButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(33, 179, 167, 0.4)",
    paddingVertical: 12,
    marginRight: 12,
    alignItems: "center",
  },
  resetText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F6A6A",
  },
  confirmButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#2EC6C9",
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
