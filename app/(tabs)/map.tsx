import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { useGetWalletBalanceQuery } from "@/wallet/wallet.api";
import { IconSymbol } from "components/ui/icon-symbol";
import { WalletContent } from "./profile/wallet";

type Station = {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  openUntil: string;
  tags: string[];
  connectors: string;
  power: string;
  price: string;
  latitude: number;
  longitude: number;
};

const STATIONS: Record<"nearby" | "previous" | "favorites", Station[]> = {
  nearby: [
    {
      id: "1",
      name: "VoltWay - Valley Brook",
      address: "465 Valleybrook Rd, Midtown",
      distanceKm: 2.4,
      openUntil: "5:00 PM",
      tags: ["CCS2", "Public", "Fast"],
      connectors: "CCS2 · Type 2",
      power: "Up to 120 kW",
      price: "₹16.5 / kWh",
      latitude: 12.9716,
      longitude: 77.5946,
    },

    {
      id: "2",
      name: "South Hills ChargeHub",
      address: "301 S Hills Village, Bethel Park",
      distanceKm: 2.8,
      openUntil: "6:00 PM",
      tags: ["Type 2", "Public"],
      connectors: "Type 2 AC",
      power: "Up to 22 kW",
      price: "₹11.0 / kWh",
      latitude: 12.9784,
      longitude: 77.6068,
    },
    {
      id: "3",
      name: "VoltWay - Valley Brook",
      address: "465 Valleybrook Rd, Midtown",
      distanceKm: 2.4,
      openUntil: "5:00 PM",
      tags: ["CCS2", "Public", "Fast"],
      connectors: "CCS2 · Type 2",
      power: "Up to 120 kW",
      price: "₹16.5 / kWh",
      latitude: 12.9648,
      longitude: 77.5853,
    },
    {
      id: "4",
      name: "VoltWay - Valley Brook",
      address: "465 Valleybrook Rd, Midtown",
      distanceKm: 2.4,
      openUntil: "5:00 PM",
      tags: ["CCS2", "Public", "Fast"],
      connectors: "CCS2 · Type 2",
      power: "Up to 120 kW",
      price: "₹16.5 / kWh",
      latitude: 12.9861,
      longitude: 77.5733,
    },
  ],
  previous: [
    {
      id: "3",
      name: "Electra - Upper St. Clair",
      address: "201 S Hills Village, Pittsburgh",
      distanceKm: 2.9,
      openUntil: "8:00 PM",
      tags: ["CCS1", "Paid"],
      connectors: "CCS1",
      power: "Up to 60 kW",
      price: "₹14.0 / kWh",
      latitude: 12.9516,
      longitude: 77.6014,
    },
  ],
  favorites: [
    {
      id: "4",
      name: "McMurray EV Central",
      address: "450 McMurray Rd, McMurray",
      distanceKm: 3.6,
      openUntil: "9:00 PM",
      tags: ["Type 2", "Favorite"],
      connectors: "Type 2 · GB/T AC",
      power: "Up to 30 kW",
      price: "₹12.0 / kWh",
      latitude: 12.9932,
      longitude: 77.6198,
    },
  ],
};

export default function MapScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "nearby" | "previous" | "favorites"
  >("nearby");
  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    null,
  );
  const [likedStations, setLikedStations] = useState<string[]>(["4"]);
  const [infoStation, setInfoStation] = useState<Station | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [walletOpen, setWalletOpen] = useState(false);
  const { data: walletData, refetch: refetchWallet } =
    useGetWalletBalanceQuery();
  const stations = useMemo(() => STATIONS[activeTab], [activeTab]);
  const initialRegion = useMemo(
    () => ({
      latitude: 12.9716,
      longitude: 77.5946,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    }),
    [],
  );

  useFocusEffect(
    useCallback(() => {
      refetchWallet();
    }, [refetchWallet]),
  );

  const openDirections = useCallback((station: Station) => {
    const label = encodeURIComponent(station.name);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}&query=${label}`;

    Linking.openURL(url);
  }, []);

  const toggleLike = (id: string) => {
    setLikedStations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <View style={styles.container}>
      {/* ---------------- Map ---------------- */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation
        showsCompass={false}
        toolbarEnabled={false}
      >
        {stations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            title={station.name}
            description={station.address}
            pinColor={selectedStationId === station.id ? "#0F6A6A" : "#E0586A"}
            onPress={() => setSelectedStationId(station.id)}
          />
        ))}
      </MapView>

      {/* ---------------- Top Overlay ---------------- */}
      <View style={styles.topOverlay} pointerEvents="box-none">
        <View style={styles.headerRow}>
          <View style={styles.searchCard}>
            {isSearching ? (
              <View style={styles.searchInputWrap}>
                <IconSymbol name="search" size={16} color="#6C7CA6" />
                <TextInput
                  autoFocus
                  placeholder="Search locations"
                  placeholderTextColor="#8B97B2"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                />
              </View>
            ) : (
              <Pressable
                style={styles.searchPlaceholder}
                onPress={() => setIsSearching(true)}
              >
                <IconSymbol name="search" size={16} color="#6C7CA6" />
                <Text style={styles.searchPlaceholderText}>
                  Search locations
                </Text>
              </Pressable>
            )}
          </View>
          <Pressable
            style={styles.walletCard}
            onPress={() => setWalletOpen(true)}
          >
            <Text style={styles.walletText}>
              {(walletData?.currency ?? "INR") === "INR" ? "₹" : ""}
              {walletData?.balance ?? 0}
            </Text>
          </Pressable>
        </View>
        {isSearching ? (
          <Pressable
            onPress={() => {
              setIsSearching(false);
              setSearchQuery("");
            }}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.sheet}>
        <View style={styles.sheetTabs}>
          {(["nearby", "previous", "favorites"] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.sheetTab, activeTab === tab && styles.tabActive]}
            >
              <Text
                style={[
                  styles.sheetTabText,
                  activeTab === tab && styles.sheetTabTextActive,
                ]}
              >
                {tab === "nearby"
                  ? "Nearby"
                  : tab === "previous"
                    ? "Previous"
                    : "Favorites"}
              </Text>
              {activeTab === tab ? <View style={styles.tabLine} /> : null}
            </Pressable>
          ))}
        </View>

        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator
        >
          {stations.map((station) => {
            const isLiked = likedStations.includes(station.id);
            const isSelected = selectedStationId === station.id;
            return (
              <Pressable
                key={station.id}
                onPress={() => setSelectedStationId(station.id)}
                style={[
                  styles.stationCard,
                  isSelected && styles.stationCardSelected,
                ]}
              >
                <View style={styles.stationHeader}>
                  <Text style={styles.stationName}>{station.name}</Text>
                  <View style={styles.stationActions}>
                    <Pressable
                      onPress={() => toggleLike(station.id)}
                      style={styles.circleIcon}
                    >
                      <IconSymbol
                        name={isLiked ? "heart.fill" : "heart"}
                        size={14}
                        color={isLiked ? "#E0586A" : "#6C7CA6"}
                      />
                    </Pressable>
                    <Pressable
                      style={styles.circleIcon}
                      onPress={() => openDirections(station)}
                    >
                      <IconSymbol name="directions" size={14} color="#0F6A6A" />
                    </Pressable>
                    <Pressable
                      onPress={() => setInfoStation(station)}
                      style={styles.circleIcon}
                    >
                      <Text style={styles.circleText}>i</Text>
                    </Pressable>
                  </View>
                </View>
                <Text style={styles.stationAddress}>{station.address}</Text>
                <Text style={styles.stationMeta}>
                  {station.distanceKm} km · Open until {station.openUntil}
                </Text>
                <View style={styles.tagRow}>
                  {station.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <Modal
        visible={!!infoStation}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoStation(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setInfoStation(null)}
        >
          <Pressable style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {infoStation?.name ?? "Station"}
              </Text>
              <Pressable onPress={() => setInfoStation(null)}>
                <IconSymbol name="xmark" size={16} color="#1A2850" />
              </Pressable>
            </View>
            <Text style={styles.modalAddress}>{infoStation?.address}</Text>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Connectors</Text>
              <Text style={styles.modalValue}>{infoStation?.connectors}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Power</Text>
              <Text style={styles.modalValue}>{infoStation?.power}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Price</Text>
              <Text style={styles.modalValue}>{infoStation?.price}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Hours</Text>
              <Text style={styles.modalValue}>
                Open until {infoStation?.openUntil}
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={walletOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setWalletOpen(false)}
      >
        <View style={styles.walletModal}>
          <WalletContent
            onBack={() => setWalletOpen(false)}
            onAddMoney={() => router.push("/profile/add-money")}
            onTransactions={() => router.push("/profile/transactions")}
          />
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F6FB" },

  topOverlay: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.12)",
    shadowColor: "#0B2A5E",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  searchPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchPlaceholderText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#6C7CA6",
  },
  walletCard: {
    marginLeft: 12,
    backgroundColor: "#111827",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: "#0B2A5E",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  walletText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  searchInputWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#0F172A",
    paddingVertical: 0,
  },
  cancelButton: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
  cancelText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F6A6A",
  },
  filterButton: {
    position: "absolute",
    right: 20,
    top: 190,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.12)",
    shadowColor: "#0B2A5E",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  filterText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#1A2850",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.12)",
  },
  sheetTabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.1)",
  },
  sheetScroll: {
    maxHeight: 360,
  },
  sheetTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  sheetTabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7B8AB0",
  },
  sheetTabTextActive: {
    color: "#0F172A",
  },
  tabActive: {},
  tabLine: {
    marginTop: 8,
    width: "70%",
    height: 3,
    borderRadius: 999,
    backgroundColor: "#21B3A7",
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 140,
  },
  stationCard: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.12)",
  },
  stationCardSelected: {
    backgroundColor: "rgba(33, 179, 167, 0.08)",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  stationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stationName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#13233D",
  },
  stationActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  circleIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#C6D4EA",
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6C7CA6",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#13233D",
  },
  modalAddress: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#6C7CA6",
  },
  modalRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8B97B2",
  },
  modalValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A2850",
  },
  walletModal: {
    flex: 1,
    backgroundColor: "#F3F6FB",
  },
  stationAddress: {
    marginTop: 6,
    fontSize: 12,
    color: "#6C7CA6",
    fontWeight: "600",
  },
  stationMeta: {
    marginTop: 6,
    fontSize: 12,
    color: "#0F6A6A",
    fontWeight: "600",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#F1F6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#62739A",
  },
});
