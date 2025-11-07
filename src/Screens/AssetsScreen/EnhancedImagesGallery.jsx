// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Text,
//   FlatList,
//   Dimensions,
// } from "react-native";

// import * as FileSystem from "expo-file-system";
// import * as MediaLibrary from "expo-media-library";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { MotiView, AnimatePresence } from "moti";
// import Loading from "../../Components/Loader/Loading";
// import Loader from "../../Components/Loader/Loader";
// import { useGeneration } from "../../Context/ImageGenerationContext";
// import { LinearGradient } from "expo-linear-gradient";
// import { colors } from "../../Themes/colors";
// import { apiFetch } from "../../apiFetch";

// const PAGE_SIZE = 10;
// const { width } = Dimensions.get("window");
// const CARD_WIDTH = (width - 36) / 2;

// const EnhancedImageGallery = ({ navigation }) => {
//    const { generationStatus } = useGeneration();
//   const { isLoading, progress, message } = generationStatus;


//   const [images, setImages] = useState([]);
//   const [selectedImageId, setSelectedImageId] = useState(null);
//   const [downloading, setDownloading] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(1);
//   const [showToast, setShowToast] = useState(false);
//   const [showLoader, setShowLoader] = useState(false);

//   // ✅ Fetch paginated gallery
//   const fetchGallery = useCallback(
//     async (pageNum = 1) => {
//       try {
//         if (pageNum === 1) setLoading(true);
//         else setLoadingMore(true);

//         const res = await apiFetch(
//           `/Model/gallery-images?page=${pageNum}&limit=${PAGE_SIZE}`,
//           {},
//           navigation
//         );

//         if (!res.ok) throw new Error("Failed to fetch gallery");
//         const data = await res.json();
//         const { images: fetched, hasMore: moreAvailable } = data;

//         const processed = await Promise.all(
//           fetched.map(
//             (item) =>
//               new Promise((resolve) => {
//                 const uri = item.url;
//                 Image.getSize(
//                   uri,
//                   (w, h) => {
//                     const aspectRatio = w / h || 1;
//                     const imgHeight = CARD_WIDTH / aspectRatio;
//                     resolve({ ...item, aspectRatio, height: imgHeight });
//                   },
//                   () => resolve({ ...item, aspectRatio: 1, height: 180 })
//                 );
//               })
//           )
//         );

//         if (pageNum === 1) setImages(processed);
//         else setImages((prev) => [...prev, ...processed]);

//         setHasMore(moreAvailable);
//         setPage(pageNum);
//       } catch (err) {
//         console.error("❌ Error fetching gallery:", err);
//       } finally {
//         setLoading(false);
//         setLoadingMore(false);
//       }
//     },
//     [navigation]
//   );

//   useEffect(() => {
//     fetchGallery(1);
//   }, [fetchGallery]);

//   const handleLoadMore = useCallback(() => {
//     if (loadingMore || !hasMore || loading) return;
//     fetchGallery(page + 1);
//   }, [loadingMore, hasMore, loading, page, fetchGallery]);

//   const handleImagePress = (id) => {
//     setSelectedImageId(id === selectedImageId ? null : id);
//   };

//   // ✅ Download with Loader + Confirmation
//   const handleDownload = async (url) => {
//     try {
//       setShowLoader(true);
//       setDownloading(true);

//       const fileUri =
//         FileSystem.documentDirectory + `enhanced_${Date.now()}.jpg`;
//       const { uri } = await FileSystem.downloadAsync(url, fileUri);
//       await MediaLibrary.saveToLibraryAsync(uri);

//       setShowLoader(false);
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 2500);
//     } catch (error) {
//       console.error("Download error:", error);
//       setShowLoader(false);
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 2500);
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const formatMasonry = (data) => {
//     const left = [];
//     const right = [];
//     data.forEach((item, index) => {
//       if (index % 2 === 0) left.push(item);
//       else right.push(item);
//     });
//     return [left, right];
//   };

//   const [leftCol, rightCol] = formatMasonry(images);

//   const renderMasonry = () => (
//     <View style={styles.masonryContainer}>
//       <View style={styles.column}>{leftCol.map(renderCard)}</View>
//       <View style={styles.column}>{rightCol.map(renderCard)}</View>
//     </View>
//   );

//   const renderCard = (item) => {
//     const isSelected = selectedImageId === item.id;
//     return (
//       <TouchableOpacity
//         key={item.id}
//         activeOpacity={0.9}
//         onPress={() => handleImagePress(item.id)}
//         style={[
//           styles.card,
//           {
//             height: item.height,
//             borderColor: isSelected ? colors.primary : colors.border,
//             transform: [{ scale: isSelected ? 1.03 : 1 }],
//           },
//         ]}
//       >
//         <Image
//           source={{ uri: item.url }}
//           style={[styles.image, { height: item.height }]}
//           resizeMode="cover"
//         />
//         {isSelected && (
//           <TouchableOpacity
//             style={styles.downloadIcon}
//             onPress={() => handleDownload(item.url)}
//           >
//             <Ionicons name="arrow-down-circle" size={28} color={colors.text} />
//           </TouchableOpacity>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyComponent = () => {
//     if (loading) return null;
//     return (
//       <View style={styles.emptyContainer}>
//         <MaterialCommunityIcons
//           name="image-multiple-outline"
//           size={50}
//           color={colors.mutedText}
//           style={{ marginBottom: 12 }}
//         />
//         <Text style={styles.emptyTitle}>No Images Yet</Text>
//         <Text style={styles.emptySubtitle}>
//           Your enhanced images will appear here once generated.
//         </Text>
//       </View>
//     );
//   };

//   if (loading && images.length === 0) {
//     return (
//       <View style={styles.loaderContainer}>
//         <Loader />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={images.length > 0 ? [{}] : []}
//         renderItem={renderMasonry}
//         keyExtractor={() => "masonry"}
//         ListEmptyComponent={renderEmptyComponent}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.3}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         ListFooterComponent={
//           loadingMore ? (
//             <View style={{ paddingVertical: 20 }}>
//               <ActivityIndicator size="small" color={colors.primary} />
//             </View>
//           ) : null
//         }
//       />

//       {/* 🔄 Loader Modal */}
//       <AnimatePresence>
//         {showLoader && (
//           <MotiView
//             from={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ type: "timing", duration: 300 }}
//             style={styles.confirmationOverlay}
//           >
//             <MotiView
//               from={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ type: "timing", duration: 400 }}
//               style={[styles.loaderBox, { backgroundColor: colors.cardsbackground }]}
//             >
//               <View style={styles.loaderRing}>
//                 <Loading />
//               </View>
//               <Text style={styles.loaderText}>Downloading...</Text>
//             </MotiView>
//           </MotiView>
//         )}
//       </AnimatePresence>


//       {/* ✅ Success Confirmation Modal */}
//       <AnimatePresence>
//         {showToast && (
//           <MotiView
//             from={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//             transition={{ type: "timing", duration: 400 }}
//             style={styles.confirmationOverlay}
//           >
//             <MotiView style={styles.confirmationBox}>
//               <View style={styles.iconWrapper}>
//                 <Ionicons name="checkmark-circle" size={60} color={colors.primary} />
//               </View>
//               <Text style={styles.confirmationTitle}>Download Complete!</Text>
//               <Text style={styles.confirmationText}>
//                 Your image has been saved successfully to your gallery.
//               </Text>
//             </MotiView>
//           </MotiView>
//         )}
//       </AnimatePresence>
//     </View>
//   );
// };

// export default EnhancedImageGallery;

// const styles = StyleSheet.create({
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     backgroundColor: colors.bodybackground,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: colors.bodybackground,
//     paddingTop: 10,
//   },
//   masonryContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 10,
//   },
//   column: { flex: 1 },
//   card: {
//     margin: 6,
//     borderRadius: 12,
//     borderWidth: 1.5,
//     overflow: "hidden",
//     backgroundColor: colors.cardsbackground,
//     position: "relative",
//   },
//   image: { width: "100%", borderRadius: 12 },
//   downloadIcon: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     borderRadius: 20,
//     padding: 3,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: colors.bodybackground,
//   },
//   emptyContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 120,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: colors.text,
//     marginBottom: 6,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: colors.mutedText,
//     textAlign: "center",
//     width: "80%",
//   },
//   confirmationOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.55)",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 9999,
//     elevation: 9999,
//   },
//   loaderBox: {
//     width: 140,
//     height: 140,
//     backgroundColor: colors.cardsbackground,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1.5,
//     borderColor: colors.border,
//     // shadowColor: colors.primary,
//     shadowOpacity: 0.4,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   loaderRing: {
//     marginBottom: 12,
//   },
//   loaderText: {
//     color: colors.text,
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   confirmationBox: {
//     width: "75%",
//     backgroundColor: colors.cardsbackground,
//     borderRadius: 18,
//     alignItems: "center",
//     paddingVertical: 24,
//     paddingHorizontal: 16,
//     borderWidth: 1.5,
//     borderColor: colors.border,
//     shadowColor: colors.primary,
//     shadowOpacity: 0.4,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   iconWrapper: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "rgba(6,182,212,0.1)",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   confirmationTitle: {
//     color: colors.text,
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 6,
//   },
//   confirmationText: {
//     color: colors.mutedText,
//     fontSize: 14,
//     textAlign: "center",
//     lineHeight: 20,
//   },
// });

// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Text,
//   FlatList,
//   Dimensions,
// } from "react-native";
// import { useFocusEffect } from "@react-navigation/native";
// import * as FileSystem from "expo-file-system";
// import * as MediaLibrary from "expo-media-library";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { MotiView, AnimatePresence } from "moti";
// import { colors } from "../../Themes/colors";
// import { apiFetch } from "../../apiFetch";
// import Loading from "../../Components/Loader/Loading";
// import { useGeneration } from "../../Context/ImageGenerationContext";

// const PAGE_SIZE = 10;
// const { width } = Dimensions.get("window");
// const CARD_WIDTH = (width - 36) / 2;

// const EnhancedImageGallery = ({ navigation }) => {
//   const { generationStatus,refreshKey } = useGeneration();
//   const { isLoading, progress, message, completed } = generationStatus || {};
//  console.log("msg from context api",isLoading, progress, message, completed )
//   const [images, setImages] = useState([]);
//   const [selectedImageId, setSelectedImageId] = useState(null);
//   const [downloading, setDownloading] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(1);
//   const [showToast, setShowToast] = useState(false);
//   const [showLoader, setShowLoader] = useState(false);

//   // ✅ Fetch gallery data (paginated)
//   const fetchGallery = useCallback(
//     async (pageNum = 1) => {
//       try {
//         if (pageNum === 1) setLoading(true);
//         else setLoadingMore(true);

//         const res = await apiFetch(
//           `/Model/gallery-images?page=${pageNum}&limit=${PAGE_SIZE}`,
//           {},
//           navigation
//         );
//         if (!res.ok) throw new Error("Failed to fetch gallery");
//         const data = await res.json();
//         const { images: fetched, hasMore: moreAvailable } = data;

//         const processed = await Promise.all(
//           fetched.map(
//             (item) =>
//               new Promise((resolve) => {
//                 const uri = item.url;
//                 Image.getSize(
//                   uri,
//                   (w, h) => {
//                     const aspectRatio = w / h || 1;
//                     const imgHeight = CARD_WIDTH / aspectRatio;
//                     resolve({ ...item, aspectRatio, height: imgHeight });
//                   },
//                   () => resolve({ ...item, aspectRatio: 1, height: 180 })
//                 );
//               })
//           )
//         );

//         if (pageNum === 1) setImages(processed);
//         else setImages((prev) => [...prev, ...processed]);

//         setHasMore(moreAvailable);
//         setPage(pageNum);
//       } catch (err) {
//         console.error("❌ Error fetching gallery:", err);
//       } finally {
//         setLoading(false);
//         setLoadingMore(false);
//       }
//     },
//     [navigation]
//   );

//   // 🧩 Fetch gallery initially
//   useEffect(() => {
//   fetchGallery(1);
// }, [fetchGallery]);

// // 🔁 Re-fetch gallery whenever refreshKey changes
// useEffect(() => {
//   if (refreshKey > 0) {
//     console.log("🟢 Generation completed — refreshing gallery...");
//     fetchGallery(1);
//   }
// }, [refreshKey, fetchGallery]);

//   const handleLoadMore = useCallback(() => {
//     if (loadingMore || !hasMore || loading) return;
//     fetchGallery(page + 1);
//   }, [loadingMore, hasMore, loading, page, fetchGallery]);

//  const handleImagePress = (item) => {
//   navigation.navigate("AITemplatesResultScreen", { imageId: item.id });
// };
//   const handleDownload = async (url) => {
//     try {
//       setShowLoader(true);
//       setDownloading(true);

//       const fileUri = FileSystem.documentDirectory + `enhanced_${Date.now()}.jpg`;
//       const { uri } = await FileSystem.downloadAsync(url, fileUri);
//       await MediaLibrary.saveToLibraryAsync(uri);

//       setShowLoader(false);
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 2500);
//     } catch (error) {
//       console.error("Download error:", error);
//       setShowLoader(false);
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 2500);
//     } finally {
//       setDownloading(false);
//     }
//   };

//   // 🧱 Masonry layout
//   const formatMasonry = (data) => {
//     const left = [];
//     const right = [];
//     data.forEach((item, index) => {
//       if (index % 2 === 0) left.push(item);
//       else right.push(item);
//     });
//     return [left, right];
//   };

//   const [leftCol, rightCol] = formatMasonry(images);

//   const renderCard = (item) => {
//     const isSelected = selectedImageId === item.id;
//     return (
//       <TouchableOpacity
//         key={item.id}
//         activeOpacity={0.9}
//         onPress={() => handleImagePress(item)}
//         style={[
//           styles.card,
//           {
//             height: item.height,
//             borderColor: isSelected ? colors.primary : colors.border,
//             transform: [{ scale: isSelected ? 1.03 : 1 }],
//           },
//         ]}
//       >
//         <Image
//           source={{ uri: item.url }}
//           style={[styles.image, { height: item.height }]}
//           resizeMode="cover"
//         />
//         {isSelected && (
//           <TouchableOpacity
//             style={styles.downloadIcon}
//             onPress={() => handleDownload(item.url)}
//           >
//             <Ionicons name="arrow-down-circle" size={28} color={colors.text} />
//           </TouchableOpacity>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   // 🦴 Skeleton (top of first column)
//   const renderSkeleton = () => (
//     <MotiView
//       from={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ type: "timing", duration: 400 }}
//       style={[
//         styles.card,
//         {
//           height: 220,
//           justifyContent: "center",
//           alignItems: "center",
//           borderColor: colors.border,
//         },
//       ]}
//     >
//       <Loading />
//       {/* <Text style={styles.loadingText}>
//         {message || `Generating... ${progress || 0}%`}
//       </Text> */}
//     </MotiView>
//   );

//   const renderMasonry = () => (
//     <View style={styles.masonryContainer}>
//       <View style={styles.column}>
//         {/* 👇 Skeleton on top when generating */}
//         <AnimatePresence>{isLoading && renderSkeleton()}</AnimatePresence>
//         {leftCol.map(renderCard)}
//       </View>
//       <View style={styles.column}>{rightCol.map(renderCard)}</View>
//     </View>
//   );

//   const renderEmptyComponent = () => {
//     if (loading) return null;
//     return (
//       <View style={styles.emptyContainer}>
//         <MaterialCommunityIcons
//           name="image-multiple-outline"
//           size={50}
//           color={colors.mutedText}
//           style={{ marginBottom: 12 }}
//         />
//         <Text style={styles.emptyTitle}>No Images Yet</Text>
//         <Text style={styles.emptySubtitle}>
//           Your enhanced images will appear here once generated.
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* 🖼️ Gallery List */}
//       <FlatList
//         data={images.length > 0 ? [{}] : []}
//         renderItem={renderMasonry}
//         keyExtractor={() => "masonry"}
//         ListEmptyComponent={renderEmptyComponent}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.3}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         ListFooterComponent={
//           loadingMore ? (
//             <View style={{ paddingVertical: 20 }}>
//               <ActivityIndicator size="small" color={colors.primary} />
//             </View>
//           ) : null
//         }
//       />

//       {/* 🟢 Download + Success Toast */}
//       <AnimatePresence>
//         {showLoader && (
//           <MotiView
//             from={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             style={styles.confirmationOverlay}
//           >
//             <MotiView style={styles.loaderBox}>
//               <View style={styles.loaderRing}>
//                 <Loading />
//               </View>
//               <Text style={styles.loaderText}>Downloading...</Text>
//             </MotiView>
//           </MotiView>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {showToast && (
//           <MotiView
//             from={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//             style={styles.confirmationOverlay}
//           >
//             <MotiView style={styles.confirmationBox}>
//               <Ionicons name="checkmark-circle" size={60} color={colors.primary} />
//               <Text style={styles.confirmationTitle}>Download Complete!</Text>
//               <Text style={styles.confirmationText}>
//                 Your image has been saved successfully.
//               </Text>
//             </MotiView>
//           </MotiView>
//         )}
//       </AnimatePresence>
//     </View>
//   );
// };

// export default EnhancedImageGallery;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.bodybackground,
//     paddingTop: 10,
//   },
//   masonryContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 10,
//   },
//   column: { flex: 1 },
//   card: {
//     margin: 6,
//     borderRadius: 12,
//     borderWidth: 1.5,
//     overflow: "hidden",
//     backgroundColor: colors.cardsbackground,
//     position: "relative",
//   },
//   image: { width: "100%", borderRadius: 12 },
//   downloadIcon: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     borderRadius: 20,
//     padding: 3,
//   },
//   loadingText: {
//     color: colors.text,
//     fontSize: 14,
//     fontWeight: "600",
//     marginTop: 10,
//   },
//   confirmationOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.55)",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 9999,
//   },
//   loaderBox: {
//     width: 140,
//     height: 140,
//     backgroundColor: colors.cardsbackground,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1.5,
//     borderColor: colors.border,
//   },
//   loaderRing: { marginBottom: 12 },
//   loaderText: {
//     color: colors.text,
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   confirmationBox: {
//     width: "75%",
//     backgroundColor: colors.cardsbackground,
//     borderRadius: 18,
//     alignItems: "center",
//     paddingVertical: 24,
//     borderWidth: 1.5,
//     borderColor: colors.border,
//   },
//   confirmationTitle: {
//     color: colors.text,
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 6,
//   },
//   confirmationText: {
//     color: colors.mutedText,
//     fontSize: 14,
//     textAlign: "center",
//     lineHeight: 20,
//   },
//   emptyContainer: {
//     flex: 1,
//     alignItems: "center",
//     marginTop: 80,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     color: colors.text,
//     fontWeight: "700",
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: colors.mutedText,
//     marginTop: 6,
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
import { useFocusEffect,useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import { colors } from "../../Themes/colors";
import { apiFetch } from "../../apiFetch";
import Loading from "../../Components/Loader/Loading";
import { useGeneration } from "../../Context/ImageGenerationContext";

const PAGE_SIZE = 10;
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

const EnhancedImageGallery = () => {
   const navigation = useNavigation();
  const { generationStatus, refreshKey } = useGeneration();
  const { isLoading } = generationStatus || {};
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // ✅ Fetch gallery data (paginated)
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

  // 🧩 Fetch gallery initially
  useEffect(() => {
    fetchGallery(1);
  }, [fetchGallery]);

  // 🔁 Refresh when new generation completes
  useFocusEffect(
    useCallback(() => {
      if (refreshKey > 0) {
        console.log("🟢 Generation completed — refreshing gallery...");
        fetchGallery(1);
      }
    }, [refreshKey, fetchGallery])
  );

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore || loading) return;
    fetchGallery(page + 1);
  }, [loadingMore, hasMore, loading, page, fetchGallery]);

  const handleImagePress = (item) => {
    navigation.navigate("AitemplateResultsScreen", { imageId: item.id });
  };

  // 🧱 Masonry layout
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

  const renderCard = (item) => (
    <TouchableOpacity
      key={item.id}
      activeOpacity={0.9}
      onPress={() => handleImagePress(item)}
      style={[styles.card, { height: item.height }]}
    >
      <Image
        source={{ uri: item.url }}
        style={[styles.image, { height: item.height }]}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderSkeleton = () => (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "timing", duration: 400 }}
      style={[styles.card, { height: 220, justifyContent: "center", alignItems: "center" }]}
    >
      <Loading />
    </MotiView>
  );

  const renderMasonry = () => (
    <View style={styles.masonryContainer}>
      <View style={styles.column}>
        <AnimatePresence>{isLoading && renderSkeleton()}</AnimatePresence>
        {leftCol.map(renderCard)}
      </View>
      <View style={styles.column}>{rightCol.map(renderCard)}</View>
    </View>
  );

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="image-multiple-outline"
          size={50}
          color={colors.mutedText}
          style={{ marginBottom: 12 }}
        />
        <Text style={styles.emptyTitle}>No Images Yet</Text>
        <Text style={styles.emptySubtitle}>
          Your enhanced images will appear here once generated.
        </Text>
      </View>
    );
  };

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
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default EnhancedImageGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bodybackground,
    paddingTop: 10,
  },
  masonryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  column: { flex: 1 },
  card: {
    margin: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: "hidden",
    backgroundColor: colors.cardsbackground,
  },
  image: { width: "100%", borderRadius: 12 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.mutedText,
    marginTop: 6,
    textAlign: "center",
    width: "80%",
  },
});
