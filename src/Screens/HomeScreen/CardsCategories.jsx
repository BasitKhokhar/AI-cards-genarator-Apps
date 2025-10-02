import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { apiFetch } from "../../apiFetch";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const CategoriesWithTemplates = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesWithTemplates = async () => {
      try {
        // Fetch all categories
        const res = await apiFetch("/cards/categories");
        const cats = await res.json();
         console.log("categories data",cats)
        // For each category fetch templates
        const catsWithTemplates = await Promise.all(
          cats.map(async (cat) => {
            try {
              const res2 = await apiFetch(`/cards/templates/${cat.id}`);
              const templates = await res2.json();
              return { ...cat, templates };
            } catch (err) {
              console.error(`⚠️ Error fetching templates for ${cat.name}:`, err);
              return { ...cat, templates: [] };
            }
          })
        );

        setCategories(catsWithTemplates);
      } catch (err) {
        console.error("⚠️ Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithTemplates();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8b3dff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {categories.map((category) => (
        <View key={category.id} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{category.name}</Text>

          <FlatList
            data={category.templates}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("TemplateDetails", {
                    templateId: item.id,
                  })
                }
              >
                <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  categorySection: { marginVertical: 15, paddingHorizontal: 10 },
  categoryTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: { marginRight: 10, width: 150 },
  cardImage: { width: "100%", height: 100, borderRadius: 10 },
  cardTitle: { color: "#fff", marginTop: 5, fontWeight: "bold" },
});

export default CategoriesWithTemplates;
