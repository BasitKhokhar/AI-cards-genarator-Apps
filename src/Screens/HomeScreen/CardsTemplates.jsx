import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons"; // ✅ heart icon
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { apiFetch } from "../../apiFetch";
import { ScrollView } from "react-native-gesture-handler";

const TemplateDetail = ({ route }) => {
  const { templateId } = route.params;
  const [template, setTemplate] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [resolution, setResolution] = useState("512x512");
  const [aspect, setAspect] = useState(1);

  const [isFavourite, setIsFavourite] = useState(false); // ✅ favourite state
  const [loadingFav, setLoadingFav] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const res = await apiFetch(`/cards/templates/${templateId}`, {}, navigation);
        if (res.ok) {
          const data = await res.json();
          setTemplate(data);
          setPrompt(data.prompt || "");
          setAspectRatio(data.aspectRatio || "1:1");

          // ✅ if backend sends "isFavourite"
          setIsFavourite(data.isFavourite || false);
        } else {
          console.log("❌ Failed to load template", res.status);
        }
      } catch (err) {
        console.error("⚠️ Error fetching template:", err);
      }
    };

    loadTemplate();
  }, [templateId]);

  // ✅ aspect ratio from image
  useEffect(() => {
    if (template?.imageUrl) {
      Image.getSize(template.imageUrl, (w, h) => {
        setAspect(w / h);
      });
    }
  }, [template?.imageUrl]);

  const handleGenerate = async () => {
    const payload = { templateId, prompt, aspectRatio, resolution };
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
      } else {
        console.log("❌ Failed to update favourite");
      }
    } catch (err) {
      console.error("⚠️ Error updating favourite:", err);
    } finally {
      setLoadingFav(false);
    }
  };

  if (!template) return <Text style={{ color: "white" }}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient Border Image */}
        <LinearGradient
          colors={["#8b3dff", "#ff3d9b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <Image
            source={{ uri: template.imageUrl || "https://via.placeholder.com/200" }}
            style={[styles.templateImage, { aspectRatio: aspect }]}
          />

          {/* ❤️ Heart Icon */}
          <TouchableOpacity style={styles.heartIcon} onPress={toggleFavourite}>
            <Icon
              name={isFavourite ? "favorite" : "favorite-border"}
              size={30}
              color={isFavourite ? "#ff3d9b" : "#fff"}
            />
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.title}>{template.title}</Text>

        <Text style={styles.label}>Edit Prompt:</Text>
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Edit prompt"
          placeholderTextColor="#888"
          style={styles.input}
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Aspect Ratio:</Text>
        <Picker
          selectedValue={aspectRatio}
          onValueChange={setAspectRatio}
          style={styles.picker}
          dropdownIconColor="#8b3dff"
        >
          <Picker.Item label="1:1" value="1:1" />
          <Picker.Item label="9:16" value="9:16" />
          <Picker.Item label="16:9" value="16:9" />
        </Picker>

        <Text style={styles.label}>Resolution:</Text>
        <Picker
          selectedValue={resolution}
          onValueChange={setResolution}
          style={styles.picker}
          dropdownIconColor="#8b3dff"
        >
          <Picker.Item label="512x512" value="512x512" />
          <Picker.Item label="1024x1024" value="1024x1024" />
          <Picker.Item label="2048x2048" value="2048x2048" />
        </Picker>

        {/* Neon Gradient Button */}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0d0d0d", paddingTop: 20 },
  scrollContent: { paddingBottom: 20, paddingTop: 10 },

  gradientBorder: {
    borderRadius: 14,
    padding: 2,
    marginBottom: 15,
    position: "relative",
  },

  templateImage: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#222",
  },

  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#8b3dff",
  },

  input: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    color: "white",
    backgroundColor: "#1a1a1a",
    minHeight: 100,
  },

  label: {
    color: "#ff3d9b",
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "600",
  },

  picker: {
    color: "white",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    marginBottom: 10,
  },

  button: { marginTop: 20, borderRadius: 8, overflow: "hidden" },

  gradientButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default TemplateDetail;
