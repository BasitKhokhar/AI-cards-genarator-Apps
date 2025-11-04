import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// import { useTheme } from "../../Context/ThemeContext";
import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
import { colors } from "../../Themes/colors";
const CustomerSupportScreen = () => {
  // const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bodybackground }]}
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
        <View style={styles.gradientBox}>
          <View style={styles.infoBox}>
            <Text style={styles.heading}>📧  Email Support</Text>
            <Text style={styles.infoText}>1. basitkhokhar957@gmail.com</Text>
            <Text style={styles.infoText}>2. coderzpark4949@gmail.com</Text>
            <Text style={styles.infoText}>2. support.cardifyai@gmail.com</Text>
          </View>
        </View>

        {/* 📞 Phone Support */}
        <View style={styles.gradientBox}>
          <View style={styles.infoBox}>
            <Text style={styles.heading}>📞  Phone Numbers</Text>
            <Text style={styles.infoText}>1. +92 306-0760549</Text>
            <Text style={styles.infoText}>2. +92 315-4949862</Text>
            <Text style={styles.infoText}>3. +92 306-0760549</Text>
          </View>
        </View>

        {/* 🕒 Availability */}
        <View style={styles.gradientBox}>
          <View style={styles.infoBox}>
            <Text style={styles.heading}>🕒  Available Hours</Text>
            <Text style={styles.infoText}>Monday – Sunday</Text>
            <Text style={styles.infoText}>24 Hours Support</Text>
          </View>
        </View>
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
  description: {
    fontSize: 15,
    color: colors.mutedText,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },
  highlight: {
    color:colors.primary,
    fontWeight: "700",
  },
  supportSection: {
    flexDirection: "column",
    gap: 20,
  },
  infoBox: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#4d4d4d",
    borderRadius: 12,
    padding: 15,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
   color: colors.text,
    marginBottom: 8,
    textShadowRadius: 6,
  },
  infoText: {
    fontSize: 15,
    color: colors.mutedText,
    marginTop: 4,
    letterSpacing: 0.3,
  },
});
