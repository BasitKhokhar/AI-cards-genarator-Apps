import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from "react-native";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { apiFetch } from "../../apiFetch";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const aspectRatios = [
    { label: "1:1", value: "1:1", icon: "⬛" },
    { label: "9:16", value: "9:16", icon: "📱" },
    { label: "16:9", value: "16:9", icon: "🖥️" },
];

const resolutions = [
    { label: "720p", value: "720p", icon: "📺" },
    { label: "1080p", value: "1080p", icon: "🖼️" },
    { label: "2K", value: "2k", icon: "⚡" },
    { label: "4K", value: "4k", icon: "🌟" },
];

const SearchHeader = ({ onToggle }) => {
    const [search, setSearch] = useState("");
    const [aspectRatio, setAspectRatio] = useState("16:9");
    const [resolution, setResolution] = useState("2K");
    const [activeFilter, setActiveFilter] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleSearch = async () => {
        const payload = { query: search, aspectRatio, resolution };
        console.log("🔹 Sending payload:", payload);
        try {
            const res = await apiFetch(`/ai/generate`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            console.log("✅ AI Generated Response:", data);
        } catch (error) {
            console.error("❌ Error generating AI image:", error);
        }
    };

 const toggleFilter = (type) => {
    const newState = activeFilter === type ? null : type;
    setActiveFilter(newState);
    if (onToggle) onToggle(!!newState);  // notify parent
  };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const renderFilterOptions = (options, onSelect) => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionList}>
            {options.map((opt) => (
                <TouchableOpacity
                    key={opt.value}
                    style={[
                        styles.optionBtn,
                        (aspectRatio === opt.value || resolution === opt.value) && styles.optionSelected,
                    ]}
                    onPress={() => {
                        onSelect(opt.value);
                        setActiveFilter(null);
                    }}
                >
                    <Text style={styles.optionText}>{opt.icon} {opt.label}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    return (
        <View style={{ paddingHorizontal: 16 }}>
            <LinearGradient
                colors={["#8b3dff", "#ff3d9b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.newBadge}>
                        <Text style={styles.newText}>New</Text>
                    </View>
                    <Text style={styles.title}>Design cards with AI magic</Text>
                </View>

                {/* Search bar */}
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search templates, styles, occasions..."
                        placeholderTextColor="#bbb"
                        value={search}
                        onChangeText={setSearch}
                    />
                    <TouchableOpacity style={styles.goButton} onPress={handleSearch}>
                        <Text style={styles.goText}>Go</Text>
                    </TouchableOpacity>
                </View>

                {/* Filter Buttons */}
                <View style={styles.filtersRow}>
                    {/* Upload button */}
                    <TouchableOpacity style={styles.filterBtn} onPress={pickImage}>
                        <Text style={styles.filterBtnText}>Upload</Text>
                    </TouchableOpacity>

                    {selectedImage && (
                        <View style={styles.imageWrapper}>
                            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                            <TouchableOpacity
                                style={styles.removeIcon}
                                onPress={() => setSelectedImage(null)}
                            >
                                <Text style={{ color: "white", fontSize: 14 }}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Aspect ratio */}
                    <TouchableOpacity
                        style={styles.filterBtn}
                        onPress={() =>
                            setActiveFilter(activeFilter === "aspect" ? null : "aspect")
                        }
                    >
                        <Text style={styles.filterBtnText}>Aspect {aspectRatio}</Text>
                    </TouchableOpacity>

                    {/* Resolution */}
                    <TouchableOpacity
                        style={styles.filterBtn}
                        onPress={() =>
                            setActiveFilter(activeFilter === "resolution" ? null : "resolution")
                        }
                    >
                        <Text style={styles.filterBtnText}>Res {resolution}</Text>
                    </TouchableOpacity>
                </View>

                {/* ✅ This wrapper will expand naturally */}
                <View style={{ marginTop: 8 }}>
                    {activeFilter === "aspect" && renderFilterOptions(aspectRatios, setAspectRatio)}
                    {activeFilter === "resolution" && renderFilterOptions(resolutions, setResolution)}
                </View>
            </LinearGradient>
        </View>
    );
};

export default SearchHeader;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 12,
        marginTop: 15,
        marginBottom: 20,
    },
    headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    newBadge: {
        backgroundColor: "#e91e63",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        marginRight: 8,
    },
    newText: { color: "white", fontSize: 12, fontWeight: "bold" },
    title: { fontSize: 18, fontWeight: "600", color: "white" },
    searchBar: {
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 50,
        marginBottom: 12,
        alignItems: "center",
    },
    input: { flex: 1, padding: 10, color: "white" },
    goButton: {
        backgroundColor: "black",
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    goText: { color: "white", fontWeight: "bold" },
    filtersRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    filterBtn: {
        backgroundColor: "#6a1b9a",
        padding: 10,
        borderRadius: 8,
        marginRight: 8,
    },
    filterBtnText: { color: "white", fontWeight: "500" },
    optionList: { marginTop: 10 },
    optionBtn: {
        backgroundColor: "#555",
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
    },
    optionSelected: { backgroundColor: "#e91e63" },
    optionText: { color: "white", fontWeight: "500" },

    // ✅ For selected image + remove button
    imageWrapper: {
        position: "relative",
        marginRight: 8,
    },
    previewImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    removeIcon: {
        position: "absolute",
        top: -6,
        right: -6,
        backgroundColor: "rgba(0,0,0,0.7)",
        borderRadius: 10,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
});
