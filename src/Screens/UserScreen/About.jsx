import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { apiFetch } from "../../apiFetch";
import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

export default function AboutApp() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`/content/about-App`);
        if (!res.ok) throw new Error("Failed to fetch About App");

        const data = await res.json();
        setAbout(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load app details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#ff3d9b" style={{ marginTop: 50 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : about ? (
        <View style={styles.textContainer}>
          {/* 🔮 Neon Gradient Title */}
        
          {/* 🌌 Content Box */}
          <View style={styles.contentBox}>
            <Text style={styles.content}>{about.content}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.error}>No data found.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  textContainer: {
    paddingBottom: 60,
  },
  gradientTitle: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: "center",
    marginBottom: 16,
    shadowColor: "#8b3dff",
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    color: "#fff",
    letterSpacing: 1,
    textTransform: "uppercase",
    textShadowColor: "#ff3d9b",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  contentBox: {
    // backgroundColor: "#141414",
    // borderRadius: 14,
    // padding: 16,
    // borderWidth: 1,
    // borderColor: "rgba(139,61,255,0.3)",
    // shadowColor: "#8b3dff",
    // shadowOpacity: 0.5,
    // shadowRadius: 10,
    // elevation: 5,
  },
  content: {
    fontSize: 15.5,
    color: "#dcdcdc",
    lineHeight: 25,
    textAlign: "justify",
    letterSpacing: 0.3,
  },
  error: {
    fontSize: 16,
    color: "#ff3d9b",
    marginTop: 30,
    textAlign: "center",
    textShadowColor: "#8b3dff",
    textShadowRadius: 8,
  },
});
