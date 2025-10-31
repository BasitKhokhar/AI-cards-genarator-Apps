import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AnimatePresence, MotiView } from "moti";
import { colors } from "../../Themes/colors";
import Loading from "../../Components/Loader/Loading";

export default function AITemplatesResultScreen({ route, navigation }) {
  const { imageUrl, prompt, createdAt, resolution, aspectratio } = route.params;

  const [showLoader, setShowLoader] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // ✅ Download handler
  const handleDownload = async () => {
    try {
      setShowLoader(true);

      const fileUri = FileSystem.cacheDirectory + `ai_image_${Date.now()}.jpg`;
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      await MediaLibrary.saveToLibraryAsync(uri);

      setShowLoader(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.log("Download error:", err);
      setShowLoader(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check this AI-generated image!\n\nPrompt: ${prompt}\n${imageUrl}`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(prompt);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bodybackground }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <Image source={{ uri: imageUrl }} style={styles.mainImage} />

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
            <Ionicons name="download-outline" size={22} color={colors.primary} />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Ionicons
              name="share-social-outline"
              size={22}
              color={colors.primary}
            />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
 <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Ionicons
              name="share-social-outline"
              size={22}
              color={colors.primary}
            />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => alert("Coming soon!")}
          >
            <MaterialCommunityIcons
              name="image-search-outline"
              size={22}
              color={colors.primary}
            />
            <Text style={styles.actionText}>Original</Text>
          </TouchableOpacity> */}
        </View>

        {/* Details Section */}
        <View style={styles.generationdetailsCard}>
          <Text style={[styles.heading, { marginBottom: 15 }]}>
            Generation Details
          </Text>

          {/* Prompt Section */}
          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <Text style={[styles.heading, { fontSize: 16 }]}>Prompt</Text>
              <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                <Ionicons name="copy-outline" size={18} color={colors.primary} />
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.promptValue}>{prompt}</Text>
          </View>

          {/* Detail Rows */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Resolution</Text>
              <Text style={styles.value}>{resolution}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Aspect Ratio</Text>
              <Text style={styles.value}>{aspectratio}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Created</Text>
              <Text style={styles.value}>
                {new Date(createdAt).toLocaleString()}
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
                <Ionicons
                  name="checkmark-circle"
                  size={60}
                  color={colors.primary}
                />
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
  actionText: { color: colors.text, fontSize: 13, marginTop: 4 },
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
  heading: { color: colors.text, fontSize: 18, fontWeight: "700" },
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
    fontWeight: "600",
    marginLeft: 5,
    fontSize: 13,
  },
  promptValue: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
  },
  detailsCard: { borderRadius: 14, paddingVertical: 10 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { color: colors.text, fontSize: 15, fontWeight: "600", flex: 1 },
  value: { color: colors.mutedText, fontSize: 15, flex: 1, textAlign: "right" },

  // 🔄 Loader styles
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
  loaderText: { color: colors.text, fontSize: 15, fontWeight: "600" },

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
    fontWeight: "700",
    marginBottom: 6,
  },
  confirmationText: {
    color: colors.mutedText,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
