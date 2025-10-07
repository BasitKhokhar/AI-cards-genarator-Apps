
import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import { useTheme } from "../../Context/ThemeContext";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import MasonryList from "@react-native-seoul/masonry-list";
import { apiFetch } from "../../apiFetch"; 

const EnhancedImageGallery = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [imagesWithSize, setImagesWithSize] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch images from backend
  const fetchGallery = async () => {
    try {
      const res = await apiFetch(`/Model/gallery-images`, {}, navigation);
      if (res.ok) {
        const data = await res.json();

        // Get width/height for Masonry (Pinterest-like)
        const updatedData = await Promise.all(
          data.map(async (item) => {
            try {
              const size = await new Promise((resolve) => {
                Image.getSize(
                  item.url,
                  (width, height) => resolve({ width, height }),
                  () => resolve({ width: 1, height: 1 }) 
                );
              });
              return { ...item, ...size };
            } catch {
              return { ...item, width: 1, height: 1 };
            }
          })
        );

        setImagesWithSize(updatedData);
      } else {
        console.log("⚠️ Failed to fetch gallery", res.status);
      }
    } catch (err) {
      console.error("❌ Error fetching gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []); 

  const handleImagePress = (id) => {
    setSelectedImageId(id === selectedImageId ? null : id);
  };

  const handleDownload = async (url) => {
    try {
      setDownloading(true);
      const fileUri =
        FileSystem.documentDirectory + `enhanced_${Date.now()}.jpg`;
      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Downloaded", "Image saved to gallery");
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Could not download the image.");
    } finally {
      setDownloading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedImageId === item.id;
    const aspectRatio = item.width / item.height;

    return (
      <TouchableOpacity
        onPress={() => handleImagePress(item.id)}
        style={styles.imageWrapper}
      >
        <Image
          source={{ uri: item.url }}
          style={[
            styles.image,
            {
              aspectRatio, // ✅ Pinterest-like dynamic size
              borderColor: isSelected ? "#8b3dff" : "#ccc",
            },
          ]}
          resizeMode="cover"
        />
        {isSelected && (
          <TouchableOpacity
            style={styles.downloadIcon}
            onPress={() => handleDownload(item.url)}
          >
            <Ionicons name="arrow-down-circle" size={28} color="white" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Your Gallery</Text> */}

      {(loading || downloading) && (
        <ActivityIndicator size="large" color="#8b3dff" />
      )}

      <MasonryList
        data={imagesWithSize}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // ✅ Pinterest-like layout (try 2 or 3)
        renderItem={renderItem}
        ListEmptyComponent={
          !loading && (
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No enhanced images yet.
            </Text>
          )
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10,backgroundColor:'#0d0d0d',paddingBottom:40 },
  heading: {
    fontSize: 20,
    fontWeight: "bold",color:'white',
    marginVertical: 15,
    marginLeft: 15,
  },
  imageWrapper: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    margin: 5,
    flex: 1,
  },
  image: {
    borderRadius: 8,
    borderWidth: 2,
    width: "100%",
  },
  downloadIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 2,
  },
  emptyText: { textAlign: "center", fontSize: 16, marginTop: 20 },
});

export default EnhancedImageGallery;
