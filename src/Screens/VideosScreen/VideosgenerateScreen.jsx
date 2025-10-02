// import React, { useState } from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from "react-native";
// import { Picker } from "@react-native-picker/picker"; // for dropdowns
// import { apiFetch } from "../../apiFetch";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Video } from "expo-av"; // to preview video
// import { useTheme } from "../../Context/ThemeContext";

// const VideoGenerateScreen = ({ route }) => {
//   const { feature, imageUri } = route.params;
//   console.log("feature detail in videogenearate",feature)
//   const { theme } = useTheme();

//   const [style, setStyle] = useState("None");
//   const [quality, setQuality] = useState("1080p");
//   const [duration, setDuration] = useState(5);
//   const [aspectRatio, setAspectRatio] = useState("16:9");
//   const [prompt, setPrompt] = useState(feature.description || "");
//   const [loading, setLoading] = useState(false);
//   const [videoUrl, setVideoUrl] = useState(null);

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const userId = await AsyncStorage.getItem("userId");

//       const res = await apiFetch(`/videos/generate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           modelUsed: feature.model_name,
//           imageUrl: imageUri,
//           prompt,
//         //   style,
//           quality,
//           duration,
//           aspect_ratio: aspectRatio,
//         }),
//       });

//       const data = await res.json();
//       setVideoUrl(data.videoUrl);
//     } catch (error) {
//       console.error("Video generation failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <Image source={{ uri: feature.image_url }} style={styles.previewImage} />

//       {/* Prompt */}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter prompt"
//         value={prompt}
//         onChangeText={setPrompt}
//       />

//       {/* Style Picker */}
//       <Picker selectedValue={style} onValueChange={(val) => setStyle(val)}>
//         <Picker.Item label="None" value="None" />
//         <Picker.Item label="Anime" value="Anime" />
//         <Picker.Item label="3D" value="3D" />
//         <Picker.Item label="Cartoon" value="Cartoon" />
//       </Picker>

//       {/* Quality Picker */}
//       <Picker selectedValue={quality} onValueChange={(val) => setQuality(val)}>
//         <Picker.Item label="720p" value="720p" />
//         <Picker.Item label="1080p" value="1080p" />
//         <Picker.Item label="4K" value="4K" />
//       </Picker>

//       {/* Duration Picker */}
//       <Picker selectedValue={duration} onValueChange={(val) => setDuration(val)}>
//         <Picker.Item label="5s" value={5} />
//         <Picker.Item label="10s" value={10} />
//         <Picker.Item label="15s" value={15} />
//       </Picker>

//       {/* Aspect Ratio Picker */}
//       <Picker selectedValue={aspectRatio} onValueChange={(val) => setAspectRatio(val)}>
//         <Picker.Item label="16:9" value="16:9" />
//         <Picker.Item label="9:16" value="9:16" />
//         <Picker.Item label="1:1" value="1:1" />
//       </Picker>

//       <TouchableOpacity style={styles.button} onPress={handleGenerate}>
//         <Text style={styles.buttonText}>Generate Video</Text>
//       </TouchableOpacity>

//       {loading && <ActivityIndicator size="large" color="#8b3dff" />}

//       {videoUrl && (
//         <Video
//           source={{ uri: videoUrl }}
//           useNativeControls
//           resizeMode="contain"
//           style={styles.videoPlayer}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   previewImage: { width: "100%", height: 200, borderRadius: 10, marginBottom: 12 },
//   input: { borderWidth: 1, padding: 8, marginBottom: 12, borderRadius: 8 },
//   button: {
//     backgroundColor: "#8b3dff",
//     padding: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 16,
//   },
//   buttonText: { color: "#fff", fontWeight: "bold" },
//   videoPlayer: { width: "100%", height: 300, marginTop: 20 },
// });

// export default VideoGenerateScreen;


import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { apiFetch } from "../../apiFetch";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../Context/ThemeContext";
import { ScrollView } from "react-native-gesture-handler";

// 🔥 Firebase
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase";

const VideoGenerateScreen = ({ route }) => {
  const { feature, imageUri: initialImage } = route.params || {};
  const { theme } = useTheme();

  const [style, setStyle] = useState("None");
  const [quality, setQuality] = useState("1080p");
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [motionMode, setMotionMode] = useState("normal");
  const [prompt, setPrompt] = useState(feature?.description || "");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [effect, setEffect] = useState(feature?.name === "Video1" ? "360° Microwave" : ""); // or load from DB if you store it
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const [selectedImage, setSelectedImage] = useState(initialImage || null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // ⬆️ Upload local image to Firebase -> return public URL
  const uploadImageToFirebase = async (localUri) => {
    const storage = getStorage(app);
    const filename = `video_inputs/${Date.now()}.jpg`;

    // Turn local file into a Blob
    const res = await fetch(localUri);
    const blob = await res.blob();

    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        // progress => optionally show progress
        () => {},
        reject,
        resolve
      );
    });

    const url = await getDownloadURL(uploadTask.snapshot.ref);
    return url;
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      Alert.alert("Select Image", "Please select an image first!");
      return;
    }

    setLoading(true);
    setVideoUrl(null);

    try {
      // 1) Upload to Firebase first
      const firebaseImageUrl = await uploadImageToFirebase(selectedImage);

      // 2) Send to backend (auth middleware will inject userId from token/session)
      const res = await apiFetch(`/videos/enhancevideos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelUsed: feature.model_name, // e.g., "pixverse/pixverse-v4"
          imageUrl: firebaseImageUrl,
          prompt,
          style,
          effect,
          quality,
          duration,
          motion_mode: motionMode,
          aspect_ratio: aspectRatio,
          negative_prompt: negativePrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate video");
      setVideoUrl(data.videoUrl);
    } catch (error) {
      console.error("Video generation failed:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Feature banner */}
        {!!feature?.image_url && <Image source={{ uri: feature.image_url }} style={styles.previewImage} />}

        {/* User image preview */}
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        ) : (
          <Text style={{ textAlign: "center", marginBottom: 12 }}>No image selected</Text>
        )}

        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          <Text style={styles.uploadText}>📷 Select Image</Text>
        </TouchableOpacity>

        {/* Prompt */}
        <TextInput
          style={styles.input}
          placeholder="Enter prompt"
          value={prompt}
          onChangeText={setPrompt}
        />

        {/* Negative Prompt */}
        <TextInput
          style={styles.input}
          placeholder="Negative prompt (optional)"
          value={negativePrompt}
          onChangeText={setNegativePrompt}
        />

        {/* Style */}
        <Picker selectedValue={style} onValueChange={setStyle}>
          <Picker.Item label="None" value="None" />
          <Picker.Item label="Anime" value="Anime" />
          <Picker.Item label="3D" value="3D" />
          <Picker.Item label="Cartoon" value="Cartoon" />
        </Picker>

        {/* (Optional) Effect — defaults to feature’s effect */}
        <TextInput
          style={styles.input}
          placeholder="Effect (e.g., 360° Microwave)"
          value={effect}
          onChangeText={setEffect}
        />

        {/* Quality */}
        <Picker selectedValue={quality} onValueChange={setQuality}>
          <Picker.Item label="720p" value="720p" />
          <Picker.Item label="1080p" value="1080p" />
          <Picker.Item label="4K" value="4K" />
        </Picker>

        {/* Duration */}
        <Picker selectedValue={duration} onValueChange={setDuration}>
          <Picker.Item label="5s" value={5} />
          <Picker.Item label="10s" value={10} />
          <Picker.Item label="15s" value={15} />
        </Picker>

        {/* Motion mode */}
        <Picker selectedValue={motionMode} onValueChange={setMotionMode}>
          <Picker.Item label="normal" value="normal" />
          <Picker.Item label="camera_pan" value="camera_pan" />
          <Picker.Item label="camera_zoom" value="camera_zoom" />
        </Picker>

        {/* Aspect Ratio */}
        <Picker selectedValue={aspectRatio} onValueChange={setAspectRatio}>
          <Picker.Item label="16:9" value="16:9" />
          <Picker.Item label="9:16" value="9:16" />
          <Picker.Item label="1:1" value="1:1" />
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleGenerate} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Generating..." : "Generate Video"}</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#8b3dff" />}

        {videoUrl && (
          <Video
            source={{ uri: videoUrl }}
            useNativeControls
            resizeMode="contain"
            style={styles.videoPlayer}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  previewImage: { width: "100%", height: 200, borderRadius: 10, marginBottom: 12 },
  input: { borderWidth: 1, padding: 8, marginBottom: 12, borderRadius: 8 },
  button: {
    backgroundColor: "#8b3dff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  videoPlayer: { width: "100%", height: 300, marginTop: 20 },
  uploadBtn: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  uploadText: { color: "#444", fontWeight: "600" },
});

export default VideoGenerateScreen;

