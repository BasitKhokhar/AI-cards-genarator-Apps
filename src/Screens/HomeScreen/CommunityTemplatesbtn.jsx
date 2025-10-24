import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { apiFetch } from "../../apiFetch";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../Themes/colors";
import Loader from "../../Components/Loader/Loader";
import { MaterialIcons } from "@expo/vector-icons"; // ✅ Icon import

const SCREEN_HEIGHT = Dimensions.get("window").height;

const CommunityTemplatesButton = () => {
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const openModal = async () => {
    setVisible(true);
    if (categories.length === 0) {
      setLoading(true);
      try {
        const res = await apiFetch("/cards/categories");
        const data = await res.json();
        setCategories(data);
        setFiltered(data);
      } catch (e) {
        console.error("Error loading categories:", e);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (!text) return setFiltered(categories);
    const filteredData = categories.filter((cat) =>
      cat.name.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const selectCategory = (cat) => {
    setVisible(false);
    navigation.navigate("CommunityTemplatesScreen", {
      categoryId: cat.id,
      categoryName: cat.name,
    });
  };

  return (
    <>
      {/* 🌈 Gradient Button with Icon */}
      <TouchableOpacity onPress={openModal} style={styles.buttonWrapper}>
        <LinearGradient
          colors={colors.gradients.ocean}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <MaterialIcons name="grid-view" size={22} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Use Community Templates</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* 🪟 Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {/* 🏷️ Styled Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Choose Your Template Type</Text>
              <LinearGradient
                colors={colors.gradients.ocean}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.titleUnderline}
              />
            </View>

            <TextInput
              placeholder="Search categories..."
              placeholderTextColor="#aaa"
              style={styles.searchInput}
              value={search}
              onChangeText={handleSearch}
            />

            {loading ? (
              <Loader />
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => selectCategory(item)}
                    style={styles.categoryItem}
                  >
                    <Text style={styles.categoryText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    marginVertical: 16,
    alignItems: "center",marginHorizontal: 16,
  },
  button: {
    width: "100%",
    flexDirection: "row", // ✅ icon + text
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    
    borderRadius: 12,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    height: SCREEN_HEIGHT * 0.8,
    width: "90%",
    backgroundColor: colors.cardsbackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleContainer: {
    marginBottom: 14,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  titleUnderline: {
    marginTop: 4,
    height: 3,
    width: 120,
    borderRadius: 3,
  },
  searchInput: {
    backgroundColor: colors.bodybackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    color: colors.text,
    marginBottom: 10,
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryText: {
    color: colors.text,
    fontSize: 16,
  },
});

export default CommunityTemplatesButton;
