// import React, { useEffect, useState } from "react";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useNavigation } from "@react-navigation/native";
// import { LinearGradient } from "expo-linear-gradient";
// import { apiFetch } from "../../apiFetch";
// import { ScrollView } from "react-native-gesture-handler";

// const TemplateDetail = ({ route }) => {
//   const { templateId } = route.params;
//   const [template, setTemplate] = useState(null);
//   const [prompt, setPrompt] = useState("");
//   const [aspectRatio, setAspectRatio] = useState("1:1");
//   const [resolution, setResolution] = useState("512x512");
//   const [aspect, setAspect] = useState(1);

//   const [isFavourite, setIsFavourite] = useState(false);
//   const [loadingFav, setLoadingFav] = useState(false);
//   const [favouriteCount, setFavouriteCount] = useState(0);
//   const [usageCount, setUsageCount] = useState(0);

//   const navigation = useNavigation();

//   useEffect(() => {
//     const loadTemplate = async () => {
//       try {
//         const res = await apiFetch(`/cards/templates/${templateId}`, {}, navigation);
//         if (res.ok) {
//           const data = await res.json();
//           setTemplate(data);
//           setPrompt(data.prompt || "");
//           setAspectRatio(data.aspectRatio || "1:1");
//           setIsFavourite(data.isFavourite || false);
//           setFavouriteCount(data.favouriteCount || 0);
//           setUsageCount(data.usageCount || 0);
//         } else {
//           console.log("❌ Failed to load template", res.status);
//         }
//       } catch (err) {
//         console.error("⚠️ Error fetching template:", err);
//       }
//     };

//     loadTemplate();
//   }, [templateId]);

//   useEffect(() => {
//     if (template?.imageUrl) {
//       Image.getSize(template.imageUrl, (w, h) => {
//         setAspect(w / h);
//       });
//     }
//   }, [template?.imageUrl]);

//   const handleGenerate = async () => {
//     const payload = { templateId, prompt, aspectRatio, resolution };
//     console.log("📤 Payload to backend:", payload);

//     try {
//       const res = await apiFetch(
//         "/generate",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         },
//         navigation
//       );

//       if (res.ok) {
//         const result = await res.json();
//         console.log("✅ Generated result:", result);
//       } else {
//         console.log("❌ Failed to generate image");
//       }
//     } catch (err) {
//       console.error("⚠️ Error generating:", err);
//     }
//   };

//   const toggleFavourite = async () => {
//     if (loadingFav) return;
//     setLoadingFav(true);

//     try {
//       const res = await apiFetch(
//         `/favourites/${templateId}`,
//         {
//           method: isFavourite ? "DELETE" : "POST",
//           headers: { "Content-Type": "application/json" },
//         },
//         navigation
//       );

//       if (res.ok) {
//         setIsFavourite(!isFavourite);
//         setFavouriteCount((prev) => (isFavourite ? prev - 1 : prev + 1));
//       } else {
//         console.log("❌ Failed to update favourite");
//       }
//     } catch (err) {
//       console.error("⚠️ Error updating favourite:", err);
//     } finally {
//       setLoadingFav(false);
//     }
//   };

//   const formatNumber = (num) => {
//     if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
//     if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
//     return num.toString();
//   };

//   if (!template) return <Text style={{ color: "white" }}>Loading...</Text>;

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//          {/* <View style={styles.usageRow}>
//           <View style={styles.usageContainer}>
//             <Icon name="flash-on" size={18} color="#8b3dff" />
//             <Text style={styles.usageText}>{formatNumber(usageCount)} Uses</Text>
//           </View>
//         </View> */}
//         {/* Gradient Border Image */}
//         <LinearGradient
//           colors={["#8b3dff", "#ff3d9b"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.gradientBorder}
//         >
//           <Image
//             source={{ uri: template.imageUrl || "https://via.placeholder.com/200" }}
//             style={[styles.templateImage, { aspectRatio: aspect }]}
//           />

//           {/* ❤️ Heart Icon with Count */}
//           <TouchableOpacity style={styles.heartIcon} onPress={toggleFavourite}>
//             <View style={styles.heartContainer}>
//               <Icon
//                 name={isFavourite ? "favorite" : "favorite-border"}
//                 size={28}
//                 color={isFavourite ? "#ff3d9b" : "#fff"}
//               />
//               <Text style={styles.favCountText}>{formatNumber(favouriteCount)}</Text>
//             </View>
//           </TouchableOpacity>
//         </LinearGradient>

//         {/* ⚡ Usage Count (Right Side) */}
       

//         {/* 📝 Template Info */}
//         <Text style={styles.title}>{template.title}</Text>

//         <Text style={styles.label}>Edit Prompt:</Text>
//         <TextInput
//           value={prompt}
//           onChangeText={setPrompt}
//           placeholder="Edit prompt"
//           placeholderTextColor="#888"
//           style={styles.input}
//           multiline={true}
//           numberOfLines={6}
//           textAlignVertical="top"
//         />

//         <Text style={styles.label}>Aspect Ratio:</Text>
//         <Picker
//           selectedValue={aspectRatio}
//           onValueChange={setAspectRatio}
//           style={styles.picker}
//           dropdownIconColor="#8b3dff"
//         >
//           <Picker.Item label="1:1" value="1:1" />
//           <Picker.Item label="9:16" value="9:16" />
//           <Picker.Item label="16:9" value="16:9" />
//         </Picker>

//         <Text style={styles.label}>Resolution:</Text>
//         <Picker
//           selectedValue={resolution}
//           onValueChange={setResolution}
//           style={styles.picker}
//           dropdownIconColor="#8b3dff"
//         >
//           <Picker.Item label="512x512" value="512x512" />
//           <Picker.Item label="1024x1024" value="1024x1024" />
//           <Picker.Item label="2048x2048" value="2048x2048" />
//         </Picker>

//         {/* Neon Gradient Button */}
//         <TouchableOpacity style={styles.button} onPress={handleGenerate}>
//           <LinearGradient
//             colors={["#8b3dff", "#ff3d9b"]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.gradientButton}
//           >
//             <Text style={styles.buttonText}>⚡ Generate</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#0d0d0d", paddingTop: 20 },
//   scrollContent: { paddingBottom: 20, paddingTop: 10 },

//   gradientBorder: {
//     borderRadius: 14,
//     padding: 2,
//     marginBottom: 10,
//     position: "relative",
//   },
//   templateImage: {
//     width: "100%",
//     borderRadius: 12,
//     backgroundColor: "#222",
//   },

//   // ❤️ Heart and count
//   heartIcon: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     padding: 4,
//     alignItems: "center",
//   },
//   heartContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.4)",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 20,
//   },
//   favCountText: {
//     color: "#fff",
//     marginLeft: 4,
//     fontWeight: "600",
//   },

//   // ⚡ Usage Count (below image)
//   usageRow: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     marginBottom: 10,
//   },
//   usageContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   usageText: {
//     color: "white",
//     marginLeft: 5,
//     fontWeight: "500",
//   },

//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 15,
//     color: "#8b3dff",
//   },

//   label: {
//     color: "#ff3d9b",
//     marginTop: 12,
//     marginBottom: 6,
//     fontWeight: "600",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#fff",
//     padding: 12,
//     marginBottom: 15,
//     borderRadius: 8,
//     color: "white",
//     backgroundColor: "#1a1a1a",
//     minHeight: 100,
//   },
//   picker: {
//     color: "white",
//     backgroundColor: "#1a1a1a",
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   button: { marginTop: 20, borderRadius: 8, overflow: "hidden" },
//   gradientButton: {
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
// });

// export default TemplateDetail;
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { apiFetch } from "../../apiFetch";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const TemplateDetail = ({ route }) => {
  const { templateId } = route.params;
  const [template, setTemplate] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [resolution, setResolution] = useState("512x512");
  const [aspect, setAspect] = useState(1);
  const [imageSize, setImageSize] = useState({ width: screenWidth * 0.9, height: screenHeight * 0.4 });
  const [isFavourite, setIsFavourite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [favouriteCount, setFavouriteCount] = useState(0);
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [width, setWidth] = useState("1024");
  const [height, setHeight] = useState("1024");

  const navigation = useNavigation();

  const aspectRatioOptions = [
    { label: "2:3", w: 1024, h: 1536 },
    { label: "3:2", w: 1536, h: 1024 },
    { label: "1:1", w: 1024, h: 1024 },
    { label: "16:9", w: 1920, h: 1080 },
    { label: "9:16", w: 1080, h: 1920 },
  ];

  const resolutionOptions = ["512x512", "1024x1024", "2048x2048", "2K", "4K"];

  // 🔹 Fetch template
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const res = await apiFetch(`/cards/templates/${templateId}`, {}, navigation);
        if (res.ok) {
          const data = await res.json();
          setTemplate(data);
          setPrompt(data.prompt || "");
          setAspectRatio(data.aspectRatio || "1:1");
          setIsFavourite(data.isFavourite || false);
          setFavouriteCount(data.favouriteCount || 0);
        }
      } catch (err) {
        console.error("⚠️ Error fetching template:", err);
      }
    };
    loadTemplate();
  }, [templateId]);

  // 🔹 Handle dynamic image sizing
  useEffect(() => {
    if (template?.imageUrl) {
      Image.getSize(
        template.imageUrl,
        (w, h) => {
          const imgAspect = w / h;
          const maxHeight = screenHeight * 0.4; // 40% of screen height
          const maxWidth = screenWidth * 0.9; // 90% of screen width

          let finalWidth = maxWidth;
          let finalHeight = maxHeight;

          if (imgAspect > 1) {
            // Landscape: width dominant
            finalHeight = maxWidth / imgAspect;
            if (finalHeight > maxHeight) {
              finalHeight = maxHeight;
              finalWidth = maxHeight * imgAspect;
            }
          } else {
            // Portrait: height dominant
            finalWidth = maxHeight * imgAspect;
            if (finalWidth > maxWidth) {
              finalWidth = maxWidth;
              finalHeight = maxWidth / imgAspect;
            }
          }

          setImageSize({ width: finalWidth, height: finalHeight });
          setAspect(imgAspect);
        },
        (err) => console.warn("⚠️ Failed to get image size:", err)
      );
    }
  }, [template?.imageUrl]);

  const handleGenerate = async () => {
    const payload = { templateId, prompt, aspectRatio, resolution, width, height };
    console.log("📤 Payload to backend:", payload);
    try {
      const res = await apiFetch(
        "/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        navigation
      );
      if (res.ok) {
        const result = await res.json();
        console.log("✅ Generated result:", result);
      } else {
        console.log("❌ Failed to generate image");
      }
    } catch (err) {
      console.error("⚠️ Error generating:", err);
    }
  };

  const toggleFavourite = async () => {
    if (loadingFav) return;
    setLoadingFav(true);
    try {
      const res = await apiFetch(
        `/favourites/${templateId}`,
        {
          method: isFavourite ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
        },
        navigation
      );
      if (res.ok) {
        setIsFavourite(!isFavourite);
        setFavouriteCount((prev) => (isFavourite ? prev - 1 : prev + 1));
      }
    } catch (err) {
      console.error("⚠️ Error updating favourite:", err);
    } finally {
      setLoadingFav(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  };

  const selectedRatio = aspectRatioOptions.find((r) => r.label === aspectRatio);
  if (!template) return <Text style={{ color: "white" }}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 🖼️ Image Section */}
        <View style={styles.imageWrapper}>
          <View style={[styles.imageContainer, { width: imageSize.width, height: imageSize.height }]}>
            <Image
              source={{ uri: template.imageUrl || "https://via.placeholder.com/200" }}
              style={{ width: "100%", height: "100%", borderRadius: 14 }}
              resizeMode="contain"
            />

            {/* ❤️ Favourite (Dynamic top-right) */}
            <TouchableOpacity style={styles.heartIcon} onPress={toggleFavourite}>
              <View style={styles.heartContainer}>
                <Icon
                  name={isFavourite ? "favorite" : "favorite-border"}
                  size={24}
                  color={isFavourite ? "#ff3d9b" : "#fff"}
                />
                <Text style={styles.favCountText}>{formatNumber(favouriteCount)}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{template.title}</Text>

        {/* Prompt Section */}
        <View style={styles.promptBox}>
          <Text style={styles.label}>Edit Prompt</Text>
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Edit prompt..."
            placeholderTextColor="#888"
            style={styles.input}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
        {/* Aspect Ratio Section */}
        <View style={styles.section}>
          <View style={styles.flexBetween}>
            <Text style={styles.sectionTitle}>Image Dimensions</Text>
            <Text style={styles.dimText}>
              {selectedRatio ? `${selectedRatio.w} × ${selectedRatio.h}` : `${width} × ${height}`}
            </Text>
            <TouchableOpacity style={styles.customBtn} onPress={() => setShowCustomSize(!showCustomSize)}>
              <Text style={{ color: "#fff", fontSize: 12 }}>
                {showCustomSize ? "Hide" : "Custom"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            {aspectRatioOptions.map((item) => {
              const isSelected = aspectRatio === item.label;
              const iconName =
                item.label === "1:1"
                  ? "square-outline"
                  : item.label === "16:9" || item.label === "3:2"
                  ? "rectangle-outline"
                  : "rectangle";

              return (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => {
                    setAspectRatio(item.label);
                    setWidth(item.w.toString());
                    setHeight(item.h.toString());
                  }}
                  style={[styles.optionBtn, isSelected && styles.optionSelected]}
                >
                  <MaterialCommunityIcons
                    name={iconName}
                    size={18}
                    color={isSelected ? "#fff" : "#bbb"}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.optionText, { color: isSelected ? "#fff" : "#bbb" }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {showCustomSize && (
            <View style={styles.customBox}>
              <View style={styles.sizeRow}>
                <Text style={styles.sizeLabel}>W:</Text>
                <TextInput
                  style={styles.sizeInput}
                  keyboardType="numeric"
                  value={width}
                  onChangeText={setWidth}
                />
                <Text style={styles.sizeLabel}>× H:</Text>
                <TextInput
                  style={styles.sizeInput}
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                />
              </View>
            </View>
          )}
        </View>

        {/* Resolution Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resolution</Text>
          <View style={styles.row}>
            {resolutionOptions.map((res) => (
              <TouchableOpacity
                key={res}
                onPress={() => setResolution(res)}
                style={[styles.optionBtn, resolution === res && styles.optionSelected]}
              >
                <MaterialCommunityIcons
                  name={res === "4K" ? "television" : res === "2K" ? "monitor" : "image-outline"}
                  size={18}
                  color={resolution === res ? "#fff" : "#bbb"}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.optionText, { color: resolution === res ? "#fff" : "#bbb" }]}>
                  {res}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity style={styles.button} onPress={handleGenerate}>
          <LinearGradient
            colors={["#8b3dff", "#ff3d9b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>⚡ Generate</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default TemplateDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 20, paddingTop: 20 },
  scrollContent: { paddingBottom: 30 },

  imageWrapper: {
    position: "relative",
    marginBottom: 12,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: screenHeight * 0.4, // 40% of screen height
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  templateImage: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  heartIcon: { position: "absolute", top: 10, right: 10 },
  heartContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  favCountText: { color: "#fff", marginLeft: 4, fontWeight: "600" },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  promptBox: {
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#4d4d4d",
    marginTop: 10,
  },
  label: { color: "#ffff", fontWeight: "600", marginBottom: 6 },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: "#3a3a3a",
    paddingVertical: 10,
    minHeight: 100,
  },
  section: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#4d4d4d",
  },
  flexBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { color: "#fff", fontSize: 15, fontWeight: "600" },
  dimText: { color: "#aaa", fontSize: 13 },
  customBtn: {
    backgroundColor: "#2a2b2f",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff3d9b",
    marginLeft: 8,
  },
  row: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2b2f",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  optionSelected: { borderColor: "#fff" },
  optionText: { color: "#fff", fontSize: 14 },
  customBox: {
    backgroundColor: "#2f3034",
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  sizeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sizeLabel: { color: "#aaa", fontSize: 14 },
  sizeInput: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 8,
    padding: 6,
    textAlign: "center",
    width: 80,
  },
  button: { marginTop: 20, borderRadius: 10, overflow: "hidden" },
  gradientButton: { paddingVertical: 12, alignItems: "center", borderRadius: 10 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
