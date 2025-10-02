import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../Context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const CustomerSupportScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Customer Support</Text>
      <Text style={[styles.text, { color: theme.text }]}>Get help and support anytime. Whether you have questions, need technical assistance, or require urgent help, our team is here for you 24/7. Reach out via chat, call, or email—we’re always ready to assist!</Text>
      <View style={styles.data}>
        <LinearGradient
          colors={['#8b3dff', '#a86bff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.containergradient}
        >
          <View style={styles.emailbox}>
            <Text style={styles.headings}>Email:</Text>
            <Text style={styles.headingtext}>1. basitsanitaryapp@gmail.com</Text>
            <Text style={styles.headingtext}>2. basitsanitaryapp@gmail.com</Text>
          </View>
        </LinearGradient>
        <LinearGradient
          colors={['#8b3dff', '#a86bff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.containergradient}
        >
          <View style={styles.emailbox}>
            <Text style={styles.headings}>Phone No:</Text>
            <Text style={styles.headingtext}>1. +92 306-0760549</Text>
            <Text style={styles.headingtext}>2. +92 315-4949862</Text>
            <Text style={styles.headingtext}>3. +92 306-0760549</Text>
          </View>
        </LinearGradient>


      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333", textAlign: 'center' },
  data: { display: 'flex', flexDirection: 'column', rowGap: 20 },
  text: { fontSize: 16, marginVertical: 5, color: "#555", textAlign: 'justify' },
  headings: { fontSize: 18, fontWeight: "bold", color: "white" },
  headingtext: { fontSize: 16, fontWeight: "400", color: "white" },
  containergradient: {
    alignItems: "flex-start",
    width: "100%",
    gap: 50,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10
  },
  emailbox: { display: 'flex', flexDirection: 'column', rowGap: 10 },
});

export default CustomerSupportScreen;
