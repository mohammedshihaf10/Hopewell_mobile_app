 import { logout } from "@/features/auth/slice";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function Profile() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    // Implement your logout logic here
    dispatch(logout());
    router.replace("/(auth)/login");
    console.log("User logged out");
  }
  return (
    <>
     <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 20, fontWeight: "500" },
  button: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
