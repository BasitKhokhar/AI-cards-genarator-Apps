import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { apiFetch } from "../../apiFetch";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const AccountDetailScreen = ({ route, navigation }) => {
  const { userData } = route.params;

  const [name, setName] = useState(userData.name || "");
  const [email, setEmail] = useState(userData.email || "");
  const [phone, setPhone] = useState(userData.phone || "");
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // --- Image Picker ---
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImageToFirebase(result.assets[0].uri);
    }
  };

  // --- Upload to Firebase Storage ---
  const uploadImageToFirebase = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const userId = await AsyncStorage.getItem("userId");
      const fileRef = ref(storage, `CardifyProfileImages/${userId}.jpg`);

      await uploadBytes(fileRef, blob);
      const imageUrl = await getDownloadURL(fileRef);
      console.log("✅ Image uploaded successfully:", imageUrl);
      await saveImageUrlToDatabase(userId, imageUrl);
    } catch (error) {
      console.error("❌ Image upload error:", error);
      Alert.alert("Error", "Failed to upload image");
    }
    setUploading(false);
  };

  // --- Save image URL to backend ---
  const saveImageUrlToDatabase = async (userId, imageUrl) => {
    try {
      console.log('imageurl in api payload',imageUrl,userId)
      const response = await apiFetch(
        `/users/upload-profile-image`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, image_url: imageUrl }),
        },
        navigation
      );

      const data = await response.json();
      console.log("🖼️ Image upload response:", data);

      if (response.ok) {
        Alert.alert("Success", "Profile image uploaded successfully!");
      } else {
        Alert.alert("Error", data.message || "Failed to upload image.");
      }
    } catch (error) {
      console.error("❌ Error saving image URL:", error);
      Alert.alert("Error", "Something went wrong while saving image URL.");
    }
  };

  // --- Update user details ---
  const updateUserDetails = async () => {
    setUpdating(true);
    try {
      const userId = await AsyncStorage.getItem("userId");

      const response = await apiFetch(
        `/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone }),
        },
        navigation
      );

      const result = await response.json();
      console.log("📝 Update Response:", result);

      if (response.ok) {
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", result.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("❌ Error updating details:", error);
      Alert.alert("Error", "Something went wrong while updating profile.");
    }
    setUpdating(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* <Text style={styles.header}>Account Details</Text> */}
      <Text style={styles.subtitle}>
        Manage and update your CardiFy-AI profile
      </Text>

      <View style={styles.formCard}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
          keyboardType="phone-pad"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.button, { backgroundColor: "#8b3dff" }]}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Upload Profile Image</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={updateUserDetails}
          style={[styles.button, { backgroundColor: "#ff3d9b" }]}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Details</Text>
          )}
        </TouchableOpacity>


      </View>
    </ScrollView>
  );
};

export default AccountDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "900",
    color: "#ff3d9b",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 8,
    textShadowColor: "#8b3dff",
    textShadowRadius: 10,
  },
  subtitle: {
    color: "#d4d4d4",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: "#141414",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(139,61,255,0.3)",
    shadowColor: "#8b3dff",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(139,61,255,0.4)",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: "#fff",
    backgroundColor: "#1a1a1a",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
