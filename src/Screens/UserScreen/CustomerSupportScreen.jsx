import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../Context/ThemeContext";
import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const CustomerSupportScreen = () => {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: "#0D0D0D" }]}
      showsVerticalScrollIndicator={false}
    >
      {/* <Text style={styles.title}>💬 Customer Support</Text> */}

      <Text style={styles.description}>
        Need help? We’re available <Text style={styles.highlight}>24/7</Text> to
        assist you with any issue or question. Whether it’s account support,
        app issues, or feature guidance — our team is ready to help you.
      </Text>

      <View style={styles.supportSection}>
        {/* ✉️ Email Support */}
        <LinearGradient
          colors={["#8b3dff", "#ff3d9b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBox}
        >
          <View style={styles.infoBox}>
            <Text style={styles.heading}>📧  Email Support</Text>
            <Text style={styles.infoText}>1. basitsanitaryapp@gmail.com</Text>
            <Text style={styles.infoText}>2. support.cardifyai@gmail.com</Text>
          </View>
        </LinearGradient>

        {/* 📞 Phone Support */}
        <LinearGradient
          colors={["#ff3d9b", "#8b3dff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBox}
        >
          <View style={styles.infoBox}>
            <Text style={styles.heading}>📞  Phone Numbers</Text>
            <Text style={styles.infoText}>1. +92 306-0760549</Text>
            <Text style={styles.infoText}>2. +92 315-4949862</Text>
            <Text style={styles.infoText}>3. +92 306-0760549</Text>
          </View>
        </LinearGradient>

        {/* 🕒 Availability */}
        <LinearGradient
          colors={["#00FFFF", "#8b3dff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBox}
        >
          <View style={styles.infoBox}>
            <Text style={styles.heading}>🕒  Available Hours</Text>
            <Text style={styles.infoText}>Monday – Sunday</Text>
            <Text style={styles.infoText}>24 Hours Support</Text>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

export default CustomerSupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#ff3d9b",
    textAlign: "center",
    marginBottom: 18,
    textTransform: "uppercase",
    textShadowColor: "#8b3dff",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  description: {
    fontSize: 15,
    color: "#d4d4d4",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },
  highlight: {
    color: "#00FFFF",
    fontWeight: "700",
  },
  supportSection: {
    flexDirection: "column",
    gap: 20,
  },
  gradientBox: {
    borderRadius: 14,
    padding: 2,
    shadowColor: "#8b3dff",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  infoBox: {
    backgroundColor: "#141414",
    borderRadius: 12,
    padding: 18,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff3d9b",
    marginBottom: 8,
    textShadowColor: "rgba(255, 61, 155, 0.6)",
    textShadowRadius: 6,
  },
  infoText: {
    fontSize: 15,
    color: "#dcdcdc",
    marginTop: 4,
    letterSpacing: 0.3,
  },
});
