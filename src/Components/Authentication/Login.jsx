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
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateInputs = () => {
    setEmailError(!isValidEmail(email));
    setPasswordError(password.length < 8);
    return isValidEmail(email) && password.length >= 8;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.userId && data.email && data.accessToken && data.refreshToken) {
        await SecureStore.setItemAsync("accessToken", data.accessToken);
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);
        await AsyncStorage.setItem("userId", data.userId.toString());

        navigation.replace("SplashScreen");
      } else {
        Alert.alert("Error", data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "Login failed");
    }
  };

  return (
    <LinearGradient colors={["#0d0d1a", "#1a0033"]} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue your smart journey
          </Text>

          {/* Email */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, emailError && styles.errorInput]}
            keyboardType="email-address"
          />
          {emailError && (
            <Text style={styles.errorText}>Invalid email format</Text>
          )}

          {/* Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              style={[
                styles.input,
                styles.passwordInput,
                passwordError && styles.errorInput,
              ]}
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
          {passwordError && (
            <Text style={styles.errorText}>
              Password must be at least 8 characters
            </Text>
          )}

          {/* Login Button */}
          {/* <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <LinearGradient
              colors={["#8b3dff", "#ff3d9b"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={handleLogin} activeOpacity={0.9} style={styles.buttonWrapper}>
            <LinearGradient
              colors={["#8b3dff", "#ff3d9b"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* Signup Link */}
          <View style={styles.signupRow}>
            <Text style={styles.normalText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.link}> Sign up</Text>
            </TouchableOpacity>
          </View>

          {/* Social Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="google" size={22} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="facebook" size={22} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="apple" size={22} color="#fff" />
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
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formContainer: {
    backgroundColor: "rgba(13, 13, 26, 0.9)",
    padding: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: neonPurple,
    shadowColor: neonPink,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
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
  errorInput: {
    borderColor: "red",
    borderWidth: 1.5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 5,
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
    marginTop:30
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    gap: 20,
  },
  socialButton: {
    backgroundColor: "#1a1a2e",
    padding: 14,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: "#444",
    shadowColor: neonPurple,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default LoginScreen;
