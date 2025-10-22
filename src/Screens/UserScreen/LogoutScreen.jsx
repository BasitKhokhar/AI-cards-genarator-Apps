// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as SecureStore from "expo-secure-store";
// import { useNavigation } from "@react-navigation/native";

// const LogoutScreen = () => {
//   const navigation = useNavigation();

//   const handleLogout = async () => {
//     try {
//       // Remove user-related AsyncStorage data
//       await AsyncStorage.multiRemove(["userId", "email"]);

//       // Remove tokens from SecureStore
//       await SecureStore.deleteItemAsync("accessToken");
//       await SecureStore.deleteItemAsync("refreshToken");

//       // ✅ Reset navigation stack (no back navigation possible)
//       navigation.reset({
//         index: 0,
//         routes: [{ name: "Login" }],
//       });

//       Alert.alert("Success", "Logged out successfully!");
//     } catch (error) {
//       console.error("❌ Error during logout:", error);
//       Alert.alert("Error", "Logout failed. Please try again.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Logout</Text>
//       <Text style={styles.text}>Are you sure you want to logout?</Text>

//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//         <Text style={styles.logoutText}>Confirm Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     justifyContent: "center", 
//     alignItems: "center", 
//     backgroundColor: "#0A0A0A", // Deep black background
//     padding: 20,
//   },
//   title: {  
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#FF3366", // Neon pink
//     textShadowColor: "rgba(255, 51, 102, 0.9)",
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 15,
//     marginBottom: 10,
//   },
//   text: { 
//     fontSize: 18, 
//     color: "#E0E0E0", 
//     textAlign: "center",
//     marginBottom: 30,
//     textShadowColor: "rgba(255, 255, 255, 0.2)",
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 5,
//   },
//   logoutButton: { 
//     paddingVertical: 12,
//     paddingHorizontal: 35,
//     borderRadius: 10,
//     backgroundColor: "#1A1A1A",
//     borderWidth: 1,
//     borderColor: "#FF3366",
//     shadowColor: "#FF3366",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 15,
//     elevation: 8,
//   },
//   logoutText: { 
//     fontSize: 18, 
//     fontWeight: "bold",
//     color: "#FF3366",
//     textShadowColor: "rgba(255, 51, 102, 0.8)",
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
// });

// export default LogoutScreen;
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../Themes/colors";

const LogoutScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      // 🧹 Clear AsyncStorage data including ALL tour guide flags
      await AsyncStorage.multiRemove([
        "userId",
        "email",
        "hasSeenGuide",
        "hasSeenSearchHeaderTour", // ✅ Added this line
      ]);

      // 🧹 Clear tokens from SecureStore
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");

      console.log("✅ Cleared user data, tokens, and all tour flags");

      // ✅ Show modal confirmation
      setModalVisible(true);

      // Wait 1.5s before navigating to Login screen
      setTimeout(() => {
        setModalVisible(false);
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }, 1500);
    } catch (error) {
      console.error("❌ Logout error:", error);
      setModalVisible(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      <Text style={styles.text}>Are you sure you want to log out?</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Confirm Logout</Text>
      </TouchableOpacity>

      {/* 🟣 Success Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardsbackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Logged Out Successfully!
            </Text>
            <Text style={[styles.modalMessage, { color: colors.mutedText }]}>
              Redirecting to login screen...
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: colors.mutedText,
    textAlign: "center",
    marginBottom: 30,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
    backgroundColor: colors.cardsbackground,
    borderWidth: 1,
    borderColor: colors.text,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 8,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.error,
    textShadowColor: colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%", borderWidth: 1, borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
  },
});

