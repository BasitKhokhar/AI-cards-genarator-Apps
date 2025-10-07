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
import Icon from "react-native-vector-icons/MaterialIcons"; // ✅ icon
import { apiFetch } from "../../apiFetch";

const TrendingTemplates = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesWithSize, setImagesWithSize] = useState([]);
  const navigation = useNavigation();

  const fetchTemplates = async () => {
    try {
      const res = await apiFetch("/cards/trendingtemplates/home", {}, navigation);
      if (res.ok) {
        const data = await res.json();

        // 🔹 Attach width/height for Masonry layout
        const updated = await Promise.all(
          data.map(async (item) => {
            const imageUrl = item.imageUrl || "https://via.placeholder.com/150";
            try {
              const size = await new Promise((resolve) => {
                Image.getSize(
                  imageUrl,
                  (width, height) => resolve({ width, height }),
                  () => resolve({ width: 1, height: 1 }) // fallback
                );
              });
              return { ...item, ...size };
            } catch {
              return { ...item, width: 1, height: 1 };
            }
          })
        );

        setImagesWithSize(updated);
      } else {
        console.log("⚠️ Failed to load trending templates", res.status);
      }
    } catch (err) {
      console.error("❌ Error fetching trending templates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const renderItem = ({ item }) => {
    const aspectRatio = item.width / item.height || 1;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("templatefeatures", { templateId: item.id })
        }
      >
        <Image
          source={{
            uri: item.imageUrl || "https://via.placeholder.com/150",
          }}
          style={[styles.image, { aspectRatio }]}
          resizeMode="cover"
        />
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
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
        <Text style={styles.emptyText}>No trending templates yet.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1,backgroundColor: "#121212", }}>
      {/* 🔹 Heading */}
      <View style={styles.header}>
        <Icon name="trending-up" size={24} color="#8b3dff" />
        <Text style={styles.headerText}>Trending</Text>
      </View>

      {/* 🔹 Masonry List */}
      <MasonryList
        data={imagesWithSize}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    
  },
  headerText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
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

export default TrendingTemplates;
