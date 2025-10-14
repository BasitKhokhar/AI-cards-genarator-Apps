// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   TouchableWithoutFeedback,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { apiFetch } from "../../apiFetch";

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

// const SearchHeader = () => {
//   const [search, setSearch] = useState("");
//   const [aspectRatio, setAspectRatio] = useState(aspectRatios[0]);
//   const [resolution, setResolution] = useState(resolutions[2]);
//   const [width, setWidth] = useState(DEFAULT_WIDTH);
//   const [height, setHeight] = useState(DEFAULT_HEIGHT);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [activeFilter, setActiveFilter] = useState(null);
//   const inputField = useRef(null);

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
//       inputField.current?.blur();
//     } catch (error) {
//       console.error("❌ Error generating AI image:", error);
//     }
//   };

//   const toggleFilter = (type) => {
//     setActiveFilter((prev) => (prev === type ? null : type));
//   };

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });
//     if (!result.canceled) {
//       setSelectedImage(result.assets[0].uri);
//     }
//   };

//   const handleAspectSelect = (item) => {
//     setAspectRatio(item);
//     if (item.w && item.h) {
//       setWidth(String(item.w));
//       setHeight(String(item.h));
//     }
//   };

//   const handleResolutionSelect = (r) => {
//     setResolution(r);
//   };

//   const addDoubleQuotes = () => {
//     setSearch((prev) => prev + ' " "');
//   };

//   return (
//     <TouchableWithoutFeedback onPress={() => setActiveFilter(null)}>
//       <View style={{ paddingHorizontal: 16 }}>
//         {/* 🔹 Header */}
//         <View style={styles.headerRow}>
//           <View style={styles.newBadge}>
//             <Text style={styles.newText}>New</Text>
//           </View>
//           <Text style={styles.title}>Design cards with AI magic</Text>
//         </View>

//         {/* 🔹 Input + Toolbar */}
//         <View style={styles.container}>
//           <View style={styles.searchBar}>
//             <TextInput
//               ref={inputField}
//               style={styles.input}
//               placeholder="Describe your card design..."
//               placeholderTextColor="#aaa"
//               value={search}
//               onChangeText={setSearch}
//               multiline={true}
//               numberOfLines={3}
//               textAlignVertical="top"
//             />
//             <View>
//               <TouchableOpacity style={styles.goButton} onPress={handleSearch}>
//                 <Ionicons name="arrow-forward" size={18} color="black" />
//               </TouchableOpacity>
//             </View>

//           </View>

//           <View style={styles.toolbar}>
//             <TouchableOpacity style={styles.iconBtn} onPress={pickImage}>
//               <Ionicons name="image-outline" size={18} color="#fff" />
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.iconBtn}
//               onPress={() => toggleFilter("aspect")}
//             >
//               <MaterialCommunityIcons
//                 name="aspect-ratio"
//                 size={18}
//                 color="#fff"
//               />
//               <Text style={styles.btnLabel}>{aspectRatio.label}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.iconBtn}
//               onPress={() => toggleFilter("resolution")}
//             >
//               <MaterialCommunityIcons name="monitor" size={18} color="#fff" />
//               <Text style={styles.btnLabel}>{resolution.label}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.iconBtn} onPress={addDoubleQuotes}>
//               <Text style={styles.quoteText}>“T”</Text>
//             </TouchableOpacity>

//             {selectedImage && (
//               <View style={styles.imageWrapper}>
//                 <Image
//                   source={{ uri: selectedImage }}
//                   style={styles.previewImage}
//                 />
//                 <TouchableOpacity
//                   style={styles.removeIcon}
//                   onPress={() => setSelectedImage(null)}
//                 >
//                   <Text style={{ color: "white", fontSize: 12 }}>✕</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>

//           {/* 🔹 Aspect Ratio Dropdown */}
//           {activeFilter === "aspect" && (
//             <TouchableWithoutFeedback>
//               <View style={styles.dropdown}>
//                 <Text style={styles.dropdownHeading}>Image Dimensions</Text>

//                 <View style={styles.row}>
//                   {aspectRatios.map((item) => {
//                     const isSelected = aspectRatio.label === item.label;
//                     return (
//                       <TouchableOpacity
//                         key={item.label}
//                         onPress={() => handleAspectSelect(item)}
//                         style={[
//                           styles.optionBtn,
//                           isSelected && styles.optionSelected,
//                         ]}
//                       >
//                         <MaterialCommunityIcons
//                           name={item.icon}
//                           size={18}
//                           color={isSelected ? "#fff" : "#bbb"}
//                           style={{ marginRight: 6 }}
//                         />
//                         <Text
//                           style={[
//                             styles.optionText,
//                             { color: isSelected ? "#fff" : "#bbb" },
//                           ]}
//                         >
//                           {item.label}
//                         </Text>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </View>

//                 <View style={styles.sizeBox}>
//                   <Text style={styles.sizeLabel}>Custom Size (px):</Text>
//                   <View style={styles.sizeRow}>
//                     <View style={styles.sizeInputContainer}>
//                       <Text style={styles.sizeInputLabel}>W</Text>
//                       <TextInput
//                         style={styles.sizeInput}
//                         keyboardType="numeric"
//                         value={width}
//                         onChangeText={setWidth}
//                         placeholder="Width"
//                         placeholderTextColor="#777"
//                       />
//                     </View>

//                     <Text style={styles.xText}>×</Text>

//                     <View style={styles.sizeInputContainer}>
//                       <Text style={styles.sizeInputLabel}>H</Text>
//                       <TextInput
//                         style={styles.sizeInput}
//                         keyboardType="numeric"
//                         value={height}
//                         onChangeText={setHeight}
//                         placeholder="Height"
//                         placeholderTextColor="#777"
//                       />
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             </TouchableWithoutFeedback>
//           )}

//           {/* 🔹 Resolution Dropdown */}
//           {activeFilter === "resolution" && (
//             <TouchableWithoutFeedback>
//               <View style={styles.dropdown}>
//                 <Text style={styles.dropdownHeading}>Resolutions</Text>
//                 {resolutions.map((r) => (
//                   <TouchableOpacity
//                     key={r.value}
//                     style={[
//                       styles.optionBtn,
//                       resolution.value === r.value && styles.optionSelected,
//                     ]}
//                     onPress={() => handleResolutionSelect(r)}
//                   >
//                     <Text style={styles.optionText}>{r.label}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </TouchableWithoutFeedback>
//           )}
//         </View>
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
//     paddingLeft: 0,
//     color: "#fff",
//     fontSize: 15,
//     height: 80,
//   },
//   goButton: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 50,
//     padding: 8,
//     justifyContent: "center",
//     alignItems: "center",
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
// });
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import { apiFetch } from "../../apiFetch";

const { width, height } = Dimensions.get("window");

const aspectRatios = [
  { label: "Auto", w: "", h: "" },
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
  const [widthVal, setWidthVal] = useState(DEFAULT_WIDTH);
  const [heightVal, setHeightVal] = useState(DEFAULT_HEIGHT);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  const inputField = useRef(null);

  const guideSteps = [
    { title: "Enter your idea ✏️", text: "Type your card design idea here.", target: "input" },
    { title: "Add reference image 🖼️", text: "Tap to upload a reference image.", target: "image" },
    { title: "Adjust aspect ratio ⚙️", text: "Change proportions for your image.", target: "aspect" },
    { title: "Set resolution 📏", text: "Select the image output quality.", target: "resolution" },
    { title: "Generate with AI ⚡", text: "Tap this arrow to create your design.", target: "generate" },
  ];

  useEffect(() => {
    const checkGuideStatus = async () => {
      const seen = await AsyncStorage.getItem("hasSeenGuide");
      if (!seen) setShowGuide(true);
    };
    checkGuideStatus();
  }, []);

  const handleNext = async () => {
    if (guideStep < guideSteps.length - 1) {
      setGuideStep((prev) => prev + 1);
    } else {
      await AsyncStorage.setItem("hasSeenGuide", "true");
      setShowGuide(false);
    }
  };

  const handlePrev = () => {
    if (guideStep > 0) setGuideStep((prev) => prev - 1);
  };

  const handleSearch = async () => {
    const payload = {
      query: search,
      aspectRatio: aspectRatio.label,
      resolution: resolution.value,
      width: widthVal,
      height: heightVal,
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
      setWidthVal(DEFAULT_WIDTH);
      setHeightVal(DEFAULT_HEIGHT);
      setSelectedImage(null);
      setActiveFilter(null);
      inputField.current?.blur();
    } catch (error) {
      console.error("❌ Error generating AI image:", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const addDoubleQuotes = () => setSearch((prev) => prev + ' " "');

  // 🔹 Tooltip target coordinates
  const tooltipPositions = {
    input: { top: 150, left: 20, arrow: "up" },
    image: { top: 260, left: 40, arrow: "up" },
    aspect: { top: 260, left: 130, arrow: "up" },
    resolution: { top: 260, left: 240, arrow: "up" },
    generate: { top: 160, right: 20, arrow: "up" },
  };

  const currentTooltip = tooltipPositions[guideSteps[guideStep].target];

  // 🔹 Adaptive positioning logic
  const tooltipBoxStyle = {
    position: "absolute",
    top:
      currentTooltip.arrow === "up"
        ? currentTooltip.top + 40
        : Math.max(40, currentTooltip.top - 140),
    left: currentTooltip.left ?? undefined,
    right: currentTooltip.right ?? undefined,
    maxWidth: width * 0.85,
  };

  return (
    <TouchableWithoutFeedback onPress={() => setActiveFilter(null)}>
      <View style={{ paddingHorizontal: 16 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.newBadge}>
            <Text style={styles.newText}>New</Text>
          </View>
          <Text style={styles.title}>Design cards with AI magic</Text>
        </View>

        {/* Input + Toolbar */}
        <View style={styles.container}>
          <View style={styles.searchBar}>
            <TextInput
              ref={inputField}
              style={styles.input}
              placeholder="Describe your card design..."
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={setSearch}
              multiline
            />
            <TouchableOpacity style={styles.goButton} onPress={handleSearch}>
              <Ionicons name="arrow-forward" size={18} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.toolbar}>
            <TouchableOpacity style={styles.iconBtn} onPress={pickImage}>
              <Ionicons name="image-outline" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setActiveFilter("aspect")}
            >
              <MaterialCommunityIcons name="aspect-ratio" size={18} color="#fff" />
              <Text style={styles.btnLabel}>{aspectRatio.label}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setActiveFilter("resolution")}
            >
              <MaterialCommunityIcons name="monitor" size={18} color="#fff" />
              <Text style={styles.btnLabel}>{resolution.label}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={addDoubleQuotes}>
              <Text style={styles.quoteText}>“T”</Text>
            </TouchableOpacity>

            {selectedImage && (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Tooltip Overlay */}
        <AnimatePresence>
          {showGuide && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={styles.overlay}
            >
              <View style={[styles.tooltipBox, tooltipBoxStyle]}>
                <Text style={styles.tooltipTitle}>{guideSteps[guideStep].title}</Text>
                <Text style={styles.tooltipText}>{guideSteps[guideStep].text}</Text>

                <View style={styles.tooltipNav}>
                  <TouchableOpacity
                    onPress={handlePrev}
                    disabled={guideStep === 0}
                    style={[styles.navBtn, { opacity: guideStep === 0 ? 0.5 : 1 }]}
                  >
                    <Text style={styles.navText}>Previous</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                    <Text style={styles.navText}>
                      {guideStep === guideSteps.length - 1 ? "Got it!" : "Next"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Arrow dynamically positioned */}
                <View
                  style={[
                    styles.arrow,
                    currentTooltip.arrow === "up"
                      ? styles.arrowUp
                      : styles.arrowDown,
                  ]}
                />
              </View>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 14,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#4d4d4d",
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ff3d9b",
    marginRight: 8,
  },
  newText: { color: "white", fontSize: 12, fontWeight: "bold" },
  title: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    color: "#fff",
    fontSize: 15,
    height: 80,
  },
  goButton: {
    backgroundColor: "#FFFFFF",
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "rgba(0,0,0,0.65)",
    zIndex: 999,
  },
  tooltipBox: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#8b3dff",
  },
  tooltipTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  tooltipText: { color: "#ccc", fontSize: 14, marginBottom: 10 },
  tooltipNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  navBtn: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  nextBtn: {
    backgroundColor: "#8b3dff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  navText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  arrow: {
    position: "absolute",
    width: 0,
    height: 0,
    alignSelf: "center",
  },
  arrowUp: {
    top: -8,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#8b3dff",
  },
  arrowDown: {
    bottom: -8,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#8b3dff",
  },
});
