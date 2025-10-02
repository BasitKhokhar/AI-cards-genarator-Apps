import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

const SplashScreen = ({ navigation }) => {
  const fullText = "Welcome to CardiFy-AI — Your AI Designer for Every Occasion";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 80);

    const timeout = setTimeout(() => {
      navigation.replace("Main");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigation]);

  return (
    <LinearGradient colors={["#0d0d1a", "#1a0033"]} style={styles.container}>
      <Animatable.Text
        animation="fadeIn"
        duration={2000}
        style={styles.welcomeText}
      >
        {displayedText}
      </Animatable.Text>

      {/* Loader with neon color */}
      {/* <ActivityIndicator size="large" color="#ff3d9b" style={styles.loader} /> */}
    </LinearGradient>
  );
};

const neonPurple = "#8b3dff";
const neonPink = "#ff3d9b";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: neonPurple,
    textShadowRadius: 15,
  },
  loader: {
    marginTop: 30,
    shadowColor: neonPink,
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
});

export default SplashScreen;
