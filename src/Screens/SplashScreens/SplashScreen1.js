
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { colors } from "../../Themes/colors"; 
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const SplashScreen1 = () => {
  return (
    <View style={styles.container}>
      {/* Animated Logo */}
      <Animatable.Image
        animation="zoomIn"
        duration={1500}
        source={require("../../../assets/mainlogo.jpg")}
        style={styles.image}
      />

      {/* Bottom credits */}
      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>
          Made With <FontAwesome name="heart" size={20} color={colors.primary} />
        </Text>
        <Text style={[styles.bottomText, { fontSize: 18 }]}>By Basit Khokhar</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardsbackground, 
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.text,
  },
  bottomTextContainer: {
    position: "absolute",
    bottom: 70,
    alignItems: "center",
  },
  bottomText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "600",
    fontStyle: "italic",
    textAlign: "center",
    textShadowColor: colors.primary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
});

export default SplashScreen1;
