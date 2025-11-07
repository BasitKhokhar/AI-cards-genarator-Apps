// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Share,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import * as Clipboard from "expo-clipboard";
// import * as MediaLibrary from "expo-media-library";
// import * as FileSystem from "expo-file-system";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { AnimatePresence, MotiView } from "moti";
// import { colors } from "../../Themes/colors";
// import { fonts } from "../../Themes/fonts";
// import Loading from "../../Components/Loader/Loading";
// import { apiFetch } from "../../apiFetch";

// export default function AITemplatesResultScreen({ route, navigation }) {
//    const navigation= useNavigation();
//   const { imageId } = route.params;
//   const [imageDetails, setImageDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showLoader, setShowLoader] = useState(false);
//   const [showToast, setShowToast] = useState(false);


//   // ✅ Fetch image details from backend
//   useEffect(() => {
//     const fetchImageDetails = async () => {
//       try {
//         const res = await apiFetch(`/Model/image/${imageId}`, {}, navigation);
//         const data = await res.json();
//         if (data.success) setImageDetails(data.image);
//       } catch (err) {
//         console.error("❌ Error fetching image details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchImageDetails();
//   }, [imageId]);

//   // ✅ Download handler
//   const handleDownload = async () => {
//     try {
//       setShowLoader(true);

//       const fileUri = FileSystem.cacheDirectory + `ai_image_${Date.now()}.jpg`;
//       const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
//       await MediaLibrary.saveToLibraryAsync(uri);

//       setShowLoader(false);
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 2500);
//     } catch (err) {
//       console.log("Download error:", err);
//       setShowLoader(false);
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

//   const handleCopy = async () => {
//     await Clipboard.setStringAsync(prompt);
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bodybackground }}>
//         <Loading />
//         <Text style={{ color: colors.mutedText, marginTop: 10 }}>Loading image details...</Text>
//       </View>
//     );
//   }

//   if (!imageDetails) {
//     return (
//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bodybackground }}>
//         <MaterialCommunityIcons name="alert-circle-outline" size={50} color={colors.mutedText} />
//         <Text style={{ color: colors.mutedText, marginTop: 10 }}>Image not found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: colors.bodybackground }}>
//       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//         {/* Main Image */}
//         <Image source={{ uri: imageUrl }} style={styles.mainImage} />

//         {/* Action Buttons */}
//         <View style={styles.actionRow}>
//           <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
//             <Ionicons name="download-outline" size={22} color={colors.primary} />
//             <Text style={styles.actionText}>Download</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
//             <Ionicons
//               name="share-social-outline"
//               size={22}
//               color={colors.primary}
//             />
//             <Text style={styles.actionText}>Share</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
//             <Ionicons
//               name="share-social-outline"
//               size={22}
//               color={colors.primary}
//             />
//             <Text style={styles.actionText}>Share</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Details Section */}
//         <View style={styles.generationdetailsCard}>
//           <Text style={[styles.heading, { marginBottom: 15 }]}>
//             Generation Details
//           </Text>

//           {/* Prompt Section */}
//           <View style={styles.promptCard}>
//             <View style={styles.promptHeader}>
//               <Text style={[styles.heading, { fontSize: 16 }]}>Prompt</Text>
//               <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
//                 <Ionicons name="copy-outline" size={18} color={colors.primary} />
//                 <Text style={styles.copyText}>Copy</Text>
//               </TouchableOpacity>
//             </View>
//             <Text style={styles.promptValue}>{prompt}</Text>
//           </View>

//           {/* Detail Rows */}
//           <View style={styles.detailsCard}>
//             <View style={styles.detailRow}>
//               <Text style={styles.label}>Resolution</Text>
//               <Text style={styles.value}>{resolution}</Text>
//             </View>

//             <View style={styles.detailRow}>
//               <Text style={styles.label}>Aspect Ratio</Text>
//               <Text style={styles.value}>{aspectratio}</Text>
//             </View>

//             <View style={styles.detailRow}>
//               <Text style={styles.label}>Created</Text>
//               <Text style={styles.value}>
//                 {new Date(createdAt).toLocaleString()}
//               </Text>
//             </View>

//             <View style={styles.detailRow}>
//               <Text style={styles.label}>Model</Text>
//               <Text style={styles.value}>Seedream 4.0 (mock)</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

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

//       {/* ✅ Success Confirmation */}
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
//                 <Ionicons
//                   name="checkmark-circle"
//                   size={60}
//                   color={colors.primary}
//                 />
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
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 12 },
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
//   actionBtn: { alignItems: "center", justifyContent: "center" },
//   actionText: {
//     color: colors.text,
//     fontSize: 13,
//     marginTop: 4,
//     fontFamily: fonts.medium, // ✅ Nunito_500Medium
//   },
//   generationdetailsCard: {
//     backgroundColor: colors.cardsbackground,
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 20,
//   },
//   promptCard: { marginBottom: 20 },
//   promptHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   heading: {
//     color: colors.text,
//     fontSize: 18,
//     fontFamily: fonts.heading,
//   },
//   copyBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(6,182,212,0.1)",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   copyText: {
//     color: colors.primary,
//     marginLeft: 5,
//     fontSize: 13,
//     fontFamily: fonts.medium,
//   },
//   promptValue: {
//     color: colors.mutedText,
//     fontSize: 15,
//     lineHeight: 22,
//     fontFamily: fonts.body,
//   },
//   detailsCard: { borderRadius: 14, paddingVertical: 10 },
//   detailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   label: {
//     color: colors.text,
//     fontSize: 15,
//     flex: 1,
//     fontFamily: fonts.medium,
//   },
//   value: {
//     color: colors.mutedText,
//     fontSize: 15,
//     flex: 1,
//     textAlign: "right",
//     fontFamily: fonts.body,
//   },

//   // 🔄 Loader styles
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
//     fontFamily: fonts.medium,
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
//     fontFamily: fonts.heading,
//     marginBottom: 6,
//   },
//   confirmationText: {
//     color: colors.mutedText,
//     fontSize: 14,
//     textAlign: "center",
//     lineHeight: 20,
//     fontFamily: fonts.body,
//   },
// });
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AnimatePresence, MotiView } from "moti";
import { colors } from "../../Themes/colors";
import { fonts } from "../../Themes/fonts";
import Loading from "../../Components/Loader/Loading";
import { apiFetch } from "../../apiFetch";

export default function AITemplatesResultScreen({ route }) {
  const navigation = useNavigation();
  const { imageId } = route.params;

  const [imageDetails, setImageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // ✅ Fetch image details from backend
  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        const res = await apiFetch(`/cards/image/${imageId}`, {}, navigation);
        const data = await res.json();
        if (data.success) setImageDetails(data.image);
      } catch (err) {
        console.error("❌ Error fetching image details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImageDetails();
  }, [imageId]);

  // ✅ Download handler
  const handleDownload = async () => {
    try {
      if (!imageDetails?.url) return;
      setShowLoader(true);

      const fileUri = FileSystem.cacheDirectory + `ai_image_${Date.now()}.jpg`;
      const { uri } = await FileSystem.downloadAsync(imageDetails.url, fileUri);
      await MediaLibrary.saveToLibraryAsync(uri);

      setShowLoader(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.log("Download error:", err);
      setShowLoader(false);
    }
  };

  // ✅ Share handler
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check this AI-generated image!\n\nPrompt: ${imageDetails?.prompt}\n${imageDetails?.url}`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Copy handler
  const handleCopy = async () => {
    if (imageDetails?.prompt) await Clipboard.setStringAsync(imageDetails.prompt);
  };

  // 🌀 Loading or Empty states
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Loading />
        <Text style={styles.loadingText}>Loading image details...</Text>
      </View>
    );
  }

  if (!imageDetails) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={50}
          color={colors.mutedText}
        />
        <Text style={styles.loadingText}>Image not found.</Text>
      </View>
    );
  }

  const { url, prompt, resolution, aspectratio, createdAt } = imageDetails;

  // ✅ Main UI
  return (
    <View style={{ flex: 1, backgroundColor: colors.bodybackground }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <Image source={{ uri: url }} style={styles.mainImage} />

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
            <Ionicons name="download-outline" size={22} color={colors.primary} />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={22} color={colors.primary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Details Section */}
        <View style={styles.generationdetailsCard}>
          <Text style={[styles.heading, { marginBottom: 15 }]}>Generation Details</Text>

          {/* Prompt Section */}
          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <Text style={[styles.heading, { fontSize: 16 }]}>Prompt</Text>
              <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                <Ionicons name="copy-outline" size={18} color={colors.primary} />
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.promptValue}>{prompt || "—"}</Text>
          </View>

          {/* Detail Rows */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Resolution</Text>
              <Text style={styles.value}>{resolution || "—"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Aspect Ratio</Text>
              <Text style={styles.value}>{aspectratio || "—"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Created</Text>
              <Text style={styles.value}>
                {createdAt ? new Date(createdAt).toLocaleString() : "—"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Model</Text>
              <Text style={styles.value}>Seedream 4.0 (mock)</Text>
            </View>
          </View>
        </View>
      </ScrollView>

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
              style={[styles.loaderBox, { backgroundColor: colors.cardsbackground }]}
            >
              <View style={styles.loaderRing}>
                <Loading />
              </View>
              <Text style={styles.loaderText}>Downloading...</Text>
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>

      {/* ✅ Success Confirmation */}
      <AnimatePresence>
        {showToast && (
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "timing", duration: 400 }}
            style={styles.confirmationOverlay}
          >
            <MotiView style={styles.confirmationBox}>
              <View style={styles.iconWrapper}>
                <Ionicons name="checkmark-circle" size={60} color={colors.primary} />
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
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
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
  actionText: {
    color: colors.text,
    fontSize: 13,
    marginTop: 4,
    fontFamily: fonts.medium,
  },
  generationdetailsCard: {
    backgroundColor: colors.cardsbackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  promptCard: { marginBottom: 20 },
  promptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  heading: {
    color: colors.text,
    fontSize: 18,
    fontFamily: fonts.heading,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(6,182,212,0.1)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  copyText: {
    color: colors.primary,
    marginLeft: 5,
    fontSize: 13,
    fontFamily: fonts.medium,
  },
  promptValue: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.body,
  },
  detailsCard: { borderRadius: 14, paddingVertical: 10 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    flex: 1,
    fontFamily: fonts.medium,
  },
  value: {
    color: colors.mutedText,
    fontSize: 15,
    flex: 1,
    textAlign: "right",
    fontFamily: fonts.body,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bodybackground,
  },
  loadingText: {
    color: colors.mutedText,
    marginTop: 10,
    fontSize: 14,
  },
  confirmationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  loaderBox: {
    width: 140,
    height: 140,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  loaderRing: { marginBottom: 12 },
  loaderText: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.medium,
  },
  confirmationBox: {
    width: "75%",
    backgroundColor: colors.cardsbackground,
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(6,182,212,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  confirmationTitle: {
    color: colors.text,
    fontSize: 20,
    fontFamily: fonts.heading,
    marginBottom: 6,
  },
  confirmationText: {
    color: colors.mutedText,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: fonts.body,
  },
});
