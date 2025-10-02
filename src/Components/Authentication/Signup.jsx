import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Validation
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\d{11}$/.test(phone);

  const validateInputs = () => {
    if (!name || !email || !password || !phone || !city || !address) {
      Alert.alert("Error", "All fields are required!");
      return false;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Invalid email format!");
      return false;
    }
    if (!isValidPhone(phone)) {
      Alert.alert("Error", "Phone number must be 11 digits!");
      return false;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long!");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    try {
      const termsAccepted = await AsyncStorage.getItem("termsAccepted");
      const termsStatus = termsAccepted === "true";

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          city,
          address,
          termsStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Signup successful! Please log in.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message || "Signup failed");
      }
    } catch (error) {
      Alert.alert("Error", "Signup failed: " + error.message);
    }
  };

  return (
    <LinearGradient colors={["#0d0d1a", "#1a0033"]} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join us to start your smart journey
          </Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />

          {/* Password with eye toggle */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              style={[styles.input, styles.passwordInput]}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon
                name={passwordVisible ? "eye-slash" : "eye"}
                size={20}
                color="#ccc"
              />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Phone (11 digits)"
            placeholderTextColor="#aaa"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="City"
            placeholderTextColor="#aaa"
            value={city}
            onChangeText={setCity}
            style={styles.input}
          />
          <TextInput
            placeholder="Address"
            placeholderTextColor="#aaa"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />

          {/* Signup button */}
          <TouchableOpacity onPress={handleSignup} activeOpacity={0.9} style={styles.buttonWrapper}>
            <LinearGradient
              colors={["#8b3dff", "#ff3d9b"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Already have account */}
          <View style={styles.signupRow}>
            <Text style={styles.normalText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const neonPurple = "#8b3dff";
const neonPink = "#ff3d9b";

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formContainer: {
    backgroundColor: "rgba(13, 13, 26, 0.9)",
    padding: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: neonPurple,
    shadowColor: neonPink,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 12,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: neonPurple,
    textShadowRadius: 12,
    marginBottom: 5,
  },
  subtitle: {
    color: "#c9c9e8",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "#1a1a2e",
    color: "#fff",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    paddingRight: 45,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 20,
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 40,
    shadowColor: "#ff66c4",
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
    marginTop: 10,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  normalText: {
    color: "#ccc",
    fontSize: 14,
  },
  link: {
    color: neonPink,
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default SignupScreen;
