import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
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
    }, 60);

    const timeout = setTimeout(() => {
      navigation.replace("Main");
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigation]);

  return (
    <LinearGradient
      colors={["#1a1a1a", "#1f1f1f",]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Pulsating Glow Circle */}
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        easing="ease-out"
        duration={2000}
        style={styles.glowCircle}
      />

      {/* App Logo */}
      <Animatable.Image
        animation="fadeInDown"
        duration={2000}
        source={require("../../../assets/logo.png")}
        style={styles.logo}
      />

      {/* Animated Welcome Text */}
      <Animatable.Text
        animation="fadeInUp"
        duration={1500}
        delay={800}
        style={styles.welcomeText}
      >
        {displayedText}
      </Animatable.Text>

      {/* Subtext / Loader */}
      <Animatable.Text
        animation="fadeIn"
        duration={1800}
        delay={2000}
        style={styles.loadingText}
      >
        Loading creativity...
      </Animatable.Text>
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
    paddingHorizontal: 25,
    overflow: "hidden",
  },
  glowCircle: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: neonPink,
    opacity: 0.15,
    shadowColor: neonPink,
    shadowOpacity: 0.8,
    shadowRadius: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 28,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: neonPink,
    shadowColor: neonPurple,
    shadowOpacity: 0.8,
    shadowRadius: 25,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: neonPurple,
    textShadowRadius: 15,
    lineHeight: 34,
  },
  loadingText: {
    marginTop: 25,
    fontSize: 14,
    color: "#b3b3b3",
    fontStyle: "italic",
    letterSpacing: 1,
  },
});

export default SplashScreen;
