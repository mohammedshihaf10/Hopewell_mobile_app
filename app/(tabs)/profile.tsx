import { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { UrlTile } from "react-native-maps";

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);

  const [walletBalance] = useState(0);
  const [filters, setFilters] = useState({
    ac: false,
    dc: false,
    available: false,
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
      {/* ---------------- Map ---------------- */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={undefined} // IMPORTANT for OSM
        initialRegion={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: 6,
          longitudeDelta: 6,
        }}
      >
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
      </MapView>

      {/* ---------------- Top Overlay ---------------- */}
      <View style={styles.topOverlay} pointerEvents="box-none">
        {/* Search + Wallet */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <GooglePlacesAutocomplete
              placeholder="Search locations"
              fetchDetails
              onPress={(data, details) => {
                if (!details) return;

                const { lat, lng } = details.geometry.location;

                mapRef.current?.animateToRegion({
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                });
              }}
              query={{
                key: GOOGLE_MAPS_API_KEY,
                language: "en",
              }}
              styles={{
                container: { flex: 1 },
                textInput: styles.searchInput,
                listView: { zIndex: 20 },
              }}
            />
          </View>

          <TouchableOpacity style={styles.wallet}>
            <Text style={styles.walletText}>₹ {walletBalance}</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          <FilterChip
            label="AC"
            active={filters.ac}
            onPress={() => toggleFilter("ac")}
          />
          <FilterChip
            label="DC"
            active={filters.dc}
            onPress={() => toggleFilter("dc")}
          />
          <FilterChip
            label="Available"
            active={filters.available}
            onPress={() => toggleFilter("available")}
          />
        </View>
      </View>
    </View>
  );
}

/* ---------------- Filter Chip ---------------- */
function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },

  topOverlay: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  searchBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4,
    zIndex: 20,
  },

  searchInput: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
  },

  wallet: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  walletText: {
    color: "#fff",
    fontWeight: "600",
  },

  filters: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },

  chipActive: {
    backgroundColor: "#1E293B",
  },

  chipText: {
    fontSize: 13,
    color: "#111827",
  },

  chipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});
