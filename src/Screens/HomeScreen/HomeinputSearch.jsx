import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { apiFetch } from "../../apiFetch";

const aspectRatios = [
  { label: "Auto", ratio: "auto", icon: "✨", w: "", h: "" },
  { label: "1:1", ratio: "1:1", icon: "⬛", w: 1024, h: 1024 },
  { label: "16:9", ratio: "16:9", icon: "🖥️", w: 1920, h: 1080 },
  { label: "9:16", ratio: "9:16", icon: "📱", w: 1080, h: 1920 },
  { label: "3:2", ratio: "3:2", icon: "🖼️", w: 1536, h: 1024 },
  { label: "2:3", ratio: "2:3", icon: "📸", w: 1024, h: 1536 },
];

const resolutions = [
  { label: "720p", value: "720p" },
  { label: "1080p", value: "1080p" },
  { label: "2K", value: "2k" },
  { label: "4K", value: "4k" },
];

const DEFAULT_WIDTH = "1296";
const DEFAULT_HEIGHT = "2728";

const SearchHeader = () => {
  const [search, setSearch] = useState("");
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0]);
  const [resolution, setResolution] = useState(resolutions[2]);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const inputField = useRef(null);

  const handleSearch = async () => {
    const payload = {
      query: search,
      aspectRatio: aspectRatio.label,
      resolution: resolution.value,
      width,
      height,
    };
    console.log("🔹 Sending payload:", payload);

    try {
      const res = await apiFetch(`/ai/generate`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log("✅ AI Generated Response:", data);

      setSearch("");
      setAspectRatio(aspectRatios[0]);
      setResolution(resolutions[2]);
      setWidth(DEFAULT_WIDTH);
      setHeight(DEFAULT_HEIGHT);
      setSelectedImage(null);
      setActiveFilter(null);
      inputField.current?.blur();
    } catch (error) {
      console.error("❌ Error generating AI image:", error);
    }
  };

  const toggleFilter = (type) => {
    setActiveFilter((prev) => (prev === type ? null : type));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAspectSelect = (item) => {
    setAspectRatio(item);
    if (item.w && item.h) {
      setWidth(String(item.w));
      setHeight(String(item.h));
    }
  };

  const handleResolutionSelect = (r) => {
    setResolution(r);
  };

  const addDoubleQuotes = () => {
    setSearch((prev) => prev + ' " "');
  };

  return (
    <TouchableWithoutFeedback onPress={() => setActiveFilter(null)}>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.headerRow}>
          <View style={styles.newBadge}>
            <Text style={styles.newText}>New</Text>
          </View>
          <Text style={styles.title}>Design cards with AI magic</Text>
        </View>

        <View style={styles.container}>
          {/* 🔍 Prompt Input */}
          <View style={styles.searchBar}>
            <TextInput
              ref={inputField}
              style={styles.input}
              placeholder="Describe your card design..."
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={setSearch}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
            <View>
              <TouchableOpacity style={styles.goButton} onPress={handleSearch}>
                <Ionicons name="arrow-forward" size={18} color="black" />
              </TouchableOpacity>
            </View>

          </View>

          {/* 🧩 Toolbar */}
          <View style={styles.toolbar}>
            <TouchableOpacity style={styles.iconBtn} onPress={pickImage}>
              <Ionicons name="image-outline" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => toggleFilter("aspect")}
            >
              <MaterialCommunityIcons
                name="aspect-ratio"
                size={18}
                color="#fff"
              />
              <Text style={styles.btnLabel}>
                {aspectRatio.icon} {aspectRatio.label}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => toggleFilter("resolution")}
            >
              <MaterialCommunityIcons name="monitor" size={18} color="#fff" />
              <Text style={styles.btnLabel}>{resolution.label}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={addDoubleQuotes}>
              <Text style={styles.quoteText}>“T”</Text>
            </TouchableOpacity>

            {selectedImage && (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                />
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Aspect Ratio Dropdown */}
          {activeFilter === "aspect" && (
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {aspectRatios.map((item) => (
                    <TouchableOpacity
                      key={item.label}
                      style={[
                        styles.optionBtn,
                        aspectRatio.label === item.label && styles.optionSelected,
                      ]}
                      onPress={() => handleAspectSelect(item)}
                    >
                      <Text style={styles.optionText}>
                        {item.icon} {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* 🧮 Custom Width/Height */}
                <View style={styles.sizeBox}>
                  <Text style={styles.sizeLabel}>Custom Size (px):</Text>
                  <View style={styles.sizeRow}>
                    <View style={styles.sizeInputContainer}>
                      <Text style={styles.sizeInputLabel}>W</Text>
                      <TextInput
                        style={styles.sizeInput}
                        keyboardType="numeric"
                        value={width}
                        onChangeText={setWidth}
                        placeholder="Width"
                        placeholderTextColor="#777"
                      />
                    </View>

                    <Text style={styles.xText}>×</Text>

                    <View style={styles.sizeInputContainer}>
                      <Text style={styles.sizeInputLabel}>H</Text>
                      <TextInput
                        style={styles.sizeInput}
                        keyboardType="numeric"
                        value={height}
                        onChangeText={setHeight}
                        placeholder="Height"
                        placeholderTextColor="#777"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}

          {/* Resolution Dropdown */}
          {activeFilter === "resolution" && (
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                {resolutions.map((r) => (
                  <TouchableOpacity
                    key={r.value}
                    style={[
                      styles.optionBtn,
                      resolution.value === r.value && styles.optionSelected,
                    ]}
                    onPress={() => handleResolutionSelect(r)}
                  >
                    <Text style={styles.optionText}>{r.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#4d4d4d",
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50, borderWidth: 1, borderColor: '#ff3d9b',
    marginRight: 8,
  },
  newText: { color: "white", fontSize: 12, fontWeight: "bold" },
  title: { fontSize: 18, fontWeight: "600", color: "white" },
  searchBar: {

    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    // borderRadius: 50,
    // paddingHorizontal: 0,
    marginBottom: 10,
    // alignItems: "start",
  },
  input: { flex: 1, padding: 10,paddingLeft:0, color: "#fff", fontSize: 15, height: 80 },
  goButton: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  iconBtn: {
    backgroundColor: "#2a2b2f",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    flexDirection: "row",
    alignItems: "center",
  },
  btnLabel: { color: "#fff", fontSize: 13, marginLeft: 5 },
  quoteText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  dropdown: {
    backgroundColor: "#2a2b2f",
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 6,
    backgroundColor: "#333",
  },
  optionSelected: { backgroundColor: "#8b3dff" },
  optionText: { color: "#fff", fontSize: 14 },
  sizeBox: {
    marginTop: 12,
    backgroundColor: "#2f3034",
    borderRadius: 12,
    padding: 10,
  },
  sizeLabel: { color: "#aaa", marginBottom: 4, fontSize: 14 },
  sizeRow: { flexDirection: "row", alignItems: "center" },
  sizeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2f3034",
    borderRadius: 8,
    paddingHorizontal: 8,
    flex: 1,
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  sizeInputLabel: {
    color: "#bbb",
    fontWeight: "600",
    fontSize: 13,
    marginRight: 6,
  },
  sizeInput: {
    flex: 1,
    backgroundColor: "transparent",
    color: "#fff",
    paddingVertical: 8,
    fontSize: 14,
    textAlign: "center",
  },
  xText: {
    color: "#999",
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  imageWrapper: { position: "relative" },
  previewImage: { width: 40, height: 40, borderRadius: 8 },
  removeIcon: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
});
