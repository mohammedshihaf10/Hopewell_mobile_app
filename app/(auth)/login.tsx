import { loginSuccess } from "@/features/auth/slice";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogin = () => {
    // Implement login logic here
    console.log("Logging in...");
    dispatch(loginSuccess());
    router.push("/(tabs)/map");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
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
