import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
// import { useTheme } from "../../context/ThemeContext";

const LogoutScreen = () => {
  // const { theme } = useTheme();
  const navigation = useNavigation();

  const handleLogout = async () => {
  try {
    // Remove user-related AsyncStorage data
    await AsyncStorage.multiRemove(["userId", "email"]);

    // Remove tokens from SecureStore
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");

    // ✅ Reset navigation stack (no back navigation possible)
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });

    Alert.alert("Success", "Logged out successfully!");
  } catch (error) {
    console.error("❌ Error during logout:", error);
    Alert.alert("Error", "Logout failed. Please try again.");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logout</Text>
      <Text style={styles.text}>
        Are you sure you want to logout?
      </Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Confirm Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#f5f5f5", 
    padding: 20 
  },
  title: {  
    color: "#DC143C",
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "rgba(80, 79, 79, 0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    borderTopColor: "rgba(0,0,0,0.3)",
  },
  text: { 
    fontSize: 18, 
    marginBottom: 20, 
    color: "#555" 
  },
  logoutButton: { 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    backgroundColor: "#ff4d4d", 
    borderRadius: 5 
  },
  logoutText: { 
    fontSize: 18, 
    color: "#fff", 
    fontWeight: "bold" 
  },
});

export default LogoutScreen;
