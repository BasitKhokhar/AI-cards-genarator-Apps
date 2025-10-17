import { colors } from "../../Themes/colors";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import EnhancedImageGallery from "./EnhancedImagesGallery";
import FavouriteTemplates from "./FavouriteTemplates";
const AssetsMainScreen = () => {
  const [activeTab, setActiveTab] = useState("gallery"); 

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
            Gallery
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
  container: { flex: 1 },

  tabBar: {
    flexDirection: "row",gap:10,paddingHorizontal:16,
    paddingTop: 16,
  },
  tab: {
    paddingVertical: 8,paddingHorizontal:12,borderRadius:50,
    borderWidth:1,borderColor:colors.border
  },
  activeTab: {
    backgroundColor:colors.cardsbackground
  },
  tabText: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "600",
  },
  activeTabText: {
    color: colors.text,
  },
  content: {
    flex: 1,
  },
});

export default AssetsMainScreen;
