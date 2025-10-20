import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../Themes/colors";

export default function JazzCashPaymentScreen({ route, navigation }) {
  const { gameTypeId } = route.params;
  const [token, setToken] = useState(null);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Load JWT token on mount
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync("jwt_token");
      if (!storedToken) {
        Alert.alert("Error", "User not logged in");
        navigation.goBack();
        return;
      }
      setToken(storedToken);
    };
    loadToken();
  }, []);

  // ✅ Handle payment logic
  const handlePayment = async () => {
    if (!amount || !phone) {
      Alert.alert("Validation", "Please enter amount and phone number");
      return;
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      Alert.alert("Validation", "Please enter a valid amount");
      return;
    }
    if (phone.length < 10) {
      Alert.alert("Validation", "Please enter a valid phone number");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("YOUR_BACKEND_API/jazzcash/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameTypeId, amount, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("✅ Success", "Payment initiated successfully!");
      } else {
        Alert.alert("❌ Error", data.message || "Payment failed");
      }
    } catch (error) {
      Alert.alert("⚠️ Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        // colors={colors.gradients.deepTech}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* <Text style={styles.heading}>JazzCash Payment</Text> */}

          <TextInput
            placeholder="Enter amount"
            placeholderTextColor={colors.mutedText}
            keyboardType="numeric"
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
          />

          <TextInput
            placeholder="Enter phone number"
            placeholderTextColor={colors.mutedText}
            keyboardType="phone-pad"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity
            style={[styles.payButton, loading && { opacity: 0.7 }]}
            onPress={handlePayment}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={colors.gradients.mintGlow}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.payButtonInner}
            >
              {loading ? (
                <ActivityIndicator color={colors.bodybackground} />
              ) : (
                <Text style={styles.payButtonText}>Pay Now</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bodybackground,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center", backgroundColor: colors.bodybackground,
  },
  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 40,
    textShadowColor: colors.accent,
    textShadowRadius: 12,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: colors.cardsbackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 22,
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  payButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  payButtonInner: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  payButtonText: {
    color: colors.bodybackground,
    fontSize: 20,
    fontWeight: "700",
    textShadowColor: "rgba(255,255,255,0.25)",
    textShadowRadius: 3,
  },
});
