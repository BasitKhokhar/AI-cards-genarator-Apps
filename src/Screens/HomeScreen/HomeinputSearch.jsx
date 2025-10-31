import { colors } from "../../Themes/colors";
import { AnimatePresence, MotiView } from "moti";

import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, ScrollView, Modal, Dimensions, } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { EnhanceLoader } from "../../Components/Loader/EnhancLoader";
import { apiFetch } from "../../apiFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
// rn-tourguide imports
import { TourGuideZone, TourGuideZoneByPosition, useTourGuideController, } from "rn-tourguide";

const { height } = Dimensions.get("window");

const aspectRatios = [
  { label: "Auto", w: "", h: "", icon: "auto-fix" },
  { label: "1:1", w: 1024, h: 1024, icon: "square-outline" },
  { label: "16:9", w: 1920, h: 1080, icon: "rectangle-outline" },
  { label: "9:16", w: 1080, h: 1920, icon: "cellphone" },
  { label: "3:2", w: 1536, h: 1024, icon: "rectangle" },
  { label: "2:3", w: 1024, h: 1536, icon: "tablet-cellphone" },
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
  const [heightPx, setHeightPx] = useState(DEFAULT_HEIGHT);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const inputField = useRef(null);

  // for "T" model
  const [isQuoteModalVisible, setIsQuoteModalVisible] = useState(false);
  const [quoteInput, setQuoteInput] = useState('""');
  const quoteInputRef = useRef(null);

  // mdoell states
  const [showLoader, setShowLoader] = useState(false);
  const [payload, setPayload] = useState(null);


  const [layoutReady, setLayoutReady] = useState(false);
  // tour controller
  const { start, canStart } = useTourGuideController();

  // refs (optional if needing to measure)
  const inputFieldRef = useRef(null);
  const imageBtnRef = useRef(null);
  const quoteBtnRef = useRef(null);
  const addBtnRef = useRef(null);



  const isTyping = search.trim().length > 0;

  useEffect(() => {
    const initTourGuide = async () => {
      try {
        const hasJustLoggedIn = await AsyncStorage.getItem("hasJustLoggedIn");
        const hasSeenSearchHeaderTour = await AsyncStorage.getItem("hasSeenSearchHeaderTour");

        // ✅ Run only if user just logged in or has not seen the tour before
        if ((hasJustLoggedIn === "true" || !hasSeenSearchHeaderTour) && canStart && layoutReady) {
          console.log("🟢 Starting TourGuide at zone 1...");
          setTimeout(() => start(), 300);

          // remove login trigger
          await AsyncStorage.removeItem("hasJustLoggedIn");

          // store flag that user has seen the tour
          await AsyncStorage.setItem("hasSeenSearchHeaderTour", "true");
        }
      } catch (err) {
        console.warn("⚠️ TourGuide start error:", err);
      }
    };

    // Only run when both ready
    if (canStart && layoutReady) {
      initTourGuide();
    }
  }, [canStart, layoutReady]);


  // const handleSearch = async () => {
  //   if (!search.trim()) return;

  //   const payload = {
  //     query: search,
  //     aspectRatio: aspectRatio.label,
  //     resolution: resolution.value,
  //     width,
  //     height: heightPx,
  //   };
  //   setPayload(payload);
  //   setShowLoader(true);
  //   console.log("🔹 Sending payload:", payload);

  //   try {
  //     const res = await apiFetch(`/ai/generate`, {
  //       method: "POST",
  //       body: JSON.stringify(payload),
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const data = await res.json();
  //     console.log("✅ AI Generated Response:", data);
  //   } catch (error) {
  //     console.error("❌ Error generating AI image:", error);
  //   }
  // };
  const handleSearch = async () => {
    if (!search.trim()) return;

    // 🛑 Prevent starting a new loader if one is already running
    if (showLoader) return;

    const payload = {
      query: search,
      aspectRatio: aspectRatio.label,
      resolution: resolution.value,
      width,
      height: heightPx,
    };

    console.log("🚀 Sending payload:", payload);
    setPayload(payload);
    setShowLoader(true); // triggers EnhanceLoader
  };



  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const addDoubleQuotes = () => setSearch((prev) => prev + ' " "');
  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const handleAspectSelect = (item) => {
    setAspectRatio(item);
    if (item.w && item.h) {
      setWidth(String(item.w));
      setHeightPx(String(item.h));
    }
  };

  const openQuoteModal = () => {
    setQuoteInput('""');
    setIsQuoteModalVisible(true);
    setTimeout(() => {
      if (quoteInputRef.current) {
        quoteInputRef.current.focus();
        quoteInputRef.current.setNativeProps({ selection: { start: 1, end: 1 } });
      }
    }, 100);
  };
  // add another "" inside modal
  const addQuotesInModal = () => {
    const cursorPosition = quoteInputRef.current?._lastNativeSelection?.start || quoteInput.length;
    const newText =
      quoteInput.slice(0, cursorPosition) + '""' + quoteInput.slice(cursorPosition);
    setQuoteInput(newText);
    setTimeout(() => {
      quoteInputRef.current?.setNativeProps({
        selection: { start: cursorPosition + 1, end: cursorPosition + 1 },
      });
    }, 50);
  };

  // insert text into main input
  const insertQuoteText = () => {
    setSearch((prev) => `${prev} ${quoteInput}`);
    setIsQuoteModalVisible(false);
  };


  return (
    <TouchableWithoutFeedback>
      <View style={{ paddingHorizontal: 16 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.newBadge}>
            <Text style={styles.newText}>New</Text>
          </View>
          <Text style={styles.title}>Design cards with AI magic</Text>
        </View>

        {/* Input + Toolbar */}
        {/* ========== MAIN ZONE (Step 1) ========== */}
        <TourGuideZone
          zone={1}
          shape="rectangle"
          borderRadius={12}
          maskOffset={10}
          keepTooltipPosition
          zonePadding={12}
        >
          <View style={styles.container} onLayout={() => setLayoutReady(true)}>

            {/* ======= INPUT FIELD (Step 2) ======= */}
            <TourGuideZone
              zone={2}
              shape="rectangle"
              maskOffset={10}
              borderRadius={12}
              keepTooltipPosition
              zonePadding={10}
            >
              <View style={styles.searchBar}>
                <TextInput
                  ref={inputFieldRef}
                  style={styles.input}
                  placeholder="Describe your card design..."
                  placeholderTextColor={colors.mutedText}
                  value={search}
                  onChangeText={setSearch}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </TourGuideZone>

            {/* ======= TOOLBAR ROW ======= */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 }}>
              <View style={[styles.toolbar, { alignItems: "center" }]}>

                {/* 🖼️ IMAGE BUTTON (Step 3) */}
                <TourGuideZone
                  zone={3}
                  shape="rectangle"
                  borderRadius={12}
                  maskOffset={6}
                  keepTooltipPosition
                  zonePadding={6}
                >
                  <TouchableOpacity ref={imageBtnRef} style={styles.iconBtn} onPress={pickImage}>
                    <Ionicons name="image-outline" size={18} color={colors.mutedText} />
                  </TouchableOpacity>
                </TourGuideZone>

                {/* ✨ QUOTE BUTTON (Step 4) */}
                <TourGuideZone
                  zone={4}
                  shape="rectangle"
                  borderRadius={12}
                  maskOffset={6}
                  keepTooltipPosition
                  zonePadding={6}
                >
                  <TouchableOpacity ref={quoteBtnRef} style={styles.iconBtn} onPress={openQuoteModal}>
                    <Text style={styles.quoteText}>“T”</Text>
                  </TouchableOpacity>
                </TourGuideZone>

                {/* ➕ SETTINGS BUTTON (Step 5) */}
                <TourGuideZone
                  zone={5}
                  shape="rectangle"
                  borderRadius={12}
                  maskOffset={6}
                  keepTooltipPosition
                  zonePadding={6}
                >
                  <TouchableOpacity style={styles.iconBtn} onPress={toggleModal}>
                    <Ionicons name="add" size={20} color={colors.mutedText} />
                  </TouchableOpacity>
                </TourGuideZone>
              </View>
              <View>
                {/* 🚀 GO BUTTON (Step 6) */}
                <TourGuideZone
                  zone={6}
                  shape="circle"
                  maskOffset={6}
                  keepTooltipPosition
                  zonePadding={6}
                >
                  <TouchableOpacity
                    style={[
                      styles.goButton,
                      isTyping
                        ? { backgroundColor: colors.text, borderColor: colors.text }
                        : { backgroundColor: colors.border, borderColor: colors.border },
                    ]}
                    onPress={handleSearch}
                  >
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color={isTyping ? colors.bodybackground : colors.text}
                    />
                  </TouchableOpacity>
                </TourGuideZone>
              </View>

            </View>
            {selectedImage && (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={{ color: "black", fontSize: 12 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TourGuideZone>

        {/* Model for "T" */}
        <AnimatePresence>
          {isQuoteModalVisible && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "timing", duration: 200 }}
              style={styles.quoteOverlay}
            >
              <MotiView
                from={{ translateY: 300, opacity: 0 }}
                animate={{ translateY: 0, opacity: 1 }}
                exit={{ translateY: 300, opacity: 0 }}
                transition={{ type: "timing", duration: 400 }}
                style={styles.quoteModal}
              >
                {/* Close Button (Top Right) */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsQuoteModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Insert Quoted Text</Text>

                <TextInput
                  ref={quoteInputRef}
                  placeholder="Describe your card design..."
                  placeholderTextColor={colors.mutedText}
                  style={styles.quoteInputField}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={quoteInput}
                  onChangeText={setQuoteInput}
                />

                <View style={styles.quoteButtonsRow}>
                  <TouchableOpacity style={styles.iconBtn} onPress={addQuotesInModal}>
                    <Text style={styles.quoteText}>“T”</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.iconBtn, { backgroundColor: colors.mutedText }]}
                    onPress={insertQuoteText}
                  >
                    <Text style={{ color: colors.bodybackground, fontWeight: "700" }}>
                      Insert
                    </Text>
                  </TouchableOpacity>
                </View>
              </MotiView>
            </MotiView>
          )}
        </AnimatePresence>


        {/* Settings Modal (keep your existing modal content) */}
        <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Adjust Image Settings</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Aspect Ratios</Text>
                <View style={styles.row}>
                  {aspectRatios.map((item) => {
                    const isSelected = aspectRatio.label === item.label;
                    return (
                      <TouchableOpacity
                        key={item.label}
                        onPress={() => handleAspectSelect(item)}
                        style={[styles.optionBtn, isSelected && styles.optionSelected]}
                      >
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={18}
                          color={isSelected ? "#fff" : "#bbb"}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={{ color: isSelected ? "#fff" : "#bbb", fontWeight: isSelected ? "700" : "500" }}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* custom size + resolution UI (unchanged) */}
                <View style={styles.sizeBox}>
                  <Text style={styles.sizeLabel}>Custom Size (px):</Text>
                  <View style={styles.sizeRow}>
                    <View style={styles.sizeInputContainer}>
                      <Text style={styles.sizeInputLabel}>W</Text>
                      <TextInput style={styles.sizeInput} keyboardType="numeric" value={width} onChangeText={setWidth} />
                    </View>
                    <Text style={styles.xText}>×</Text>
                    <View style={styles.sizeInputContainer}>
                      <Text style={styles.sizeInputLabel}>H</Text>
                      <TextInput style={styles.sizeInput} keyboardType="numeric" value={heightPx} onChangeText={setHeightPx} />
                    </View>
                  </View>
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Resolution</Text>
                <View style={styles.row}>
                  {resolutions.map((r) => (
                    <TouchableOpacity
                      key={r.value}
                      style={[styles.optionBtn, resolution.value === r.value && styles.optionSelected]}
                      onPress={() => setResolution(r)}
                    >
                      <Text style={styles.optionText}>{r.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {showLoader && (
          <EnhanceLoader
            userId={"123"}
            modelUsed="flux/cardify-v1"
            payload={payload}
            onFinish={() => setShowLoader(false)} 
          />
        )}


      </View>

    </TouchableWithoutFeedback>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginRight: 8,
  },
  newText: { color: colors.text, fontSize: 12, fontWeight: "bold" },
  title: { fontSize: 18, fontWeight: "600", color: colors.text },
  container: {
    backgroundColor: colors.cardsbackground,
    paddingTop: 16,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchBar: { flexDirection: "row", marginBottom: 10 },
  input: { flex: 1, padding: 10, color: colors.text, fontSize: 15, height: 80 },
  toolbar: { flexDirection: "row", alignItems: "center" },
  iconBtn: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  quoteText: { color: colors.mutedText, fontWeight: "bold", fontSize: 15 },
  // "T" model styling
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 4,
  },
  quoteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end", // bottom slide
  },
  quoteModal: {
    backgroundColor: colors.cardsbackground, marginHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 220,
  },
  quoteInputField: {
    backgroundColor: colors.cardsbackground,
    borderRadius: 10,
    padding: 10,
    color: colors.text,
    fontSize: 15,
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,
  },
  quoteButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goButton: {
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  imageWrapper: { position: "relative", width: 50, height: 50, marginVertical: 10 },
  previewImage: { width: 50, height: 50, borderRadius: 8 },
  removeIcon: {
    position: "absolute",
    top: -7,
    right: -7,
    backgroundColor: colors.text,
    borderRadius: 10,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.cardsbackground,
    borderWidth: 1,
    borderColor: colors.border,
    height: height * 0.6,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 18,
    right: 15,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 6,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 0,
  },
  sectionTitle: { color: colors.text, fontSize: 15, marginVertical: 8, fontWeight: "500" },
  row: { flexDirection: "row", flexWrap: "wrap" },
  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardsbackground,
    flexDirection: "row",
    alignItems: "center",
  },
  optionSelected: { borderColor: colors.text },
  optionText: { color: colors.text, fontSize: 14 },
  sizeBox: {
    marginTop: 12,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sizeLabel: { color: colors.mutedText, marginBottom: 4, fontSize: 14 },
  sizeRow: { flexDirection: "row", alignItems: "center" },
  sizeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardsbackground,
    borderRadius: 8,
    paddingHorizontal: 8,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sizeInputLabel: { color: colors.text, fontWeight: "600", fontSize: 13, marginRight: 6 },
  sizeInput: {
    flex: 1,
    color: colors.mutedText,
    paddingVertical: 6,
    marginVertical: 3,
    borderRadius: 5,
    fontSize: 14,
    textAlign: "center",
  },
  xText: { color: colors.mutedText, marginHorizontal: 10, fontSize: 16, fontWeight: "600" },
  doneButton: { marginTop: 25 },
  doneBtnGradient: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  doneText: { color: colors.text, fontSize: 16, fontWeight: "700" },
});



// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   TouchableWithoutFeedback,
//   Dimensions,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { MotiView, AnimatePresence } from "moti";
// import { apiFetch } from "../../apiFetch";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// const aspectRatios = [
//   { label: "Auto", w: "", h: "" },
//   { label: "1:1", w: 1024, h: 1024, icon: "square-outline" },
//   { label: "16:9", w: 1920, h: 1080, icon: "rectangle-outline" },
//   { label: "9:16", w: 1080, h: 1920, icon: "cellphone" },
//   { label: "3:2", w: 1536, h: 1024, icon: "rectangle" },
//   { label: "2:3", w: 1024, h: 1536, icon: "tablet-cellphone" },
// ];

// const resolutions = [
//   { label: "720p", value: "720p" },
//   { label: "1080p", value: "1080p" },
//   { label: "2K", value: "2k" },
//   { label: "4K", value: "4k" },
// ];

// const DEFAULT_WIDTH = "1296";
// const DEFAULT_HEIGHT = "2728";

// const steps = [
//   { key: "input", heading: "Describe Your Idea", text: "Start by describing your card concept or design theme here." },
//   { key: "image", heading: "Add Image Reference", text: "Upload or pick an image to inspire the AI design." },
//   { key: "aspect", heading: "Choose Aspect Ratio", text: "Adjust how wide or tall your design should be." },
//   { key: "resolution", heading: "Select Resolution", text: "Pick the image resolution for better quality." },
//   { key: "generate", heading: "Generate Design", text: "Tap this arrow to bring your card idea to life!" },
// ];

// const SearchHeader = () => {
//   const [search, setSearch] = useState("");
//   const [aspectRatio, setAspectRatio] = useState(aspectRatios[0]);
//   const [resolution, setResolution] = useState(resolutions[2]);
//   const [width, setWidth] = useState(DEFAULT_WIDTH);
//   const [height, setHeight] = useState(DEFAULT_HEIGHT);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [activeFilter, setActiveFilter] = useState(null);
//   const [guideIndex, setGuideIndex] = useState(null);
//   const [positions, setPositions] = useState({});

//   const inputRef = useRef(null);
//   const imageRef = useRef(null);
//   const aspectRef = useRef(null);
//   const resolutionRef = useRef(null);
//   const generateRef = useRef(null);

//   // Measure element positions dynamically
//   const handleLayout = (key, event) => {
//     const { x, y, width, height } = event.nativeEvent.layout;
//     setPositions((prev) => ({
//       ...prev,
//       [key]: { x, y, width, height },
//     }));
//   };

//   useEffect(() => {
//     (async () => {
//       const hasSeen = await AsyncStorage.getItem("hasSeenGuide");
//       if (!hasSeen) setGuideIndex(0);
//     })();
//   }, []);

//   const nextGuideStep = async () => {
//     if (guideIndex < steps.length - 1) {
//       setGuideIndex((prev) => prev + 1);
//     } else {
//       setGuideIndex(null);
//       await AsyncStorage.setItem("hasSeenGuide", "true");
//     }
//   };

//   const handleSearch = async () => {
//     const payload = {
//       query: search,
//       aspectRatio: aspectRatio.label,
//       resolution: resolution.value,
//       width,
//       height,
//     };
//     console.log("🔹 Sending payload:", payload);

//     try {
//       const res = await apiFetch(`/ai/generate`, {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await res.json();
//       console.log("✅ AI Generated Response:", data);
//       setSearch("");
//       setAspectRatio(aspectRatios[0]);
//       setResolution(resolutions[2]);
//       setWidth(DEFAULT_WIDTH);
//       setHeight(DEFAULT_HEIGHT);
//       setSelectedImage(null);
//       setActiveFilter(null);
//     } catch (error) {
//       console.error("❌ Error generating AI image:", error);
//     }
//   };

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });
//     if (!result.canceled) setSelectedImage(result.assets[0].uri);
//   };

//   const handleAspectSelect = (item) => {
//     setAspectRatio(item);
//     if (item.w && item.h) {
//       setWidth(String(item.w));
//       setHeight(String(item.h));
//     }
//   };

//   const handleResolutionSelect = (r) => setResolution(r);
//   const addDoubleQuotes = () => setSearch((prev) => prev + ' " "');

//   const toggleFilter = (type) => {
//     setActiveFilter((prev) => (prev === type ? null : type));
//   };

//   const getTooltipPosition = (key) => {
//     const pos = positions[key];
//     if (!pos) return { top: 100, left: 20 };

//     const tooltipWidth = SCREEN_WIDTH * 0.8;
//     let left = pos.x;
//     if (left + tooltipWidth > SCREEN_WIDTH - 10) left = SCREEN_WIDTH - tooltipWidth - 20;

//     return { top: pos.y + pos.height + 8, left };
//   };

//   return (
//     <TouchableWithoutFeedback onPress={() => setActiveFilter(null)}>
//       <View style={{ paddingHorizontal: 16 }}>
//         {/* Header */}
//         <View style={styles.headerRow}>
//           <View style={styles.newBadge}>
//             <Text style={styles.newText}>New</Text>
//           </View>
//           <Text style={styles.title}>Design cards with AI magic</Text>
//         </View>

//         <View style={styles.container}>
//           {/* Input + Go Button */}
//           <View style={styles.searchBar} onLayout={(e) => handleLayout("input", e)} ref={inputRef}>
//             <TextInput
//               style={styles.input}
//               placeholder="Describe your card design..."
//               placeholderTextColor="#aaa"
//               value={search}
//               onChangeText={setSearch}
//               multiline
//               numberOfLines={3}
//               textAlignVertical="top"
//             />
//             <View>
//               <TouchableOpacity
//                 style={styles.goButton}
//                 onPress={handleSearch}
//                 onLayout={(e) => handleLayout("generate", e)}
//                 ref={generateRef}
//               >
//                 <Ionicons name="arrow-forward" size={18} color="#000" />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Toolbar */}
//           <View style={styles.toolbar}>
//             <TouchableOpacity
//               style={styles.iconBtn}
//               onPress={pickImage}
//               onLayout={(e) => handleLayout("image", e)}
//               ref={imageRef}
//             >
//               <Ionicons name="image-outline" size={18} color="#fff" />
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.iconBtn}
//               onPress={() => toggleFilter("aspect")}
//               onLayout={(e) => handleLayout("aspect", e)}
//               ref={aspectRef}
//             >
//               <MaterialCommunityIcons name="aspect-ratio" size={18} color="#fff" />
//               <Text style={styles.btnLabel}>{aspectRatio.label}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.iconBtn}
//               onPress={() => toggleFilter("resolution")}
//               onLayout={(e) => handleLayout("resolution", e)}
//               ref={resolutionRef}
//             >
//               <MaterialCommunityIcons name="monitor" size={18} color="#fff" />
//               <Text style={styles.btnLabel}>{resolution.label}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.iconBtn} onPress={addDoubleQuotes}>
//               <Text style={styles.quoteText}>“T”</Text>
//             </TouchableOpacity>

//             {selectedImage && (
//               <View style={styles.imageWrapper}>
//                 <Image source={{ uri: selectedImage }} style={styles.previewImage} />
//                 <TouchableOpacity
//                   style={styles.removeIcon}
//                   onPress={() => setSelectedImage(null)}
//                 >
//                   <Text style={{ color: "white", fontSize: 12 }}>✕</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>

//           {/* Aspect Ratio Dropdown */}
//           {activeFilter === "aspect" && (
//             <View style={styles.dropdown}>
//               <Text style={styles.dropdownHeading}>Image Dimensions</Text>
//               <View style={styles.row}>
//                 {aspectRatios.map((item) => {
//                   const isSelected = aspectRatio.label === item.label;
//                   return (
//                     <TouchableOpacity
//                       key={item.label}
//                       onPress={() => handleAspectSelect(item)}
//                       style={[
//                         styles.optionBtn,
//                         isSelected && styles.optionSelected,
//                       ]}
//                     >
//                       <MaterialCommunityIcons
//                         name={item.icon}
//                         size={18}
//                         color={isSelected ? "#fff" : "#bbb"}
//                         style={{ marginRight: 6 }}
//                       />
//                       <Text
//                         style={[
//                           styles.optionText,
//                           { color: isSelected ? "#fff" : "#bbb" },
//                         ]}
//                       >
//                         {item.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>

//               <View style={styles.sizeBox}>
//                 <Text style={styles.sizeLabel}>Custom Size (px):</Text>
//                 <View style={styles.sizeRow}>
//                   <View style={styles.sizeInputContainer}>
//                     <Text style={styles.sizeInputLabel}>W</Text>
//                     <TextInput
//                       style={styles.sizeInput}
//                       keyboardType="numeric"
//                       value={width}
//                       onChangeText={setWidth}
//                     />
//                   </View>
//                   <Text style={styles.xText}>×</Text>
//                   <View style={styles.sizeInputContainer}>
//                     <Text style={styles.sizeInputLabel}>H</Text>
//                     <TextInput
//                       style={styles.sizeInput}
//                       keyboardType="numeric"
//                       value={height}
//                       onChangeText={setHeight}
//                     />
//                   </View>
//                 </View>
//               </View>
//             </View>
//           )}

//           {/* Resolution Dropdown */}
//           {activeFilter === "resolution" && (
//             <View style={styles.dropdown}>
//               <Text style={styles.dropdownHeading}>Resolutions</Text>
//               {resolutions.map((r) => (
//                 <TouchableOpacity
//                   key={r.value}
//                   style={[
//                     styles.optionBtn,
//                     resolution.value === r.value && styles.optionSelected,
//                   ]}
//                   onPress={() => handleResolutionSelect(r)}
//                 >
//                   <Text style={styles.optionText}>{r.label}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View>

//         {/* Tooltip System */}
//         <AnimatePresence>
//           {guideIndex !== null && (
//             <MotiView
//               key={guideIndex}
//               from={{ opacity: 0, translateY: 10 }}
//               animate={{ opacity: 1, translateY: 0 }}
//               exit={{ opacity: 0 }}
//               transition={{ type: "timing", duration: 300 }}
//               style={[
//                 styles.tooltipContainer,
//                 getTooltipPosition(steps[guideIndex].key),
//               ]}
//             >
//               <View style={styles.tooltipArrow} />
//               <Text style={styles.tooltipHeading}>{steps[guideIndex].heading}</Text>
//               <Text style={styles.tooltipText}>{steps[guideIndex].text}</Text>
//               <TouchableOpacity style={styles.nextBtn} onPress={nextGuideStep}>
//                 <Text style={styles.nextText}>
//                   {guideIndex === steps.length - 1 ? "Finish" : "Next"}
//                 </Text>
//               </TouchableOpacity>
//             </MotiView>
//           )}
//         </AnimatePresence>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default SearchHeader;


// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#1a1a1a",
//     paddingTop: 16,
//     paddingHorizontal: 10,
//     borderRadius: 14,
//     marginTop: 15,
//     borderWidth: 1,
//     borderColor: "#4d4d4d",
//   },
//   headerRow: { flexDirection: "row", alignItems: "center", marginTop: 15 },
//   newBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 50,
//     borderWidth: 1,
//     borderColor: "#ff3d9b",
//     marginRight: 8,
//   },
//   newText: { color: "white", fontSize: 12, fontWeight: "bold" },
//   title: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
//   searchBar: {
//     flexDirection: "row",
//     backgroundColor: "#1a1a1a",
//     marginBottom: 10,
//   },
//   input: {
//     flex: 1,
//     padding: 10,
//     color: "#fff",
//     fontSize: 15,
//     height: 80,
//   },
//   goButton: {
//     backgroundColor: "#fff",
//     borderRadius: 50,
//     padding: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   dropdown: {
//     backgroundColor: "#2a2b2f",
//     borderRadius: 12,
//     padding: 10,
//     marginTop: 8,
//     borderWidth: 1,
//     borderColor: "#3a3a3a",
//   },
//   dropdownHeading: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 15,
//     marginBottom: 10,
//   },
//   row: { flexDirection: "row", flexWrap: "wrap" },
//   optionBtn: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     marginRight: 6,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: "#3a3a3a",
//     backgroundColor: "#333",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   optionSelected: { borderColor: "#fff" },
//   optionText: { color: "#fff", fontSize: 14 },
//   sizeBox: {
//     marginTop: 12,
//     backgroundColor: "#2f3034",
//     borderRadius: 12,
//     padding: 10,
//   },
//   sizeLabel: { color: "#aaa", marginBottom: 4, fontSize: 14 },
//   sizeRow: { flexDirection: "row", alignItems: "center" },
//   sizeInputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#2f3034",
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#3a3a3a",
//   },
//   sizeInputLabel: {
//     color: "#bbb",
//     fontWeight: "600",
//     fontSize: 13,
//     marginRight: 6,
//   },
//   sizeInput: {
//     flex: 1,
//     backgroundColor: "transparent",
//     color: "#fff",
//     paddingVertical: 8,
//     fontSize: 14,
//     textAlign: "center",
//   },
//   xText: {
//     color: "#999",
//     marginHorizontal: 10,
//     fontSize: 16,
//     fontWeight: "600",
//   },


//   toolbar: {
//     flexDirection: "row",
//     alignItems: "center",
//     flexWrap: "wrap",
//     marginBottom: 8,
//   },
//   iconBtn: {
//     backgroundColor: "#2a2b2f",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     marginRight: 8,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: "#3a3a3a",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   btnLabel: { color: "#fff", fontSize: 13, marginLeft: 5 },
//   quoteText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
//   imageWrapper: { position: "relative" },
//   previewImage: { width: 40, height: 40, borderRadius: 8 },
//   removeIcon: {
//     position: "absolute",
//     top: -6,
//     right: -6,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     borderRadius: 10,
//     paddingHorizontal: 3,
//     paddingVertical: 1,
//   },
//   tooltipContainer: {
//     position: "absolute",
//     maxWidth: SCREEN_WIDTH * 0.8,
//     backgroundColor: "#1a1a1a",
//     borderRadius: 10,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: "#ff3d9b",
//     zIndex: 9999,
//   },
//   tooltipArrow: {
//     position: "absolute",
//     top: -8,
//     left: "50%",
//     marginLeft: -8,
//     width: 0,
//     height: 0,
//     borderLeftWidth: 8,
//     borderRightWidth: 8,
//     borderBottomWidth: 8,
//     borderStyle: "solid",
//     backgroundColor: "transparent",
//     borderLeftColor: "transparent",
//     borderRightColor: "transparent",
//     borderBottomColor: "#ff3d9b",
//   },
//   tooltipHeading: {
//     color: "#ff3d9b",
//     fontWeight: "700",
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   tooltipText: {
//     color: "#fff",
//     fontSize: 14,
//     marginBottom: 10,
//     lineHeight: 18,
//   },
//   nextBtn: {
//     backgroundColor: "#ff3d9b",
//     alignSelf: "flex-end",
//     borderRadius: 20,
//     paddingHorizontal: 14,
//     paddingVertical: 4,
//   },
//   nextText: { color: "#000", fontWeight: "600" },
// });