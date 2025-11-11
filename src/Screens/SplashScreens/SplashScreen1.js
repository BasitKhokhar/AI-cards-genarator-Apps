import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { colors } from "../../Themes/colors";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const SplashScreen1 = () => {
  return (
    <View style={styles.container}>
      {/* Animated Logo */}
      <Animatable.View
        animation="zoomIn"
        duration={1500}
        style={styles.imageWrapper}
      >
        <Image
          source={require("../../../assets/logoo.png")}
          style={styles.image}
        />
      </Animatable.View>

      {/* Bottom Credits */}
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
  imageWrapper: {
     width: 110,
    height: 110,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    overflow: "hidden", // ✅ ensures border hugs image perfectly
  },
  image: {
    width: 110,
    height: 110,
    resizeMode: "contain", // ✅ keeps image proportions clean
    backgroundColor: "transparent",
  },
  bottomTextContainer: {
    position: "absolute",
    bottom: 80,
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
