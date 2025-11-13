import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { colors } from "../../Themes/colors"; 

const SplashScreen = ({ navigation }) => {
  const fullText = "Welcome to PicNova-AI — Your AI Designer for Every Occasion";
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
      colors={colors.gradients.deepTech} 
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
        source={require("../../../assets/logoo.png")}
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
    backgroundColor: colors.primary, 
    opacity: 0.15,
    shadowColor: colors.accent, 
    shadowOpacity: 0.8,
    shadowRadius: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 28,
    marginBottom: 30,
    shadowOpacity: 0.8,
    shadowRadius: 25,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    textShadowColor: colors.primary, // ✅ subtle cyan glow on text
    textShadowRadius: 15,
    lineHeight: 34,
  },
  loadingText: {
    marginTop: 25,
    fontSize: 14,
    color: colors.mutedText,
    fontStyle: "italic",
    letterSpacing: 1,
  },
});

export default SplashScreen;
