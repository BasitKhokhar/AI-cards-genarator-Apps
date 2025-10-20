import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { colors } from "../../Themes/colors"; // ✅ import your color system

const SearchTemplates = () => {
  const [query, setQuery] = useState("");
  const navigation = useNavigation();

  const handleSearch = () => {
    if (!query.trim()) return;
    navigation.navigate("SearchResultsScreen", { query });
    setQuery(""); // ✅ clear input immediately after navigating
  };

  // ✅ Optional: clear input when returning to this screen
  useFocusEffect(
    React.useCallback(() => {
      setQuery("");
    }, [])
  );

  const isTyping = query.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.mutedText} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Search templates..."
          placeholderTextColor={colors.mutedText}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        {/* ✅ Dynamic button color change */}
        <TouchableOpacity
          style={[
            styles.goButton,
            isTyping
              ? { backgroundColor: colors.text, borderColor: colors.text }
              : { backgroundColor: colors.border, borderColor: colors.border },
          ]}
          onPress={handleSearch}
        >
          <Ionicons
            name="arrow-forward"
            size={18}
            color={isTyping ? colors.bodybackground : colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10, marginBottom: 20 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardsbackground,
    borderRadius: 50,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
  },
  goButton: {
    borderWidth: 1,
    borderRadius: 50,marginRight:3,marginVertical:2,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginLeft: 6,
  },
});

export default SearchTemplates;
