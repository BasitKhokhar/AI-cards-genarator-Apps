import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { useGeneration } from "../../Context/ImageGenerationContext";
// import { colors } from "../Themes/colors";
import { colors } from "../../Themes/colors";
import { useNavigation } from "@react-navigation/native";

const GlobalGenerationStatusBar = () => {
  const { generationStatus } = useGeneration();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (generationStatus.isLoading || generationStatus.progress === 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [generationStatus]);

  const handleGoToGallery = () => {
    setVisible(false);
    navigation.navigate("Assets");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <MotiView
          from={{ translateY: 100, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          exit={{ translateY: 100, opacity: 0 }}
          transition={{ type: "timing", duration: 300 }}
          style={styles.bottomBarContainer}
        >
          <View style={styles.bottomBar}>
            <Text style={styles.bottomBarText}>
              {generationStatus.isLoading
                ? "Your generation has started."
                : "Your image has been generated."}
            </Text>

            {!generationStatus.isLoading && (
              <TouchableOpacity onPress={handleGoToGallery}>
                <Text style={styles.bottomBarLink}>Go to Gallery</Text>
              </TouchableOpacity>
            )}
          </View>
        </MotiView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  bottomBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  bottomBar: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 50,
    width: "95%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  bottomBarText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "System",
  },
  bottomBarLink: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});

export default GlobalGenerationStatusBar;
