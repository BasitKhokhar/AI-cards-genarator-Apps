import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { colors } from "../../Themes/colors";

const sampleRelated = [
  "https://images.unsplash.com/photo-1612832021426-1e4ef81e83a6",
  "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7",
  "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  "https://images.unsplash.com/photo-1593642632559-0c7e8e7b0c1f",
  "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
];

export default function AITemplatesResultScreen({ route, navigation }) {
  const { imageUrl, prompt, createdAt } = route.params;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>← Generation Details</Text>
      </TouchableOpacity>

      <Image source={{ uri: imageUrl }} style={styles.mainImage} />

      <View style={styles.detailsCard}>
        <Text style={styles.heading}>Generation Details</Text>
        <Text style={styles.label}>Prompt</Text>
        <Text style={styles.value}>{prompt}</Text>

        <Text style={styles.label}>Created</Text>
        <Text style={styles.value}>{new Date(createdAt).toLocaleString()}</Text>

        <Text style={styles.label}>Model</Text>
        <Text style={styles.value}>Nano Banana (mock)</Text>
      </View>

      <Text style={styles.subheading}>Related Images</Text>
      <View style={styles.relatedGrid}>
        {sampleRelated.map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.relatedImg} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bodybackground, padding: 10 },
  backArrow: { color: colors.text, fontSize: 16, marginBottom: 10 },
  mainImage: { width: "100%", height: 300, borderRadius: 10, marginBottom: 15 },
  detailsCard: {
    backgroundColor: colors.cardsbackground,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  heading: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 10 },
  label: { fontSize: 14, color: colors.subtext, marginTop: 8 },
  value: { fontSize: 15, color: colors.text },
  subheading: { fontSize: 17, fontWeight: "600", color: colors.text, marginBottom: 10 },
  relatedGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  relatedImg: { width: "48%", height: 130, borderRadius: 8, marginBottom: 10 },
});
