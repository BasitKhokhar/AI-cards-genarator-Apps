import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,RefreshControl,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { apiFetch } from "../../apiFetch";
import { colors } from "../../Themes/colors";

const PAGE_SIZE = 10;
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

const TrendingTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();

  // ✅ Fetch templates
  const fetchTemplates = useCallback(
    async (pageNum = 1) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const res = await apiFetch(
          `/cards/trendingtemplates/home?page=${pageNum}&limit=${PAGE_SIZE}`,
          {},
          navigation
        );

        if (!res.ok) throw new Error("Failed to fetch templates");
        const data = await res.json();
        console.log("response in trending ", data)
        const { templates: fetched, hasMore: moreAvailable } = data;

        // ✅ Calculate image height proportionally
        const processed = await Promise.all(
          fetched.map(
            (item) =>
              new Promise((resolve) => {
                const uri = item.imageUrl || "https://via.placeholder.com/150";
                Image.getSize(
                  uri,
                  (w, h) => {
                    const aspectRatio = w / h || 1;
                    const imgHeight = CARD_WIDTH / aspectRatio;
                    resolve({ ...item, aspectRatio, height: imgHeight });
                  },
                  () => resolve({ ...item, aspectRatio: 1, height: 180 })
                );
              })
          )
        );

        if (pageNum === 1) setTemplates(processed);
        else setTemplates((prev) => [...prev, ...processed]);

        setHasMore(moreAvailable);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [navigation]
  );

  useEffect(() => {
    fetchTemplates(1);
  }, [fetchTemplates]);
  // for refreshiing //
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTemplates(1);
    setRefreshing(false);
  }, [fetchTemplates]);
  // ✅ Infinite scroll
  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = Math.floor(templates.length / PAGE_SIZE) + 1;
    fetchTemplates(nextPage);
  }, [loadingMore, hasMore, templates.length, fetchTemplates]);

  // ✅ Split templates into 2 columns
  const formatMasonry = (data) => {
    const left = [];
    const right = [];
    data.forEach((item, index) => {
      if (index % 2 === 0) left.push(item);
      else right.push(item);
    });
    return [left, right];
  };

  const [leftCol, rightCol] = formatMasonry(templates);

  const renderMasonry = () => (
    <View style={styles.masonryContainer}>
      <View style={styles.column}>
        {leftCol.map((item) => renderCard(item))}
      </View>
      <View style={styles.column}>
        {rightCol.map((item) => renderCard(item))}
      </View>
    </View>
  );

  // ✅ Card renderer
  const renderCard = (item) => (
    <TouchableOpacity
      key={item.id}
      activeOpacity={0.9}
      style={[styles.card, { height: item.height }]}
      onPress={() =>
        navigation.navigate("templatefeatures", { templateId: item.id })
      }
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={[styles.image, { height: item.height }]}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="trending-up" size={24} color={colors.primary} />
        <Text style={styles.headerText}>Trending Templates</Text>
      </View>

      <FlatList
        data={[{}]} // single placeholder for masonry layout
        renderItem={renderMasonry}
        keyExtractor={() => "masonry"}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
         refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary} // spinner color
            />
          }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TrendingTemplates;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bodybackground,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 8,
  },
  headerText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  masonryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  column: {
    flex: 1,
  },
  card: {
    margin: 6,
    borderRadius: 14,
    backgroundColor: colors.cardsbackground,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: "100%",
    borderRadius: 12,
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  cardTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
