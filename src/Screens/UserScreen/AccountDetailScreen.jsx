import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
import { useTheme } from "../../Context/ThemeContext";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const AccountDetailScreen = ({ route }) => {
  const { userData } = route.params;
  const { theme } = useTheme();

  const [name, setName] = useState(userData.name || "");
  const [email, setEmail] = useState(userData.email || "");
  const [phone, setPhone] = useState(userData.phone || "");

  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

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

  const uploadImageToFirebase = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const userId = await AsyncStorage.getItem("userId");
      const fileRef = ref(storage, `PicNovaProfileImages/${userId}.jpg`);

      await uploadBytes(fileRef, blob);
      const imageUrl = await getDownloadURL(fileRef);
      console.log("Image uploaded successfully:", imageUrl);
      saveImageUrlToDatabase(userId, imageUrl);
    } catch (error) {
      console.error("Image upload error:", error);
    }
    setUploading(false);
  };

  const saveImageUrlToDatabase = async (userId, imageUrl) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/upload-profile-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, image_url: imageUrl }),
      });

      const data = await response.json();
      console.log("Image upload response:", data);
      Alert.alert("Success", "Profile image uploaded successfully!");
    } catch (error) {
      console.error("Error saving image URL:", error);
    }
  };

  const updateUserDetails = async () => {
    setUpdating(true);
    try {
      const userId = await AsyncStorage.getItem("userId");

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });

      const result = await response.json();
      console.log("Update Response:", result);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating details:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
    setUpdating(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Account Detail</Text>
      <Text style={[styles.subtitle, { color: theme.mutedText }]}>
        You can view and update your details
      </Text>
      <View style={styles.data}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor={theme.mutedText}
          style={[styles.input, {
            borderColor: theme.border,
            backgroundColor: theme.featuresboxbg,
            color: theme.text,
          }]}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor={theme.mutedText}
          style={[styles.input, {
            borderColor: theme.border,
            backgroundColor: theme.featuresboxbg,
            color: theme.text,
          }]}
        />
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
          keyboardType="phone-pad"
          placeholderTextColor={theme.mutedText}
          style={[styles.input, {
            borderColor: theme.border,
            backgroundColor: theme.featuresboxbg,
            color: theme.text,
          }]}
        />

        <TouchableOpacity
          onPress={updateUserDetails}
          style={[styles.updateButton, { backgroundColor: theme.primary }]}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Update Details</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={pickImage}
          style={[styles.uploadButton, { backgroundColor: theme.accent }]}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Upload Profile Image</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  data: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  uploadButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  updateButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default AccountDetailScreen;
