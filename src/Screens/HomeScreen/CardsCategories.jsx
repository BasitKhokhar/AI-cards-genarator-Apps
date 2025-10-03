import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { apiFetch } from "../../apiFetch";

const FIXED_HEIGHT = 160; // ✅ All cards same height

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await apiFetch("/cards/categories", {}, navigation);
        if (res.ok) {
          const data = await res.json();

          // 🔥 Calculate natural width for each image based on FIXED_HEIGHT
          const updated = await Promise.all(
            data.map(async (cat) => {
              const templates = await Promise.all(
                (cat.templates || []).map(async (t) => {
                  if (t.imageUrl) {
                    try {
                      const { width, height } = await new Promise((resolve, reject) =>
                        Image.getSize(
                          t.imageUrl,
                          (w, h) => resolve({ width: w, height: h }),
                          reject
                        )
                      );
                      const aspectRatio = width / height;
                      return { ...t, calcWidth: FIXED_HEIGHT * aspectRatio };
                    } catch {
                      return { ...t, calcWidth: FIXED_HEIGHT }; // fallback square
                    }
                  }
                  return { ...t, calcWidth: FIXED_HEIGHT };
                })
              );
              return { ...cat, templates };
            })
          );

          setCategories(updated);
        } else {
          console.log("❌ Failed to load categories");
        }
      } catch (err) {
        console.error("⚠️ Error fetching categories:", err);
      }
    };

    loadCategories();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {categories.map((cat) => (
        <View key={cat.id} style={styles.categoryBlock}>
          <Text style={styles.categoryTitle}>{cat.name}</Text>

          <FlatList
            horizontal
            data={cat.templates || []}
            keyExtractor={(item, idx) =>
              item.id ? item.id.toString() : idx.toString()
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("templatefeatures", { templateId: item.id })
                }
              >
                <LinearGradient
                  colors={["#8b3dff", "#ff3d9b"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.cardGradient,
                    { width: item.calcWidth, height: FIXED_HEIGHT },
                  ]}
                >
                  <Image
                    source={{
                      uri: item.imageUrl || "https://via.placeholder.com/150",
                    }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    padding: 10,
    paddingLeft: 16,
  },
  categoryBlock: {
    marginBottom: 25,
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  cardGradient: {
    borderRadius: 14,
    padding: 2,
    marginRight: 15,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
});

export default CategoriesScreen;
