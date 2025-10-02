import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const SplashScreen5 = ({onNext, onGooglePress, onEmailPress }) => {
  return (
    <View style={styles.container}>
      {/* Logo at top */}
      <Image
        source={require("../assets/icon2.png")} // Replace with your logo path
        style={styles.logo}
      />

      {/* Heading */}
      <Text style={styles.heading}>Let’s Get Started</Text>

      {/* Continue with Google Button */}
      <TouchableOpacity style={styles.googleButton} onPress={onGooglePress}>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Continue with Email Button */}
      <TouchableOpacity style={styles.emailButton} onPress={onEmailPress}>
        <Text style={styles.emailButtonText}>Continue with Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 30,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#8b3dff",
    marginBottom: 40,
  },
  googleButton: {
    backgroundColor: "#db4437",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  googleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emailButton: {
    backgroundColor: "#8b3dff",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  emailButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SplashScreen5;
