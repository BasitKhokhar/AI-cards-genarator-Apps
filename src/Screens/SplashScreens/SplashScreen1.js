import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import tinycolor from "tinycolor2";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const SplashScreen1 = () => {

  return (
    <LinearGradient
      colors={["#8b3dff", "#ff3d9b"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
     
        <Animatable.Image
          animation="zoomIn"
          duration={1500}
          source={require("../../../assets/logo.png")}
          style={styles.image}
        />
    

     <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>Made With <FontAwesome name="heart" size={24} color="red" /></Text>
        <Text style={styles.bottomText}>By Basit khokhar</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: "contain",
    shadowColor: "#8b3dff",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  // bottomTextContainer: {
  //   position: "absolute",
  //   bottom: 70,
  //   alignItems: "center",
  // },
  // bottomText: {
  //   color: "white",
  //   fontSize: 18,
  //   fontWeight: "600",
  //   fontStyle: "italic",
  //   textAlign: "center",
  //   textShadowColor: "#8b3dff",
  //   textShadowRadius: 8,
  // },
bottomTextContainer: {
    position: "absolute",
    bottom: 80,
  },
  bottomText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: "center",
     textShadowColor: "rgba(0,0,0,0.6)",
          textShadowOffset: { width: 2, height: 2 }, borderTopColor: "rgba(0,0,0,0.3)",
          textShadowRadius: 4,
  },
});


export default SplashScreen1;
