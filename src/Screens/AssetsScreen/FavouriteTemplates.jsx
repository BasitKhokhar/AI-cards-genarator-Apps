
import { colors } from "../../Themes/colors";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

        // Attach width/height for Masonry layout
        const updated = await Promise.all(
          data.map(async (item) => {
            const imageUrl =
              item.template?.imageUrl || "https://via.placeholder.com/150";
            try {
              const size = await new Promise((resolve) => {
                Image.getSize(
                  imageUrl,
                  (width, height) => resolve({ width, height }),
                  () => resolve({ width: 1, height: 1 })
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
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (imagesWithSize.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="view-grid-outline"
          size={50}
          color={colors.mutedText}
          style={{ marginBottom: 12 }}
        />
        <Text style={styles.emptyTitle}>No Favourite Templates Yet</Text>
        <Text style={styles.emptySubtitle}>
          Your enhanced templates will appear here once generated.
        </Text>
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
    backgroundColor: colors.bodybackground,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 14,
    backgroundColor: colors.cardsbackground,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: "100%",
    borderRadius: 10,
  },
  title: {
    padding: 8,
    color: colors.text,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 13,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bodybackground,
  },
  // Empty State Styles
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 120,
    backgroundColor: colors.bodybackground,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.mutedText,
    textAlign: "center",
    width: "80%",
  },
});

export default FavouriteTemplates;
