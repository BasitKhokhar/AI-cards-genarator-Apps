import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MasonryList from "@react-native-seoul/masonry-list";
import { apiFetch } from "../../apiFetch";

const FavouriteTemplates = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesWithSize, setImagesWithSize] = useState([]);
  const navigation = useNavigation();

  const fetchFavourites = async () => {
    try {
      const res = await apiFetch("/favourites", {}, navigation);
      if (res.ok) {
        const data = await res.json();

        // 🔹 Attach width/height for Masonry layout
        const updated = await Promise.all(
          data.map(async (item) => {
            const imageUrl =
              item.template?.imageUrl || "https://via.placeholder.com/150";
            try {
              const size = await new Promise((resolve) => {
                Image.getSize(
                  imageUrl,
                  (width, height) => resolve({ width, height }),
                  () => resolve({ width: 1, height: 1 }) // fallback
                );
              });
              return { ...item, template: { ...item.template, ...size } };
            } catch {
              return {
                ...item,
                template: { ...item.template, width: 1, height: 1 },
              };
            }
          })
        );

        setImagesWithSize(updated);
      } else {
        console.log("⚠️ Failed to load favourites", res.status);
      }
    } catch (err) {
      console.error("❌ Error fetching favourites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const renderItem = ({ item }) => {
    const aspectRatio = item.template?.width / item.template?.height || 1;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("templatefeatures", {
            templateId: item.template.id,
          })
        }
      >
        <Image
          source={{
            uri: item.template?.imageUrl || "https://via.placeholder.com/150",
          }}
          style={[styles.image, { aspectRatio }]}
          resizeMode="cover"
        />
        <Text style={styles.title} numberOfLines={1}>
          {item.template?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#8b3dff" />
      </View>
    );
  }

  if (imagesWithSize.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favourite templates yet.</Text>
      </View>
    );
  }

  return (
    <MasonryList
      data={imagesWithSize}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    backgroundColor: "#1a1a1a",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    borderRadius: 10,
  },
  title: {
    padding: 8,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#888", fontSize: 16 },
});

export default FavouriteTemplates;
