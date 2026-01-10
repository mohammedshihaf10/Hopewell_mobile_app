import { Camera,CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function QRScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [chargerId, setChargerId] = useState("");

  /* ---------------- Permissions ---------------- */
useEffect(() => {
  const getPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  getPermissions();
}, []);


  /* ---------------- QR Scan ---------------- */
  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  /* ---------------- Upload QR Image ---------------- */
  const pickQRImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert(
        "QR uploaded",
        "Image selected. Decode via backend or QR SDK."
      );
    }
  };

  /* ---------------- Proceed ---------------- */
  const handleProceed = () => {
    if (!chargerId.trim()) {
      Alert.alert("Error", "Please scan or enter a charger ID");
      return;
    }

    // 👉 Call backend here
    console.log("Charger ID:", chargerId);

    Alert.alert("Success", `Charger ID: ${chargerId}`);
  };

  /* ---------------- States ---------------- */
  if (hasPermission === null) {
    return <Text>Requesting camera permission…</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* ---------------- Camera Scanner ---------------- */}
      <View style={styles.container}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {/* ---------------- Controls ---------------- */}
      <View style={styles.panel}>
        <Text style={styles.title}>Scan QR or Enter Charger ID</Text>

        <TextInput
          placeholder="Enter Charger ID manually"
          value={chargerId}
          onChangeText={setChargerId}
          style={styles.input}
        />

        <TouchableOpacity style={styles.secondaryBtn} onPress={pickQRImage}>
          <Text style={styles.secondaryText}>Upload QR Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleProceed}>
          <Text style={styles.primaryText}>Proceed</Text>
        </TouchableOpacity>

        {scanned && (
          <TouchableOpacity
            onPress={() => setScanned(false)}
            style={styles.rescan}
          >
            <Text style={styles.rescanText}>Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  scanner: {
    flex: 1.2,
  },

  panel: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  primaryBtn: {
    backgroundColor: "#1E293B",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#1E293B",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  secondaryText: {
    color: "#1E293B",
    fontWeight: "600",
  },

  rescan: {
    marginTop: 12,
    alignItems: "center",
  },

  rescanText: {
    color: "#2563EB",
    fontWeight: "500",
  },
});
