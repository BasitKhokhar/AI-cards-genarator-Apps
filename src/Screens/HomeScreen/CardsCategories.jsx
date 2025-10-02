import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";  // ✅ Import navigation hook
import { LinearGradient } from "expo-linear-gradient";
import { apiFetch } from "../../apiFetch"; // wrapper for fetch + token

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation(); // ✅ Use navigation here

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await apiFetch("/cards/categories", {}, navigation);
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        } else {
          console.log("❌ Failed to load categories");
        }
      } catch (err) {
        console.error("⚠️ Error fetching categories:", err);
      }
    };

    loadCategories();
  }, []);

  console.log(
    "👉 Template imageUrls:",
    categories.flatMap((cat) => cat.templates.map((t) => t.imageUrl))
  );

  return (
    <ScrollView style={styles.container}>
      {categories.map((cat) => (
        <View key={cat.id} style={styles.categoryBlock}>
          <Text style={styles.categoryTitle}>{cat.name}</Text>

          <FlatList
            horizontal
            data={cat.templates || []}
            keyExtractor={(item, idx) =>
              item.id ? item.id.toString() : idx.toString()
            }
            renderItem={({ item }) => (
              <TouchableOpacity

                onPress={() =>
                  navigation.navigate("templatefeatures", { templateId: item.id })
                }
              >
               <LinearGradient
  colors={["#8b3dff", "#ff3d9b"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.cardGradient}
>
  <Image
    source={{
      uri: item.imageUrl || "https://via.placeholder.com/150",
    }}
    style={styles.cardImage}
    resizeMode="cover"
  />
</LinearGradient>

              </TouchableOpacity>
            )}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 10, paddingLeft: 16 },
  categoryBlock: { marginBottom: 25 },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  // card: {
  //   width: 150, marginRight: 15, alignItems: "center", borderRadius: 14,   // slightly bigger than image radius
  //   padding: 2,        
  //   marginBottom: 15,
  // },
 cardGradient: {
  width: 150,
  height: 150,
  borderRadius: 14,
  padding: 2,          
  marginRight: 15,
  marginBottom: 15,
},

cardImage: {
  width: "100%",
  height: "100%",
  borderRadius: 12,    
},
  cardTitle: { color: "white", marginTop: 5, fontSize: 14 },
});

export default CategoriesScreen;
