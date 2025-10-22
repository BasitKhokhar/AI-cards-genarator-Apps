

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../Themes/colors"; 
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const SplashScreen3 = ({ onNext }) => {
  return (
    <View style={styles.container}>
      {/* Top Image with gradient overlay */}
      <View style={styles.topContainer}>
        <ImageBackground
          source={require("../../../assets/splash22.jpg")}
          style={styles.image}
        >
          {/* Gradient Overlay at bottom */}
          <LinearGradient
            colors={["transparent", "rgba(13,13,26,0.8)", colors.bodybackground]}
            style={styles.overlay}
          >
            <Text style={styles.title}>Personalized with Your Touch</Text>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.description}>
          Add your own photos, text, and style to create truly one-of-a-kind cards.
        </Text>

        {/* Gradient Button */}
        <TouchableOpacity onPress={onNext} activeOpacity={0.9} style={styles.buttonWrapper}>
          <LinearGradient
            colors={colors.gradients.ocean} // uses colors file
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bodybackground,
    alignItems: "center",
  },
  topContainer: {
    width: "100%",
    height: "70%",
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  overlay: {
    width: "100%",
    padding: 20,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    textShadowColor: colors.primary,
    // textShadowOffset: { width: 0, height: 0 },
    // textShadowRadius: 10,
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: colors.mutedText,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 40,
    shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
});

export default SplashScreen3;
