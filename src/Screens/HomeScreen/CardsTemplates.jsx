import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { apiFetch } from "../../apiFetch";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const CardCategoryTemplatesScreen = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await apiFetch(`/cards/templates/${categoryId}`);
        if (res.ok) {
          const data = await res.json();
          setTemplates(data);
        } else {
          console.log("❌ Failed to load templates:", res.status);
        }
      } catch (err) {
        console.error("⚠️ Error fetching templates:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, [categoryId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8b3dff" />
      </View>
    );
  }

  return (
    <FlatList
      data={templates}
      horizontal
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("TemplateDetails", { templateId: item.id })
          }
        >
          <Image source={{ uri: item.image_url }} style={styles.cardImage} />
          <Text style={styles.cardTitle}>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
  card: { margin: 10, width: 200 },
  cardImage: { width: "100%", height: 120, borderRadius: 10 },
  cardTitle: { color: "#fff", marginTop: 5, fontWeight: "bold" },
});

export default CardCategoryTemplatesScreen;
