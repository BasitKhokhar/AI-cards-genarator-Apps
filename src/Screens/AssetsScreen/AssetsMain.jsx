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
    // justifyContent: "space-around",
    // backgroundColor: "#1a1a1a",
    paddingTop: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: "#333",
  },
  tab: {
    // flex: 1,
    // alignItems: "center",
    paddingVertical: 8,paddingHorizontal:12,borderRadius:50,
    borderWidth:1,borderColor:'#4d4d4d'
  },
  activeTab: {
    backgroundColor:'#2b2b2b'
    // borderBottomWidth: 2,
    // borderBottomColor: "#ff3d9b",
  },
  tabText: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#ffff",
  },

  content: {
    flex: 1,
  },
});

export default AssetsMainScreen;
