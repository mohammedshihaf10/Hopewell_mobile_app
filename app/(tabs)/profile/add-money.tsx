import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import RazorpayCheckout from "react-native-razorpay";

import { api } from "@/api/api";
import { useAppDispatch } from "@/store/hooks";
import { useInitiateTopupMutation } from "@/wallet/wallet.api";
import { IconSymbol } from "components/ui/icon-symbol";

export default function AddMoney() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState("500");
  const [paymentError, setPaymentError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failure" | null
  >(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [initiateTopup, { isLoading, error, data }] =
    useInitiateTopupMutation();

  const submitTopup = async () => {
    setPaymentError("");
    setValidationError("");
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 100 || value > 10000) {
      setValidationError("Amount must be between ₹100 and ₹10,000.");
      return;
    }
    try {
      const order = await initiateTopup({ amount: value }).unwrap();

      if (!order.order_id || !order.key) {
        setPaymentError("Failed to create order. Please try again.");
        return;
      }

      const userName =
        (await SecureStore.getItemAsync("user_name")) ?? "Vajra Volt";
      const userPhone = await SecureStore.getItemAsync("user_phone");

      if (!RazorpayCheckout?.open) {
        setPaymentError(
          "Razorpay native module not available. Use a dev build (Expo Go won't work).",
        );
        return;
      }

      RazorpayCheckout.open({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Vajra Volt",
        description: "Wallet top-up",
        order_id: order.order_id,
        prefill: {
          name: userName,
          contact: userPhone ?? "",
        },
        theme: { color: "#21B3A7" },
      })
        .then((result) => {
          setIsCheckoutOpen(false);
          dispatch(
            api.util.invalidateTags(["WalletBalance", "WalletTransactions"]),
          );
          setPaymentStatus("success");
        })
        .catch((err) => {
          setIsCheckoutOpen(false);
          console.log("Razorpay payment error:", err);
          setPaymentError(`Payment failed: ${err.description || err}`);
          setPaymentStatus("failure");
        });
      setIsCheckoutOpen(true);
    } catch (err) {
      setIsCheckoutOpen(false);
      setPaymentError(`Payment failed: ${err}`);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <IconSymbol name="arrow.left" size={18} color="#0F172A" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <Text style={styles.title}>Add money</Text>
      <Text style={styles.body}>Top up your wallet balance here.</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Amount (INR)</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="number-pad"
          style={styles.input}
        />
        <Text style={styles.hint}>Min ₹100, Max ₹10,000</Text>
      </View>

      {validationError ? (
        <Text style={styles.errorText}>{validationError}</Text>
      ) : null}
      {error ? (
        <Text style={styles.errorText}>
          {"data" in (error as { data?: { error?: string; message?: string } })
            ? ((error as { data?: { error?: string; message?: string } }).data
                ?.error ??
              (error as { data?: { error?: string; message?: string } }).data
                ?.message ??
              "Please check your connection and try again.")
            : "Please check your connection and try again."}
        </Text>
      ) : null}

      <Pressable
        style={styles.primaryButton}
        onPress={submitTopup}
        disabled={isLoading}
      >
        <Text style={styles.primaryText}>
          {isLoading ? "Creating..." : "Proceed to pay"}
        </Text>
      </Pressable>

      <Modal transparent visible={isCheckoutOpen} animationType="fade">
        <View style={styles.loadingBackdrop}>
          <View style={styles.loadingCard}>
            <Text style={styles.loadingTitle}>Opening payment</Text>
            <Text style={styles.loadingBody}>
              Please complete the payment in Razorpay.
            </Text>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={paymentStatus === "success"}
        animationType="fade"
        onRequestClose={() => setPaymentStatus(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setPaymentStatus(null)}
        >
          <Pressable style={styles.modalCard}>
            <Text style={styles.modalTitle}>Payment successful</Text>
            <Text style={styles.modalBody}>
              Your wallet will update shortly.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setPaymentStatus(null);
                router.replace("/profile/wallet");
              }}
            >
              <Text style={styles.modalButtonText}>Go to Wallet</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        transparent
        visible={paymentStatus === "failure"}
        animationType="fade"
        onRequestClose={() => setPaymentStatus(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setPaymentStatus(null)}
        >
          <Pressable style={styles.modalCard}>
            <Text style={styles.modalTitle}>Payment failed</Text>
            <Text style={styles.modalBody}>{paymentError}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setPaymentStatus(null)}
            >
              <Text style={styles.modalButtonText}>Try again</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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
    marginBottom: 16,
  },
  backText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2850",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  body: {
    fontSize: 14,
    color: "#6C7CA6",
    fontWeight: "600",
  },
  inputGroup: {
    marginTop: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A2850",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "rgba(40, 92, 153, 0.2)",
  },
  hint: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#8B97B2",
  },
  errorText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#C81D2C",
  },
  successText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#0F6A6A",
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: "#21B3A7",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#13233D",
  },
  modalBody: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#6C7CA6",
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: "#21B3A7",
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  loadingBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    padding: 20,
  },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#13233D",
  },
  loadingBody: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#6C7CA6",
  },
});
