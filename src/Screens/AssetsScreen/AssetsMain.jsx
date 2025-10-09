import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
// import EnhancedImageGallery from "./EnhancedImageGallery"; // ✅ import your gallery
// import FavouriteTemplates from "./FavouriteTemplates"; // ✅ import favourite templates

import EnhancedImageGallery from "../HomeScreen/EnhancedImagesGallery";
import FavouriteTemplates from "../FavouriteTemplatesScreen/FavouriteTemplates";
const AssetsMainScreen = () => {
  const [activeTab, setActiveTab] = useState("gallery"); // default: gallery

  return (
    <View style={styles.container}>
      {/* 🔹 Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "gallery" && styles.activeTab]}
          onPress={() => setActiveTab("gallery")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "gallery" && styles.activeTabText,
            ]}
          >
            Your Gallery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "favourites" && styles.activeTab]}
          onPress={() => setActiveTab("favourites")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "favourites" && styles.activeTabText,
            ]}
          >
            Favourite Templates
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Content */}
      <View style={styles.content}>
        {activeTab === "gallery" ? (
          <EnhancedImageGallery />
        ) : (
          <FavouriteTemplates />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1a1a1a",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#ff3d9b",
  },
  tabText: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#ff3d9b",
  },

  content: {
    flex: 1,
  },
});

export default AssetsMainScreen;
