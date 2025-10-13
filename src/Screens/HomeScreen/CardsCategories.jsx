
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   RefreshControl,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useNavigation } from "@react-navigation/native";
// import { apiFetch } from "../../apiFetch";
// import SearchTemplates from "./SearchTemplate";

// const FIXED_HEIGHT = 160;
// const PAGE_SIZE = 5; 

// const CategoriesScreen = () => {
//   const [categories, setCategories] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const navigation = useNavigation();

//   // ✅ Load categories (without templates first)
//   const loadCategories = async () => {
//     try {
//       const res = await apiFetch("/cards/categories", {}, navigation);
//       if (!res.ok) throw new Error("Failed to load categories");

//       const data = await res.json();
//       const formatted = data.map((cat) => ({
//         ...cat,
//         templates: [],
//         page: 1,
//         hasMore: true,
//         loadingMore: false,
//       }));

//       setCategories(formatted);

//       // Load first page for each category
//       for (const cat of formatted) {
//         fetchMoreTemplates(cat.id, 1);
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching categories:", err);
//     }
//   };

//   // ✅ Fetch paginated templates + calculate dynamic width
//   const fetchMoreTemplates = async (categoryId, pageNum) => {
//     try {
//       setCategories((prev) =>
//         prev.map((cat) =>
//           cat.id === categoryId ? { ...cat, loadingMore: true } : cat
//         )
//       );

//       const res = await apiFetch(
//         `/cards/categories/${categoryId}/templates?page=${pageNum}&limit=${PAGE_SIZE}`,
//         {},
//         navigation
//       );
//       if (!res.ok) throw new Error("Failed to fetch templates");

//       const data = await res.json();
//       let fetched = data.templates || [];
//       const hasMore = data.hasMore;

//       // ✅ Calculate natural width based on image aspect ratio
//       const processed = await Promise.all(
//         fetched.map(async (t) => {
//           if (!t.imageUrl) return { ...t, calcWidth: FIXED_HEIGHT };
//           try {
//             const { width, height } = await new Promise((resolve, reject) =>
//               Image.getSize(
//                 t.imageUrl,
//                 (w, h) => resolve({ width: w, height: h }),
//                 reject
//               )
//             );
//             const aspectRatio = width / height;
//             return { ...t, calcWidth: FIXED_HEIGHT * aspectRatio };
//           } catch {
//             return { ...t, calcWidth: FIXED_HEIGHT };
//           }
//         })
//       );

//       // ✅ Update category state
//       setCategories((prev) =>
//         prev.map((cat) =>
//           cat.id === categoryId
//             ? {
//                 ...cat,
//                 templates:
//                   pageNum === 1
//                     ? processed
//                     : [...cat.templates, ...processed.filter(
//                         (t) => !cat.templates.find((x) => x.id === t.id)
//                       )],
//                 page: pageNum,
//                 hasMore,
//                 loadingMore: false,
//               }
//             : cat
//         )
//       );
//     } catch (err) {
//       console.error("❌ Error fetching templates:", err);
//       setCategories((prev) =>
//         prev.map((cat) =>
//           cat.id === categoryId ? { ...cat, loadingMore: false } : cat
//         )
//       );
//     }
//   };

//   // ✅ Pull to refresh
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await loadCategories();
//     setRefreshing(false);
//   }, []);

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   // ✅ Template item (uses dynamic width)
//   const renderTemplate = ({ item }) => (
//     <TouchableOpacity
//       onPress={() =>
//         navigation.navigate("templatefeatures", { templateId: item.id })
//       }
//     >
//       <LinearGradient
//         colors={["#8b3dff", "#ff3d9b"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={[styles.cardGradient, { width: item.calcWidth, height: FIXED_HEIGHT }]}
//       >
//         <Image
//           source={{ uri: item.imageUrl || "https://via.placeholder.com/150" }}
//           style={styles.cardImage}
//           resizeMode="cover"
//         />
//       </LinearGradient>
//     </TouchableOpacity>
//   );

//   // ✅ Category block with horizontal list
//   const renderCategory = (cat) => (
//     <View key={cat.id} style={styles.categoryBlock}>
//       <Text style={styles.categoryTitle}>{cat.name}</Text>
//       <FlatList
//         horizontal
//         data={cat.templates}
//         keyExtractor={(item, idx) => `${cat.id}-${item.id || idx}`}
//         renderItem={renderTemplate}
//         showsHorizontalScrollIndicator={false}
//         onEndReached={() => {
//           if (!cat.loadingMore && cat.hasMore) {
//             fetchMoreTemplates(cat.id, cat.page + 1);
//           }
//         }}
//         onEndReachedThreshold={0.3}
//         ListFooterComponent={
//           cat.loadingMore ? (
//             <View style={styles.loader}>
//               <Text style={{ color: "#8b3dff" }}>Loading...</Text>
//             </View>
//           ) : null
//         }
//       />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         ListHeaderComponent={<SearchTemplates />}
//         data={categories}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => renderCategory(item)}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8b3dff" />
//         }
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0d0d0d",
//     padding: 10,
//     paddingLeft: 16,
//   },
//   categoryBlock: {
//     marginBottom: 25,
//     backgroundColor: "#1a1a1a",
//      borderWidth: 1,
//     borderColor: "#4d4d4d",
//     padding: 10,
//     borderRadius: 12,
//   },
//   categoryTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "white",
//   },
//   cardGradient: {
//     borderRadius: 14,
//     padding: 2,
//     marginRight: 15,
//     marginBottom: 15,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cardImage: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 12,
//   },
//   loader: {
//     justifyContent: "center",
//     alignItems: "center",
//     width: 100,
//   },
// });

// export default CategoriesScreen;
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { apiFetch } from "../../apiFetch";
import SearchTemplates from "./SearchTemplate";

const FIXED_HEIGHT = 160;
const PAGE_SIZE = 5;

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // ✅ Load categories (without templates first)
  const loadCategories = async () => {
    try {
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

      // Load first page for each category
      for (const cat of formatted) {
        fetchMoreTemplates(cat.id, 1);
      }
    } catch (err) {
      console.error("⚠️ Error fetching categories:", err);
    }
  };

  // ✅ Fetch paginated templates + calculate dynamic width
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
      let fetched = data.templates || [];
      const hasMore = data.hasMore;

      // ✅ Calculate dynamic width based on image ratio
      const processed = await Promise.all(
        fetched.map(async (t) => {
          if (!t.imageUrl) return { ...t, calcWidth: FIXED_HEIGHT };
          try {
            const { width, height } = await new Promise((resolve, reject) =>
              Image.getSize(
                t.imageUrl,
                (w, h) => resolve({ width: w, height: h }),
                reject
              )
            );
            const aspectRatio = width / height;
            return { ...t, calcWidth: FIXED_HEIGHT * aspectRatio };
          } catch {
            return { ...t, calcWidth: FIXED_HEIGHT };
          }
        })
      );

      // ✅ Update category state
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

  // ✅ Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  // ✅ Template item (just image, dynamic width)
  const renderTemplate = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("templatefeatures", { templateId: item.id })
      }
    >
      <Image
        source={{ uri: item.imageUrl || "https://via.placeholder.com/150" }}
        style={[
          styles.cardImage,
          { width: item.calcWidth, height: FIXED_HEIGHT },
        ]}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  // ✅ Category block
  const renderCategory = (cat) => (
    <View key={cat.id} style={styles.categoryBlock}>
      <Text style={styles.categoryTitle}>{cat.name}</Text>
      <FlatList
        horizontal
        data={cat.templates}
        keyExtractor={(item, idx) => `${cat.id}-${item.id || idx}`}
        renderItem={renderTemplate}
        showsHorizontalScrollIndicator={false}
        onEndReached={() => {
          if (!cat.loadingMore && cat.hasMore) {
            fetchMoreTemplates(cat.id, cat.page + 1);
          }
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          cat.loadingMore ? (
            <View style={styles.loader}>
              <Text style={{ color: "#8b3dff" }}>Loading...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={<SearchTemplates />}
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderCategory(item)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8b3dff"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    padding: 10,
    paddingLeft: 16,
  },
  categoryBlock: {
    marginBottom: 25,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#4d4d4d",
    padding: 10,
    borderRadius: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  cardImage: {
    borderRadius: 12,
    marginRight: 15,
    marginBottom: 15,
  },
  loader: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
});

export default CategoriesScreen;
