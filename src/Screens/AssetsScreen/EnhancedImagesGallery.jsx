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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MasonryList from "@react-native-seoul/masonry-list";
import { apiFetch } from "../../apiFetch";

const EnhancedImageGallery = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [imagesWithSize, setImagesWithSize] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch gallery images from backend
  const fetchGallery = async () => {
    try {
      const res = await apiFetch(`/Model/gallery-images`, {}, navigation);
      if (res.ok) {
        const data = await res.json();

        // Get image width/height for Masonry layout
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
      Alert.alert("Downloaded", "Image saved to gallery.");
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
              aspectRatio, // ✅ Maintain real shape
              borderColor: isSelected ? "#8b3dff" : "#1e1e1e",
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

  const renderEmptyComponent = () => {
  if (loading) return null;
  return (
    <View style={{ flex: 1, height: "100%" }}>
      <View style={styles.mainemptycontainer}>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="image-multiple-outline"
            size={50}
            color="#666"
            style={{ marginBottom: 12 }}
          />
          <Text style={styles.emptyTitle}>No Images Yet</Text>
          <Text style={styles.emptySubtitle}>
            Your enhanced images will appear here once generated.
          </Text>
        </View>
      </View>
    </View>
  );
};

  return (
    <View style={styles.container}>
      {(loading || downloading) && (
        <ActivityIndicator
          size="large"
          color="#8b3dff"
          style={{ marginTop: 30 }}
        />
      )}

      <MasonryList
        data={imagesWithSize}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
};

export default EnhancedImageGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#0d0d0d",
    paddingBottom: 40,
  },
  imageWrapper: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
    margin: 5,
    flex: 1,
  },
  image: {
    borderRadius: 10,
    borderWidth: 2,
    width: "100%",
  },
  downloadIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 3,
  },
  // Empty State Styles
  mainemptycontainer: {
    flex: 1, paddingHorizontal: 10,
    flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 120,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    width: "80%",
  },
});
