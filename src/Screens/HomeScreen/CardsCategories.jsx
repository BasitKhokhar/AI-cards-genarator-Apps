
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { apiFetch } from "../../apiFetch";
import SearchTemplates from "./SearchTemplate";
import { colors } from "../../Themes/colors";
import Loader from "../../Components/Loader/Loader";
import { MotiView } from "moti";

const FIXED_HEIGHT = 160;
const PAGE_SIZE = 5;
const SCREEN_WIDTH = Dimensions.get("window").width;

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/cards/categories", {}, navigation);
      if (!res.ok) throw new Error("Failed to load categories");

      const data = await res.json();
      const formatted = data.map((cat) => ({
        ...cat,
        templates: [],
        page: 1,
        hasMore: true,
        loadingMore: false,
      }));

      setCategories(formatted);
      for (const cat of formatted) fetchMoreTemplates(cat.id, 1);
    } catch (err) {
      console.error("⚠️ Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreTemplates = async (categoryId, pageNum) => {
    try {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, loadingMore: true } : cat
        )
      );

      const res = await apiFetch(
        `/cards/categories/${categoryId}/templates?page=${pageNum}&limit=${PAGE_SIZE}`,
        {},
        navigation
      );
      if (!res.ok) throw new Error("Failed to fetch templates");

      const data = await res.json();
      const fetched = data.templates || [];
      const hasMore = data.hasMore;

      const processed = await Promise.all(
        fetched.map(async (t) => {
          try {
            const { width, height } = await new Promise((resolve, reject) =>
              Image.getSize(t.imageUrl, (w, h) => resolve({ width: w, height: h }), reject)
            );
            const aspectRatio = width / height;
            return { ...t, calcWidth: FIXED_HEIGHT * aspectRatio };
          } catch {
            return { ...t, calcWidth: FIXED_HEIGHT };
          }
        })
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                templates:
                  pageNum === 1
                    ? processed
                    : [
                        ...cat.templates,
                        ...processed.filter(
                          (t) => !cat.templates.find((x) => x.id === t.id)
                        ),
                      ],
                page: pageNum,
                hasMore,
                loadingMore: false,
              }
            : cat
        )
      );
    } catch (err) {
      console.error("❌ Error fetching templates:", err);
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, loadingMore: false } : cat
        )
      );
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  const renderTemplate = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate("templatefeatures", { templateId: item.id })}
    >
      <MotiView
        from={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 300 }}
        style={{ marginRight: 15 }}
      >
        <Image
          source={{ uri: item.imageUrl || "https://via.placeholder.com/150" }}
          style={[
            styles.cardImage,
            { width: item.calcWidth ?? FIXED_HEIGHT, height: FIXED_HEIGHT },
          ]}
          resizeMode="cover"
        />
      </MotiView>
    </TouchableOpacity>
  );

  // 🧩 Category renderer with skeletons
  const renderCategory = (cat) => (
    <View key={cat.id} style={styles.categoryBlock}>
      <Text style={styles.categoryTitle}>{cat.name}</Text>

      {cat.templates.length === 0 && !cat.loadingMore ? (
        // 🦴 Skeleton placeholders like screenshot
        <View style={{ flexDirection: "row", paddingLeft: 4 }}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <MotiView
              key={idx}
              from={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{
                loop: true,
                type: "timing",
                duration: 1000,
                delay: idx * 150,
                repeatReverse: true,
              }}
              style={styles.skeletonCard}
            />
          ))}
        </View>
      ) : (
        <FlatList
          horizontal
          data={cat.templates}
          keyExtractor={(item, idx) => `${cat.id}-${item.id || idx}`}
          renderItem={renderTemplate}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={SCREEN_WIDTH * 0.42 + 12}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH * 0.42 + 12,
            offset: (SCREEN_WIDTH * 0.42 + 12) * index,
            index,
          })}
          onEndReached={() => {
            if (!cat.loadingMore && cat.hasMore) {
              fetchMoreTemplates(cat.id, cat.page + 1);
            }
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            cat.loadingMore ? (
              <MotiView
                from={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{
                  loop: true,
                  type: "timing",
                  duration: 800,
                  repeatReverse: true,
                }}
                style={styles.skeletonCard}
              />
            ) : null
          }
        />
      )}
    </View>
  );

  // Outer skeleton while categories load
  const renderCategorySkeleton = () => (
    <View>
      {Array.from({ length: 3 }).map((_, i) => (
        <View key={i} style={styles.categoryBlock}>
          <View style={[styles.skelTitle, { marginBottom: 10 }]} />
          <View style={{ flexDirection: "row", paddingLeft: 4 }}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <MotiView
                key={idx}
                from={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{
                  loop: true,
                  type: "timing",
                  duration: 1000,
                  delay: idx * 150,
                  repeatReverse: true,
                }}
                style={styles.skeletonCard}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={<SearchTemplates />}
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderCategory(item)}
        ListEmptyComponent={
          categories.length === 0 ? renderCategorySkeleton() : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bodybackground,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bodybackground,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  categoryBlock: {
    marginBottom: 25,
    backgroundColor: colors.cardsbackground,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: colors.text,
  },
  cardImage: {
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: colors.cardsbackground,
    width: SCREEN_WIDTH * 0.42,
    height: FIXED_HEIGHT,
  },
  // 🦴 Skeleton Styles
  skelTitle: {
    backgroundColor: colors.border,
    width: 120,
    height: 18,
    borderRadius: 8,
  },
  skeletonCard: {
    width: 140,
    height: FIXED_HEIGHT,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: colors.border,
    opacity: 0.3,
  },
});

export default CategoriesScreen;
