import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const SplashScreen1 = () => {
  // const [imageUrl, setImageUrl] = useState(null);

  // useEffect(() => {
  //   const fetchSplashImage = async () => {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/splashscreens/splash-image`);
  //       const data = await response.json();

  //       if (data && data.image_url) {
  //         setImageUrl(data.image_url);
  //       } else {
  //         console.error("Invalid response format:", data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching splash image:", error);
  //     }
  //   };

  //   fetchSplashImage();
  // }, []);

  return (
    <LinearGradient
      colors={["#0d0d1a", "#3d0c61", "#8b3dff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
     
        <Animatable.Image
          animation="zoomIn"
          duration={1500}
          source={require("../../../assets/picnova.png")}
          style={styles.image}
        />
    

      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>
          Made With <FontAwesome name="heart" size={20} color="#ff3d9b" />
        </Text>
        <Text style={styles.bottomText}>By Basit Khokhar</Text>
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
    width: 140,
    height: 140,
    borderRadius: 10,
    resizeMode: "contain",
    shadowColor: "#8b3dff",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  bottomTextContainer: {
    position: "absolute",
    bottom: 70,
    alignItems: "center",
  },
  bottomText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "italic",
    textAlign: "center",
    textShadowColor: "#8b3dff",
    textShadowRadius: 8,
  },
});

export default SplashScreen1;
