// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Text,
// } from "react-native";
// import { useTheme } from "../../Context/ThemeContext";
// import * as FileSystem from "expo-file-system";
// import * as MediaLibrary from "expo-media-library";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import MasonryList from "@react-native-seoul/masonry-list";
// import { apiFetch } from "../../apiFetch";

// const EnhancedImageGallery = ({ navigation }) => {
//   const { theme } = useTheme();
//   const [selectedImageId, setSelectedImageId] = useState(null);
//   const [downloading, setDownloading] = useState(false);
//   const [imagesWithSize, setImagesWithSize] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🔹 Fetch gallery images from backend
//   const fetchGallery = async () => {
//     try {
//       const res = await apiFetch(`/Model/gallery-images`, {}, navigation);
//       if (res.ok) {
//         const data = await res.json();

//         // Get image width/height for Masonry layout
//         const updatedData = await Promise.all(
//           data.map(async (item) => {
//             try {
//               const size = await new Promise((resolve) => {
//                 Image.getSize(
//                   item.url,
//                   (width, height) => resolve({ width, height }),
//                   () => resolve({ width: 1, height: 1 })
//                 );
//               });
//               return { ...item, ...size };
//             } catch {
//               return { ...item, width: 1, height: 1 };
//             }
//           })
//         );

//         setImagesWithSize(updatedData);
//       } else {
//         console.log("⚠️ Failed to fetch gallery", res.status);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching gallery:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGallery();
//   }, []);

//   const handleImagePress = (id) => {
//     setSelectedImageId(id === selectedImageId ? null : id);
//   };

//   const handleDownload = async (url) => {
//     try {
//       setDownloading(true);
//       const fileUri =
//         FileSystem.documentDirectory + `enhanced_${Date.now()}.jpg`;
//       const { uri } = await FileSystem.downloadAsync(url, fileUri);
//       await MediaLibrary.saveToLibraryAsync(uri);
//       Alert.alert("Downloaded", "Image saved to gallery.");
//     } catch (error) {
//       console.error("Download error:", error);
//       Alert.alert("Error", "Could not download the image.");
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const renderItem = ({ item }) => {
//     const isSelected = selectedImageId === item.id;
//     const aspectRatio = item.width / item.height;

//     return (
//       <TouchableOpacity
//         onPress={() => handleImagePress(item.id)}
//         style={styles.imageWrapper}
//       >
//         <Image
//           source={{ uri: item.url }}
//           style={[
//             styles.image,
//             {
//               aspectRatio, // ✅ Maintain real shape
//               borderColor: isSelected ? "#8b3dff" : "#1e1e1e",
//             },
//           ]}
//           resizeMode="cover"
//         />
//         {isSelected && (
//           <TouchableOpacity
//             style={styles.downloadIcon}
//             onPress={() => handleDownload(item.url)}
//           >
//             <Ionicons name="arrow-down-circle" size={28} color="white" />
//           </TouchableOpacity>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyComponent = () => {
//   if (loading) return null;
//   return (
//     <View style={{ flex: 1, height: "100%" }}>
//       <View style={styles.mainemptycontainer}>
//         <View style={styles.emptyContainer}>
//           <MaterialCommunityIcons
//             name="image-multiple-outline"
//             size={50}
//             color="#666"
//             style={{ marginBottom: 12 }}
//           />
//           <Text style={styles.emptyTitle}>No Images Yet</Text>
//           <Text style={styles.emptySubtitle}>
//             Your enhanced images will appear here once generated.
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// };

//   return (
//     <View style={styles.container}>
//       {(loading || downloading) && (
//         <ActivityIndicator
//           size="large"
//           color="#8b3dff"
//           style={{ marginTop: 30 }}
//         />
//       )}

//       <MasonryList
//         data={imagesWithSize}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={2}
//         renderItem={renderItem}
//         ListEmptyComponent={renderEmptyComponent}
//         contentContainerStyle={{ paddingBottom: 80 }}
//       />
//     </View>
//   );
// };

// export default EnhancedImageGallery;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#0d0d0d",
//     paddingBottom: 40,
//   },
//   imageWrapper: {
//     position: "relative",
//     borderRadius: 10,
//     overflow: "hidden",
//     margin: 5,
//     flex: 1,
//   },
//   image: {
//     borderRadius: 10,
//     borderWidth: 2,
//     width: "100%",
//   },
//   downloadIcon: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     borderRadius: 20,
//     padding: 3,
//   },
//   // Empty State Styles
//   mainemptycontainer: {
//     flex: 1, paddingHorizontal: 10,
//     flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
//   },
//   emptyContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 120,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#fff",
//     marginBottom: 6,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: "#aaa",
//     textAlign: "center",
//     width: "80%",
//   },
// });


import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  FlatList,
  Dimensions,
} from "react-native";
import { useTheme } from "../../Context/ThemeContext";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import { apiFetch } from "../../apiFetch";

const PAGE_SIZE = 10;
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2; // two columns

const EnhancedImageGallery = ({ navigation }) => {
  const { theme } = useTheme();
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [imagesWithSize, setImagesWithSize] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [showLoader, setShowLoader] = useState(false); // ✅ new loader modal state

  // ✅ Fetch paginated gallery
  const fetchGallery = useCallback(
    async (pageNum = 1) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const res = await apiFetch(
          `/Model/gallery-images?page=${pageNum}&limit=${PAGE_SIZE}`,
          {},
          navigation
        );

        if (!res.ok) throw new Error("Failed to fetch gallery");
        const data = await res.json();
        const { images: fetched, hasMore: moreAvailable } = data;

        const processed = await Promise.all(
          fetched.map(
            (item) =>
              new Promise((resolve) => {
                const uri = item.url;
                Image.getSize(
                  uri,
                  (w, h) => {
                    const aspectRatio = w / h || 1;
                    const imgHeight = CARD_WIDTH / aspectRatio;
                    resolve({ ...item, aspectRatio, height: imgHeight });
                  },
                  () => resolve({ ...item, aspectRatio: 1, height: 180 })
                );
              })
          )
        );

        if (pageNum === 1) setImages(processed);
        else setImages((prev) => [...prev, ...processed]);

        setHasMore(moreAvailable);
        setPage(pageNum);
      } catch (err) {
        console.error("❌ Error fetching gallery:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [navigation]
  );

  useEffect(() => {
    fetchGallery(1);
  }, [fetchGallery]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore || loading) return;
    fetchGallery(page + 1);
  }, [loadingMore, hasMore, loading, page, fetchGallery]);

  const handleImagePress = (id) => {
    setSelectedImageId(id === selectedImageId ? null : id);
  };

  // ✅ Download with Loader + Confirmation
  const handleDownload = async (url) => {
    try {
      setShowLoader(true); // 🔄 show loader modal
      setDownloading(true);

      const fileUri =
        FileSystem.documentDirectory + `enhanced_${Date.now()}.jpg`;
      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      await MediaLibrary.saveToLibraryAsync(uri);

      // ✅ Hide loader and show success modal
      setShowLoader(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (error) {
      console.error("Download error:", error);
      setShowLoader(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } finally {
      setDownloading(false);
    }
  };

  const formatMasonry = (data) => {
    const left = [];
    const right = [];
    data.forEach((item, index) => {
      if (index % 2 === 0) left.push(item);
      else right.push(item);
    });
    return [left, right];
  };

  const [leftCol, rightCol] = formatMasonry(images);

  const renderMasonry = () => (
    <View style={styles.masonryContainer}>
      <View style={styles.column}>{leftCol.map(renderCard)}</View>
      <View style={styles.column}>{rightCol.map(renderCard)}</View>
    </View>
  );

  const renderCard = (item) => {
    const isSelected = selectedImageId === item.id;
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.9}
        onPress={() => handleImagePress(item.id)}
        style={[
          styles.card,
          {
            height: item.height,
            // borderColor: isSelected ? "#ff3d9b" : "#1e1e1e",
            transform: [{ scale: isSelected ? 1.03 : 1 }],
          },
        ]}
      >
        <Image
          source={{ uri: item.url }}
          style={[styles.image, { height: item.height }]}
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
    );
  };

  if (loading && images.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#8b3dff" />
      </View>
    );
  }

  //  if (imagesWithSize.length === 0) {
  //     return (
  //       <View style={styles.emptyContainer}>
  //         <MaterialCommunityIcons
  //           name="view-grid-outline"
  //           size={50}
  //           color="#666"
  //           style={{ marginBottom: 12 }}
  //         />
  //         <Text style={styles.emptyTitle}>No Favourite Templates Yet</Text>
  //         <Text style={styles.emptySubtitle}>
  //           Your enhanced images will appear here once generated.
  //         </Text>
  //       </View>
  //     );
  //   }

  return (
    <View style={styles.container}>
      <FlatList
        data={images.length > 0 ? [{}] : []}
        renderItem={renderMasonry}
        keyExtractor={() => "masonry"}
        ListEmptyComponent={renderEmptyComponent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color="#8b3dff" />
            </View>
          ) : null
        }
      />


      {/* 🔄 Loader Modal */}
      <AnimatePresence>
        {showLoader && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "timing", duration: 300 }}
            style={styles.confirmationOverlay}
          >
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "timing", duration: 400 }}
              style={styles.loaderBox}
            >
              <MotiView
                from={{ rotate: "0deg" }}
                animate={{ rotate: "360deg" }}
                transition={{ loop: true, type: "timing", duration: 1200 }}
                style={styles.loaderRing}
              />
              <Text style={styles.loaderText}>Downloading...</Text>
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>

      {/* ✅ Success Confirmation Modal */}
      <AnimatePresence>
        {showToast && (
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "timing", duration: 400 }}
            style={styles.confirmationOverlay}
          >
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 400, delay: 150 }}
              style={styles.confirmationBox}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="checkmark-circle" size={60} color="#ff3d9b" />
              </View>
              <Text style={styles.confirmationTitle}>Download Complete!</Text>
              <Text style={styles.confirmationText}>
                Your image has been saved successfully to your gallery.
              </Text>
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
};

export default EnhancedImageGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    paddingTop: 10,
  },
  masonryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  column: {
    flex: 1,
  },
  card: {
    margin: 6,
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
    position: "relative",
  },
  image: {
    width: "100%",
    borderRadius: 12,
  },
  downloadIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 3,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d0d0d",
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
  confirmationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    elevation: 9999,
  },
  loaderBox: {
    width: 140,
    height: 140,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8b3dff",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: "#4d4d4d",
  },
  loaderRing: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: "rgba(139,61,255,0.2)",
    borderTopColor: "#ff3d9b",
    marginBottom: 12,
  },
  loaderText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  confirmationBox: {
    width: "75%",
    backgroundColor: "#1E1E1E",
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: "#8b3dff",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: "#4d4d4d",
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(139,61,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#8b3dff",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  confirmationTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  confirmationText: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
