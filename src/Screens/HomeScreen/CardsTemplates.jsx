
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
import { colors } from "../../Themes/colors";
import { EnhanceLoader } from "../../Components/Loader/EnhancLoader";

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


const [showLoader, setShowLoader] = useState(false);


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
          const maxHeight = screenHeight * 0.4;
          const maxWidth = screenWidth * 0.9;

          let finalWidth = maxWidth;
          let finalHeight = maxHeight;

          if (imgAspect > 1) {
            finalHeight = maxWidth / imgAspect;
            if (finalHeight > maxHeight) {
              finalHeight = maxHeight;
              finalWidth = maxHeight * imgAspect;
            }
          } else {
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

  // const handleGenerate = async () => {
  //   const payload = { templateId, prompt, aspectRatio, resolution, width, height };
  //   console.log("payload sending to model backend",payload)
  //   try {
  //     const res = await apiFetch(
  //       "/generate",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       },
  //       navigation
  //     );
  //     if (res.ok) {
  //       const result = await res.json();
  //       console.log("✅ Generated result:", result);
  //     }
  //   } catch (err) {
  //     console.error("⚠️ Error generating:", err);
  //   }
  // };
const handleGenerate = async () => {
  const payload = {
    templateId,
    prompt,
    aspectRatio,
    resolution,
    width,
    height,
  };

  console.log("🚀 Starting enhancement with payload:", payload);
  setShowLoader(true);
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
  if (!template) return <Text style={{ color: colors.text }}>Loading...</Text>;

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

            <TouchableOpacity style={styles.heartIcon} onPress={toggleFavourite}>
              <View style={styles.heartContainer}>
                <Icon
                  name={isFavourite ? "favorite" : "favorite-border"}
                  size={24}
                  color={isFavourite ? colors.primary : colors.text}
                />
                <Text style={[styles.favCountText, { color: colors.text }]}>{formatNumber(favouriteCount)}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{template.title}</Text>

        <View style={[styles.promptBox, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>Edit Prompt</Text>
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Edit prompt..."
            placeholderTextColor={colors.mutedText}
            style={[styles.input, { backgroundColor: colors.cardsbackground, color: colors.mutedText }]}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}>
          <View style={styles.flexBetween}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Image Dimensions</Text>
            <Text style={[styles.dimText, { color: colors.mutedText }]}>
              {selectedRatio ? `${selectedRatio.w} × ${selectedRatio.h}` : `${width} × ${height}`}
            </Text>
            <TouchableOpacity style={styles.customBtn} onPress={() => setShowCustomSize(!showCustomSize)}>
              <Text style={{ color: colors.text, fontSize: 12 }}>{showCustomSize ? "Hide" : "Custom"}</Text>
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
                  style={[styles.optionBtn, isSelected && styles.optionSelected, { borderColor: isSelected ? colors.text : colors.secondary }]}
                >
                  <MaterialCommunityIcons
                    name={iconName}
                    size={18}
                    color={isSelected ? colors.text : colors.mutedText}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.optionText, { color: isSelected ? colors.text : colors.mutedText }]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {showCustomSize && (
            <View style={[styles.customBox, { backgroundColor: colors.secondary }]}>
              <View style={styles.sizeRow}>
                <Text style={[styles.sizeLabel, { color: colors.mutedText }]}>W:</Text>
                <TextInput
                  style={[styles.sizeInput, { backgroundColor: colors.cardsbackground, color: colors.text, borderColor: colors.border }]}
                  keyboardType="numeric"
                  value={width}
                  onChangeText={setWidth}
                />
                <Text style={[styles.sizeLabel, { color: colors.mutedText }]}>× H:</Text>
                <TextInput
                  style={[styles.sizeInput, { backgroundColor: colors.cardsbackground, color: colors.text, borderColor: colors.border }]}
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                />
              </View>
            </View>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Resolution</Text>
          <View style={styles.row}>
            {resolutionOptions.map((res) => (
              <TouchableOpacity
                key={res}
                onPress={() => setResolution(res)}
                style={[styles.optionBtn, resolution === res && styles.optionSelected, { borderColor: resolution === res ? colors.text : colors.secondary }]}
              >
                <MaterialCommunityIcons
                  name={res === "4K" ? "television" : res === "2K" ? "monitor" : "image-outline"}
                  size={18}
                  color={resolution === res ? colors.text : colors.mutedText}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.optionText, { color: resolution === res ? colors.text : colors.mutedText }]}>{res}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGenerate}>
          <LinearGradient
            colors={colors.gradients.ocean} // ✅ using gradient from colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>⚡ Generate</Text>
          </LinearGradient>
        </TouchableOpacity>
        {showLoader && (
  <EnhanceLoader
    userId={"123"} // or your actual logged-in user ID
    modelUsed="flux/cardify-v1"
    payload={{
      templateId,
      query: prompt,
      aspectRatio,
      resolution,
      width,
      height,
    }}
    onFinish={() => setShowLoader(false)}
  />
)}

      </ScrollView>
    </View>
  );
};

export default TemplateDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bodybackground, padding: 20, paddingTop: 20 },
  scrollContent: { paddingBottom: 30 },
  imageWrapper: { position: "relative", marginBottom: 12, alignItems: "center" },
  imageContainer: { width: "100%", height: screenHeight * 0.4, backgroundColor: colors.cardsbackground, borderRadius: 14, justifyContent: "center", alignItems: "center", overflow: "hidden" },
  heartIcon: { position: "absolute", top: 10, right: 10 },
  heartContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
  favCountText: { marginLeft: 4, fontWeight: "600" },
  title: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  promptBox: { padding: 10, borderRadius: 14, marginTop: 10 },
  label: { fontWeight: "600", marginBottom: 6 },
  input: { borderRadius: 8, paddingVertical: 10, minHeight: 100 },
  section: { borderRadius: 14, padding: 10, marginTop: 15 },
  flexBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 15, fontWeight: "600" },
  dimText: { fontSize: 13 },
  customBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginLeft: 8,borderWidth:1,borderColor:colors.primary },
  row: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  optionBtn: { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, marginBottom: 8, borderWidth: 1 },
  optionSelected: {},
  optionText: { fontSize: 14 },
  customBox: { borderRadius: 12, padding: 10, marginTop: 10 },
  sizeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sizeLabel: { fontSize: 14 },
  sizeInput: { flex: 1, borderRadius: 8, padding: 6, textAlign: "center", width: 80 },
  button: { marginTop: 20, borderRadius: 10, overflow: "hidden" },
  gradientButton: { paddingVertical: 12, alignItems: "center", borderRadius: 10 },
  buttonText: { color: colors.text, fontWeight: "bold", fontSize: 16 },
});
