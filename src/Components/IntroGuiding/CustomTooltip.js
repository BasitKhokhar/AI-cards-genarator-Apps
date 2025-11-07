import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../Themes/colors";

// 🧭 Define all steps text here
const stepLabels = {
   1: {
    title: "Guide to Features",
    description:
      "Learn how each feature works to make your design process smoother and faster.",
  },
  2: {
    title: "Describe Your Idea",
    description:
      "Describe your design here. The AI will generate images based on your input.",
  },
  3: {
    title: "Add Image Reference",
    description:
      "Pick an image from your gallery. The AI will use it as a base for your design.",
  },
  4: {
    title: "Quote Shortcut",
    description:
      'Tap “T” to display your Text on attached refrence image.',
  },
  5: {
    title: "Advanced Settings",
    description:
      "Tap + to open aspect ratio, resolution, and custom size settings.",
  },
  6: {
    title: "Generate Design",
    description:
      "Tap the arrow button to generate your design based on the entered description.",
  },
};

const CustomTooltip = ({ currentStep, handleNext, handleStop }) => {
  if (!currentStep) return null;

  const { order, isLast } = currentStep;
  const stepInfo = stepLabels[order] || {};
  const isFinal = isLast || order === Object.keys(stepLabels).length;

  return (
    <View
      style={[
        styles.tooltipContainer,
        { backgroundColor: colors.bodybackground },
      ]}
    >
      {/* 🏷️ Heading */}
      <Text style={[styles.tooltipHeading, { color: colors.primary }]}>
        {stepInfo.title || currentStep.name || "Feature Guide"}
      </Text>

      {/* 📖 Description */}
      <Text style={[styles.tooltipDescription, { color: colors.text }]}>
        {stepInfo.description || currentStep.text || ""}
      </Text>

      {/* 🔘 Buttons */}
      <View style={styles.tooltipButtons}>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: colors.secondary }]}
          onPress={handleStop}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {isFinal ? "Finish" : "Skip"}
          </Text>
        </TouchableOpacity>

        {!isFinal && (
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.primary }]}
            onPress={handleNext}
          >
            <Text style={[styles.buttonText, { color: colors.bodybackground }]}>
              Next
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomTooltip;

const styles = StyleSheet.create({
  tooltipContainer: {
    padding: 16,
    borderRadius: 14,
    width: '90%',
    borderWidth:1,borderColor:colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  tooltipHeading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  tooltipDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  tooltipButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  nextButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
