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
        {/* 🔹 Header */}
        <View style={styles.headerRow}>
          <View style={styles.newBadge}>
            <Text style={styles.newText}>New</Text>
          </View>
          <Text style={styles.title}>Design cards with AI magic</Text>
        </View>

        {/* 🔹 Input + Toolbar */}
        <View style={styles.container}>
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
              <Text style={styles.btnLabel}>{aspectRatio.label}</Text>
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

          {/* 🔹 Aspect Ratio Dropdown */}
          {activeFilter === "aspect" && (
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownHeading}>Image Dimensions</Text>

                <View style={styles.row}>
                  {aspectRatios.map((item) => {
                    const isSelected = aspectRatio.label === item.label;
                    return (
                      <TouchableOpacity
                        key={item.label}
                        onPress={() => handleAspectSelect(item)}
                        style={[
                          styles.optionBtn,
                          isSelected && styles.optionSelected,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={18}
                          color={isSelected ? "#fff" : "#bbb"}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.optionText,
                            { color: isSelected ? "#fff" : "#bbb" },
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

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

          {/* 🔹 Resolution Dropdown */}
          {activeFilter === "resolution" && (
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownHeading}>Resolutions</Text>
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
    paddingTop: 16,
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
    paddingLeft: 0,
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
  dropdown: {
    backgroundColor: "#2a2b2f",
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  dropdownHeading: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 10,
  },
  row: { flexDirection: "row", flexWrap: "wrap" },
  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    backgroundColor: "#333",
    flexDirection: "row",
    alignItems: "center",
  },
  optionSelected: { borderColor: "#fff" },
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
