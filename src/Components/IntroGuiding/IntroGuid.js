import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GuideOverlay = ({ title, text, x, y, onNext, onPrev, onClose, hasPrev, hasNext, visible }) => {
  if (!visible) return null;

  return (
    <View
      style={[
        styles.overlay,
        {
          top: y ?? Dimensions.get("window").height / 2 - 100,
          left: x ?? 20,
        },
      ]}
    >
      <View style={styles.tooltip}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{text}</Text>

        <View style={styles.buttonRow}>
          {hasPrev && (
            <TouchableOpacity onPress={onPrev} style={styles.prevBtn}>
              <Ionicons name="arrow-back" size={16} color="#fff" />
              <Text style={styles.btnText}>Prev</Text>
            </TouchableOpacity>
          )}
          {hasNext && (
            <TouchableOpacity onPress={onNext} style={styles.nextBtn}>
              <Text style={[styles.btnText, { color: "#ff6bcb" }]}>Next</Text>
              <Ionicons name="arrow-forward" size={16} color="#ff6bcb" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    zIndex: 1000,
    width: Dimensions.get("window").width * 0.9,
  },
  tooltip: {
    backgroundColor: "#1e1e2a",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#383850",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#d379ff",
  },
  description: {
    color: "#ddd",
    fontSize: 13,
    lineHeight: 19,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  prevBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2b2b38",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2b2b38",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btnText: {
    fontSize: 13,
    color: "#fff",
    marginHorizontal: 4,
  },
});

export default GuideOverlay;
