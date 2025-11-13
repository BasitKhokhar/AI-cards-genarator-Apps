import { colors } from "../../Themes/colors";
import { fonts } from "../../Themes/fonts";
import { AnimatePresence, MotiView } from "moti";

import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, ScrollView, Modal, Dimensions, } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useGeneration } from "../../Context/ImageGenerationContext";
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
  const { startMockGeneration } = useGeneration();
  const navigation = useNavigation();

  const [search, setSearch] = useState("");
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0]);
  const [resolution, setResolution] = useState(resolutions[2]);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [heightPx, setHeightPx] = useState(DEFAULT_HEIGHT);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const inputField = useRef(null);
  const [showGenerationBar, setShowGenerationBar] = useState(false);
  // for "T" model
  const [isQuoteModalVisible, setIsQuoteModalVisible] = useState(false);
  const [quoteInput, setQuoteInput] = useState("");
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
    if (!search.trim() || showLoader) return;
    const payload = {
      prompt: search,
      aspectRatio: aspectRatio.label,
      resolution: resolution.value,
      width,
      height: heightPx,
    };
    console.log("🚀 Starting generation:", payload);
    // Start loader + show bottom bar simultaneously
    setShowLoader(true);
    setShowGenerationBar(true);
    startMockGeneration(payload);
    setPayload(payload);
  };
  // 👇 Add this inside your component
  useEffect(() => {
    if (showGenerationBar) {
      const timer = setTimeout(() => {
        setShowGenerationBar(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showGenerationBar]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const handleAspectSelect = (item) => {
    setAspectRatio(item);
    if (item.w && item.h) {
      setWidth(String(item.w));
      setHeightPx(String(item.h));
    }
  };

  const openQuoteModal = () => {
    setQuoteInput(""); // start empty (no pre-inserted quotes)
    setIsQuoteModalVisible(true);
    setTimeout(() => {
      quoteInputRef.current?.focus();
    }, 100);
  };
  // insert text into main input
  const insertQuoteText = () => {
    if (!quoteInput.trim()) return; // ignore empty input
    const wrappedText = `"${quoteInput.trim()}"`;
    setSearch((prev) => (prev ? `${prev} ${wrappedText}` : wrappedText));
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
          <Text style={styles.title}>Make designs with AI magic</Text>
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
                  <TouchableOpacity ref={quoteBtnRef} style={[styles.iconBtn, { paddingHorizontal: 14 }]} onPress={openQuoteModal}>
                    <Text style={styles.quoteText}>T</Text>
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
                {/* ✖️ Close Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsQuoteModalVisible(false)}
                >
                  <Ionicons name="close" size={22} color="#fff" />
                </TouchableOpacity>

                {/* 🧠 Title + Subtitle */}
                <Text style={styles.modalTitle}>Add Custom Text to Image</Text>
                <Text style={styles.modalSubtitle}>
                  Type the text you want to appear on the image.
                  This text will be automatically printed when you generate the image.
                </Text>
                {/* ✍️ Input Field */}
                <TextInput
                  ref={quoteInputRef}
                  placeholder='Example: Basit Khokhar'
                  placeholderTextColor={colors.mutedText}
                  style={styles.quoteInputField}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={quoteInput}
                  onChangeText={setQuoteInput}
                />
                {/* 🚀 Insert Button */}
                <TouchableOpacity
                  style={styles.insertGradient}
                  onPress={insertQuoteText}
                  activeOpacity={0.85}
                >
                  <Text style={styles.insertText}>Add Text to Prompt</Text>
                </TouchableOpacity>
                {/* 💡 Small helper note */}
                <Text style={[styles.modalSubtitle, { marginTop: 8, fontSize: 12 }]}>
                  Example: Writing “Basit Khokhar” here will print your name
                  on the generated image, as shown in the sample.
                </Text>
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
        {/* Bottom statusbar Modal */}
        <Modal visible={showGenerationBar} transparent animationType="slide">
          <View style={styles.overlay}>
            {/* Background dismiss area */}
            <TouchableWithoutFeedback onPress={() => setShowGenerationBar(false)}>
              <View style={StyleSheet.absoluteFillObject} />
            </TouchableWithoutFeedback>

            {/* Bottom bar (non-dismissable area) */}
            <MotiView
              from={{ translateY: 100, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              exit={{ translateY: 100, opacity: 0 }}
              transition={{ type: "timing", duration: 300 }}
              style={styles.bottomBarContainer}
            >
              <View style={styles.bottomBar}>
                <Text style={styles.bottomBarText}>
                  {showLoader
                    ? "Your generation has been started."
                    : "Your image has been generated."}
                </Text>

               
                {/* Show this only when generation is completed */}
                <TouchableOpacity
                    onPress={() => {
                      setShowGenerationBar(false);
                      navigation.navigate("Assets");
                    }}
                  >
                    <Text style={styles.bottomBarLink}>Go to Assets</Text>
                  </TouchableOpacity>
                {/* {!showLoader && (
                  <TouchableOpacity
                    onPress={() => {
                      setShowGenerationBar(false);
                      navigation.navigate("Assets");
                    }}
                  >
                    <Text style={styles.bottomBarLink}>Go to Assets</Text>
                  </TouchableOpacity>
                )} */}
              </View>
            </MotiView>
          </View>
        </Modal>


        {showLoader && (
          <EnhanceLoader
            // userId={"123"}
            modelUsed="SeaDream 4.0"
            payload={payload}
            onFinish={(status) => {
              setShowLoader(false);
              if (status === "success") {
                setShowGenerationBar(true);
              }
            }}
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

  newText: {
    color: colors.text,
    fontSize: 12,
    fontFamily: fonts.medium,
  },

  title: {
    fontSize: 18,
    color: colors.text,
    fontFamily: fonts.heading,
  },

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
  input: {
    flex: 1,
    padding: 10,
    color: colors.text,
    fontSize: 15,
    height: 80,
    fontFamily: fonts.body,
  },

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

  quoteText: {
    color: colors.mutedText,
    fontFamily: fonts.medium,
    fontSize: 15,
  },

  // Modal / Overlay
  quoteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  quoteModal: {
    backgroundColor: colors.cardsbackground,
    marginHorizontal: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 250,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 10,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 6,
  },

  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontFamily: fonts.heading,
    marginBottom: 6,
    textAlign: "left",
  },

  modalSubtitle: {
    color: colors.mutedText,
    fontSize: 13,
    marginBottom: 18,
    lineHeight: 18,
    fontFamily: fonts.body,
  },

  quoteInputField: {
    backgroundColor: colors.cardsbackground,
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    fontSize: 15,
    minHeight: 90,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
    fontFamily: fonts.body,
  },

  insertButton: {
    borderRadius: 12,
    overflow: "hidden",
  },

  insertGradient: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },

  insertText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: fonts.medium,
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

  overlay: { flex: 1, justifyContent: "flex-end" },

  modalContainer: {
    backgroundColor: colors.cardsbackground,
    borderWidth: 1,
    borderColor: colors.border,
    height: height * 0.6,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    marginVertical: 8,
    fontFamily: fonts.medium,
  },

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

  optionText: { color: colors.text, fontSize: 14, fontFamily: fonts.body },

  sizeBox: {
    marginTop: 12,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sizeLabel: { color: colors.mutedText, marginBottom: 4, fontSize: 14, fontFamily: fonts.light },

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

  sizeInputLabel: { color: colors.text, fontFamily: fonts.medium, fontSize: 13, marginRight: 6 },

  sizeInput: {
    flex: 1,
    color: colors.mutedText,
    paddingVertical: 6,
    marginVertical: 3,
    borderRadius: 5,
    fontSize: 14,
    textAlign: "center",
    fontFamily: fonts.body,
  },

  xText: { color: colors.mutedText, marginHorizontal: 10, fontSize: 16, fontFamily: fonts.medium },

  doneButton: { marginTop: 25 },

  doneBtnGradient: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },

  doneText: { color: colors.text, fontSize: 16, fontFamily: fonts.heading },

  bottomBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  bottomBar: {
    backgroundColor: colors.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 25,
    paddingHorizontal: 18,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  bottomBarText: { color: "#fff", fontSize: 14, fontFamily: fonts.body },
  bottomBarLink: {
    color: "#fff",
    // textDecorationLine: "underline",
    fontSize: 14,
    fontWeight: '800',
    fontFamily: fonts.medium,
  },
});

