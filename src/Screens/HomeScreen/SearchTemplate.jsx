import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SearchTemplates = () => {
  const [query, setQuery] = useState("");
  const navigation = useNavigation();

  const handleSearch = () => {
    if (!query.trim()) return;
    navigation.navigate("SearchResultsScreen", { query });
  };

  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar Only */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {  marginTop: 10,marginBottom:20 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2b2b2b",
    borderRadius: 50,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "#2c2c2c",
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 10,
    fontSize: 15,
  },
  goButton: {
    backgroundColor: "#e91e63",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginLeft: 6,
  },
});

export default SearchTemplates;
