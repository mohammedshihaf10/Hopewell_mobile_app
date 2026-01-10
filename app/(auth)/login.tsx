import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { IconSymbol } from "components/ui/icon-symbol";

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <View style={styles.logoRing} />
        <View style={styles.logoDot} />
        <IconSymbol name="bolt.fill" size={44} color="#22B9C4" />
      </View>
      <Text style={styles.brand}>Vajra Volt</Text>
      <Text style={styles.tagline}>CHARGING</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/(tabs)/map")}
      >
        <Text style={styles.buttonText}>Get started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  logoWrap: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: "rgba(34, 185, 196, 0.35)",
  },
  logoDot: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#22B9C4",
    right: 16,
    top: 40,
  },
  brand: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },
  tagline: {
    marginTop: 6,
    letterSpacing: 4,
    fontSize: 11,
    fontWeight: "700",
    color: "#7B8AB0",
  },
  button: {
    marginTop: 36,
    backgroundColor: "#21B3A7",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 999,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 14,
  },
});
