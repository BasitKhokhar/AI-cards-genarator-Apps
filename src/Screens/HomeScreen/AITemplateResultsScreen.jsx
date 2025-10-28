// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   Share,
// } from "react-native";
// import * as MediaLibrary from "expo-media-library";
// import * as FileSystem from "expo-file-system";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { colors } from "../../Themes/colors";

// const sampleRelated = [
//   "https://images.unsplash.com/photo-1612832021426-1e4ef81e83a6",
//   "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7",
//   "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
//   "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
//   "https://images.unsplash.com/photo-1593642632559-0c7e8e7b0c1f",
//   "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
// ];

// export default function AITemplatesResultScreen({ route, navigation }) {
//   const { imageUrl, prompt, createdAt, resolution, aspectratio } = route.params;
//   const [downloading, setDownloading] = useState(false);

//   const handleDownload = async () => {
//     try {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission required", "Please allow gallery access to save image.");
//         return;
//       }

//       setDownloading(true);

//       const fileUri = FileSystem.cacheDirectory + `ai_image_${Date.now()}.jpg`;
//       const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

//       // Create asset and album (more reliable than saveToLibraryAsync)
//       const asset = await MediaLibrary.createAssetAsync(uri);
//       await MediaLibrary.createAlbumAsync("Download", asset, false);

//       Alert.alert("✅ Saved", "Image downloaded to your gallery!");
//     } catch (err) {
//       console.log("Download error:", err);
//       Alert.alert("❌ Error", "Failed to save image");
//     } finally {
//       setDownloading(false);
//     }
//   };


//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: `Check this AI-generated image!\n\nPrompt: ${prompt}\n${imageUrl}`,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Main Image */}
//       <Image source={{ uri: imageUrl }} style={styles.mainImage} />

//       {/* Action Buttons */}
//       <View style={styles.actionRow}>
//         <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
//           <Ionicons name="download-outline" size={22} color={colors.primary} />
//           <Text style={styles.actionText}>
//             {downloading ? "Saving..." : "Download"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
//           <Ionicons name="share-social-outline" size={22} color={colors.primary} />
//           <Text style={styles.actionText}>Share</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("Coming soon!")}>
//           <MaterialCommunityIcons name="image-search-outline" size={22} color={colors.primary} />
//           <Text style={styles.actionText}>Original</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Details Section */}
//       <View style={styles.detailsCard}>
//         <Text style={styles.heading}>Generation Details</Text>

//         <Text style={styles.label}>Prompt</Text>
//         <Text style={styles.value}>{prompt}</Text>

//         <Text style={styles.label}>Prompt</Text>
//         <Text style={styles.value}>{resolution}</Text>

//         <Text style={styles.label}>Prompt</Text>
//         <Text style={styles.value}>{aspectratio}</Text>

//         <Text style={styles.label}>Created</Text>
//         <Text style={styles.value}>{new Date(createdAt).toLocaleString()}</Text>

//         <Text style={styles.label}>Model</Text>
//         <Text style={styles.value}>Seedream 4.0 (mock)</Text>
//       </View>

//       {/* Related Images */}
//       <Text style={styles.subheading}>Related Templates</Text>
//       <View style={styles.relatedGrid}>
//         {sampleRelated.map((uri, i) => (
//           <Image key={i} source={{ uri }} style={styles.relatedImg} />
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bodybackground, padding: 12 },
//   mainImage: {
//     width: "100%",
//     height: 320,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: colors.cardsbackground,
//     borderRadius: 12,
//     paddingVertical: 10,
//     marginBottom: 20,
//   },
//   actionBtn: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   actionText: {
//     color: colors.text,
//     fontSize: 13,
//     marginTop: 4,
//   },
//   detailsCard: {
//     backgroundColor: colors.cardsbackground,
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 20,
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: colors.text,
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 14,
//     color: colors.text,
//     marginTop: 8,
//   },
//   value: {
//     fontSize: 15,
//     color: colors.mutedText,
//   },
//   subheading: {
//     fontSize: 17,
//     fontWeight: "600",
//     color: colors.text,
//     marginBottom: 10,
//   },
//   relatedGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   relatedImg: {
//     width: "48%",
//     height: 130,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
// });

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { apiFetch } from "../../apiFetch";
import { colors } from "../../Themes/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2; // perfect spacing for 2 columns

export default function AITemplatesResultScreen({ route, navigation }) {
  const { imageUrl, prompt, createdAt, resolution, aspectratio, templateId } =
    route.params;

  const [downloading, setDownloading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // =======================
  // 📥 Download Handler
  // =======================
  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please allow gallery access to save image.");
        return;
      }

      setDownloading(true);
      const fileUri = FileSystem.cacheDirectory + `ai_image_${Date.now()}.jpg`;
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);

      Alert.alert("✅ Saved", "Image downloaded to your gallery!");
    } catch (err) {
      console.log("Download error:", err);
      Alert.alert("❌ Error", "Failed to save image");
    } finally {
      setDownloading(false);
    }
  };

  // =======================
  // 🔗 Share Handler
  // =======================
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check this AI-generated image!\n\nPrompt: ${prompt}\n${imageUrl}`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // =======================
  // 📡 Fetch Related Templates
  // =======================
  const fetchRelated = useCallback(async () => {
  if (!templateId) return;
    console.log("id in fetch realted templates",templateId)
  try {
    console.log("🚀 Fetching related templates for:", templateId);
    setLoading(true);

    const res = await apiFetch(
      `/cards/templates/${templateId}/related?page=1&limit=8`,
      {},
      navigation
    );

    console.log("📡 Raw response from apiFetch:", res);

    // check if res.json exists or not
    let data;
    try {
      if (typeof res.json === "function") {
        data = await res.json();
        console.log("✅ Parsed via res.json()");
      } else {
        data = res;
        console.log("✅ Data came directly (apiFetch already parsed JSON)");
      }
    } catch (err) {
      console.log("⚠️ JSON parsing failed:", err);
    }

    console.log("📦 Final data:", data);

    if (!data?.templates) {
      console.log("⚠️ No templates found:", data);
      setTemplates([]);
      return;
    }

    const processed = await Promise.all(
      data.templates.map(
        (item) =>
          new Promise((resolve) => {
            const uri = item.imageUrl || "https://via.placeholder.com/300";
            Image.getSize(
              uri,
              (w, h) => {
                const aspectRatio = w / h || 1;
                const imgHeight = CARD_WIDTH / aspectRatio;
                resolve({ ...item, height: imgHeight });
              },
              () => resolve({ ...item, height: 180 })
            );
          })
      )
    );

    console.log("✅ Processed templates:", processed.length);
    setTemplates(processed);
  } catch (err) {
    console.log("❌ Error fetching related templates:", err);
  } finally {
    console.log("🧹 Setting loading false now");
    setLoading(false);
  }
}, [templateId, navigation]);

  useEffect(() => {
    fetchRelated();
  }, [fetchRelated]);

  // =======================
  // 🧱 Split into 2 Columns
  // =======================
  const formatColumns = (data) => {
    const left = [];
    const right = [];
    data.forEach((item, index) =>
      index % 2 === 0 ? left.push(item) : right.push(item)
    );
    return [left, right];
  };

  const [leftCol, rightCol] = formatColumns(templates);

  // =======================
  // 🧩 Render
  // =======================
  const renderCard = (item) => (
    <TouchableOpacity
      key={item.id}
      activeOpacity={0.9}
      style={[styles.card, { height: item.height }]}
      onPress={() => navigation.push("templatefeatures", { templateId: item.id })}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={[styles.image, { height: item.height }]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🖼️ Main Image */}
      <Image source={{ uri: imageUrl }} style={styles.mainImage} />

      {/* 🎯 Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
          <Ionicons name="download-outline" size={22} color={colors.primary} />
          <Text style={styles.actionText}>
            {downloading ? "Saving..." : "Download"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={22} color={colors.primary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert("Coming soon!")}
        >
          <MaterialCommunityIcons
            name="image-search-outline"
            size={22}
            color={colors.primary}
          />
          <Text style={styles.actionText}>Original</Text>
        </TouchableOpacity>
      </View>

      {/* 📄 Details Section */}
      <View style={styles.detailsCard}>
        <Text style={styles.heading}>Generation Details</Text>

        <Text style={styles.label}>Prompt</Text>
        <Text style={styles.value}>{prompt}</Text>

        <Text style={styles.label}>Resolution</Text>
        <Text style={styles.value}>{resolution}</Text>

        <Text style={styles.label}>Aspect Ratio</Text>
        <Text style={styles.value}>{aspectratio}</Text>

        <Text style={styles.label}>Created</Text>
        <Text style={styles.value}>{new Date(createdAt).toLocaleString()}</Text>

        <Text style={styles.label}>Model</Text>
        <Text style={styles.value}>Seedream 4.0 (mock)</Text>
      </View>

      {/* 🖼️ Related Templates */}
      <Text style={styles.subheading}>Related Templates</Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : templates.length > 0 ? (
        <View style={styles.masonryContainer}>
          <View style={styles.column}>{leftCol.map(renderCard)}</View>
          <View style={styles.column}>{rightCol.map(renderCard)}</View>
        </View>
      ) : (
        <Text style={{ color: colors.mutedText, textAlign: "center" }}>
          No related templates found.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bodybackground, padding: 12 },
  mainImage: {
    width: "100%",
    height: 320,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.cardsbackground,
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  actionBtn: { alignItems: "center", justifyContent: "center" },
  actionText: { color: colors.text, fontSize: 13, marginTop: 4 },
  detailsCard: {
    backgroundColor: colors.cardsbackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  heading: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 10 },
  label: { fontSize: 14, color: colors.text, marginTop: 8 },
  value: { fontSize: 15, color: colors.mutedText },
  subheading: { fontSize: 17, fontWeight: "600", color: colors.text, marginBottom: 10 },
  masonryContainer: { flexDirection: "row", justifyContent: "space-between" },
  column: { flex: 1 },
  card: { width: CARD_WIDTH, borderRadius: 10, marginBottom: 10, overflow: "hidden" },
  image: { width: "100%", borderRadius: 10 },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  title: { color: "#fff", fontSize: 12, fontWeight: "500" },
});
