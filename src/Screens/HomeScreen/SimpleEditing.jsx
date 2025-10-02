import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function SimpleImageEditor() {
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);

  // Editing values
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [rotate, setRotate] = useState(0);

  // History system
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Pick Image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setEditedImage(uri);
      setUndoStack([
        { uri, brightness: 1, contrast: 1, saturation: 1, rotate: 0 },
      ]);
      setRedoStack([]);
    }
  };

  // Auto-apply edits when sliders change
  useEffect(() => {
    if (!image) return;

    const newState = { uri: image, brightness, contrast, saturation, rotate };
    setEditedImage(image);

    // Push new state to undo stack
    setUndoStack((prev) => [...prev, newState]);
    setRedoStack([]); // clear redo after new change
  }, [brightness, contrast, saturation, rotate]);

  // Undo action
  const undoEdits = () => {
    if (undoStack.length > 1) {
      const newUndoStack = [...undoStack];
      const lastState = newUndoStack.pop();
      setRedoStack((prev) => [lastState, ...prev]);
      const prevState = newUndoStack[newUndoStack.length - 1];
      applyState(prevState);
      setUndoStack(newUndoStack);
    }
  };

  // Redo action
  const redoEdits = () => {
    if (redoStack.length > 0) {
      const [nextState, ...rest] = redoStack;
      setUndoStack((prev) => [...prev, nextState]);
      applyState(nextState);
      setRedoStack(rest);
    }
  };

  // Helper: Apply saved state
  const applyState = (state) => {
    setBrightness(state.brightness);
    setContrast(state.contrast);
    setSaturation(state.saturation);
    setRotate(state.rotate);
    setEditedImage(state.uri);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>📷 Pick Image</Text>
      </TouchableOpacity>

      {editedImage && (
        <View style={{ flex: 1 }}>
          {/* Image Preview */}
          <Image
            source={{ uri: editedImage }}
            style={[
              styles.image,
              {
                transform: [{ rotate: `${rotate}deg` }],
                opacity: brightness, // simulate brightness
              },
            ]}
          />

          {/* Undo/Redo buttons under image */}
          <View style={styles.historyRow}>
            <TouchableOpacity
              style={[styles.historyBtn, undoStack.length <= 1 && styles.disabled]}
              onPress={undoEdits}
              disabled={undoStack.length <= 1}
            >
              <Icon name="arrow-back-ios" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.historyBtn, redoStack.length === 0 && styles.disabled]}
              onPress={redoEdits}
              disabled={redoStack.length === 0}
            >
              <Icon name="arrow-forward-ios" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Toolbar */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.toolbar}
          >
            <View style={styles.tool}>
              <Text>Brightness</Text>
              <Slider
                style={{ width: 150 }}
                minimumValue={0.3}
                maximumValue={2}
                step={0.1}
                value={brightness}
                onValueChange={setBrightness}
              />
            </View>

            <View style={styles.tool}>
              <Text>Contrast</Text>
              <Slider
                style={{ width: 150 }}
                minimumValue={0.5}
                maximumValue={2}
                step={0.1}
                value={contrast}
                onValueChange={setContrast}
              />
            </View>

            <View style={styles.tool}>
              <Text>Saturation</Text>
              <Slider
                style={{ width: 150 }}
                minimumValue={0}
                maximumValue={2}
                step={0.1}
                value={saturation}
                onValueChange={setSaturation}
              />
            </View>

            <View style={styles.tool}>
              <Text>Rotate</Text>
              <Slider
                style={{ width: 150 }}
                minimumValue={0}
                maximumValue={360}
                step={1}
                value={rotate}
                onValueChange={setRotate}
              />
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  image: {
    width: "100%",
    height: "70%",
    borderRadius: 10,
    resizeMode: "contain",
  },
  toolbar: { marginTop: 10 },
  tool: { alignItems: "center", marginHorizontal: 10 },
  historyRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  historyBtn: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  disabled: { opacity: 0.3 },
});
