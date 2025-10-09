// src/screens/Cards/SearchResultsScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { apiFetch } from "../../apiFetch";

const PAGE_SIZE = 10;
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2; // two columns with padding

const SearchResultsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const initialQuery = route.params?.query || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Fetch search results
  const fetchResults = useCallback(
    async (pageNum = 1, reset = false) => {
      if (!query.trim()) return;

      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const res = await apiFetch(
          `/cards/templates/search?q=${encodeURIComponent(query)}&page=${pageNum}&limit=${PAGE_SIZE}`,
          {},
          navigation
        );

        if (!res.ok) throw new Error("Failed to fetch search results");
        const data = await res.json();

        const { templates: fetched, hasMore: moreAvailable } = data;

        // ✅ Calculate proportional image heights
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

        if (reset) setResults(processed);
        else setResults((prev) => [...prev, ...processed]);

        setHasMore(moreAvailable);
      } catch (err) {
        console.error("❌ Search fetch error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query, navigation]
  );

  // 🔍 Fetch when coming from previous screen
  useEffect(() => {
    if (initialQuery) {
      fetchResults(1, true);
    }
  }, [initialQuery]);

  // 🔍 Manual search
  const handleSearch = () => {
    if (query.trim()) fetchResults(1, true);
  };

  // ♾️ Infinite scroll
  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = Math.floor(results.length / PAGE_SIZE) + 1;
    fetchResults(nextPage);
  }, [loadingMore, hasMore, results.length, fetchResults]);

  // ✅ Split into two columns
  const formatMasonry = (data) => {
    const left = [];
    const right = [];
    data.forEach((item, index) => {
      if (index % 2 === 0) left.push(item);
      else right.push(item);
    });
    return [left, right];
  };

  const [leftCol, rightCol] = formatMasonry(results);

  // ✅ Render one card
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

  // ✅ Render the 2-column masonry layout
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

  return (
    <View style={styles.container}>
      {/* 🔍 Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#bbb" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Search templates..."
          placeholderTextColor="#777"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.goButton} onPress={handleSearch}>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#8b3dff" />
        </View>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <FlatList
          data={[{}]} // one placeholder for custom layout
          renderItem={renderMasonry}
          keyExtractor={() => "masonry"}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loadingMore && (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#8b3dff" />
              </View>
            )
          }
        />
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && query.length > 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No templates found for "{query}"</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", paddingTop: 10 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 50,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "#2c2c2c",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  input: { flex: 1, color: "#fff", paddingVertical: 10, fontSize: 15 },
  goButton: {
    backgroundColor: "#e91e63",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginLeft: 6,
  },
  masonryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  column: { flex: 1 },
  card: {
    margin: 6,
    borderRadius: 14,
    backgroundColor: "#1E1E1E",
    overflow: "hidden",
    elevation: 3,
  },
  image: { width: "100%", borderRadius: 12 },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  cardTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  footerLoader: { paddingVertical: 20 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#888", fontSize: 16 },
});

export default SearchResultsScreen;
