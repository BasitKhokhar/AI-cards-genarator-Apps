// src/screens/Cards/SearchResultsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MasonryList from "@react-native-seoul/masonry-list";
import { useNavigation, useRoute } from "@react-navigation/native";
import { apiFetch } from "../../apiFetch";

const SearchResultsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const initialQuery = route.params?.query || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await apiFetch(
        `/cards/templates/search?q=${encodeURIComponent(query)}`,
        {},
        navigation
      );
      if (res.ok) {
        const data = await res.json();
        const updated = await Promise.all(
          data.map(async (item) => {
            try {
              const { width, height } = await new Promise((resolve, reject) =>
                Image.getSize(item.imageUrl, (w, h) => resolve({ width: w, height: h }), reject)
              );
              return { ...item, width, height };
            } catch {
              return { ...item, width: 1, height: 1 };
            }
          })
        );
        setResults(updated);
      } else setResults([]);
    } catch (err) {
      console.error("❌ Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) handleSearch();
  }, [initialQuery]);

  const renderItem = ({ item }) => {
    const aspectRatio = item.width / item.height || 1;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("templatefeatures", { templateId: item.id })}
      >
        <Image source={{ uri: item.imageUrl }} style={[styles.image, { aspectRatio }]} />
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" style={{ marginRight: 10 }} />
        </TouchableOpacity> */}
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
        <MasonryList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Empty */}
      {!loading && results.length === 0 && query.length > 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No templates found for "{query}"</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 10 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#2c2c2c",
    marginBottom: 15,
  },
  input: { flex: 1, color: "#fff", paddingVertical: 10, fontSize: 15 },
  goButton: {
    backgroundColor: "#8b3dff",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 6,
  },
  list: { paddingBottom: 40 },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    overflow: "hidden",
  },
  image: { width: "100%", borderRadius: 10 },
  title: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    padding: 8,
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#888", fontSize: 16 },
});

export default SearchResultsScreen;
