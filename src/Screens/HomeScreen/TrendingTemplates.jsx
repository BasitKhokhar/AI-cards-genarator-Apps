// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import MasonryList from "@react-native-seoul/masonry-list";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { apiFetch } from "../../apiFetch";

// const TrendingTemplates = () => {
//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       try {
//         const res = await apiFetch("/cards/trendingtemplates/home", {}, navigation);
//         if (!res.ok) throw new Error("Failed to fetch");

//         const data = await res.json();

//         // ✅ Preload image sizes to keep Masonry grid balanced
//         const processed = await Promise.all(
//           data.map(async (item) => {
//             const uri = item.imageUrl || "https://via.placeholder.com/150";
//             try {
//               const { width, height } = await new Promise((resolve) => {
//                 Image.getSize(
//                   uri,
//                   (w, h) => resolve({ width: w, height: h }),
//                   () => resolve({ width: 1, height: 1 })
//                 );
//               });
//               return { ...item, width, height };
//             } catch {
//               return { ...item, width: 1, height: 1 };
//             }
//           })
//         );

//         setTemplates(processed);
//       } catch (err) {
//         console.error("❌ Error fetching trending templates:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTemplates();
//   }, [navigation]);

//   const renderItem = ({ item }) => {
//     const aspectRatio = item.width / item.height || 1;
//     const isPortrait = aspectRatio < 1;
//     const cardHeight = isPortrait ? 280 : 180; // ✅ keeps portrait cards taller

//     return (
//       <TouchableOpacity
//         activeOpacity={0.9}
//         style={[styles.card, { height: cardHeight }]}
//         onPress={() => navigation.navigate("templatefeatures", { templateId: item.id })}
//       >
//         <Image
//           source={{ uri: item.imageUrl }}
//           style={[styles.image, { aspectRatio }]}
//           resizeMode="cover"
//         />
//         <View style={styles.cardOverlay}>
//           <Text style={styles.cardTitle} numberOfLines={1}>
//             {item.title}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#8b3dff" />
//       </View>
//     );
//   }

//   if (templates.length === 0) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyText}>No trending templates found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Icon name="trending-up" size={24} color="#8b3dff" />
//         <Text style={styles.headerText}>Trending Templates</Text>
//       </View>

//       {/* Masonry Grid */}
//       <MasonryList
//         data={templates}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={2}
//         renderItem={renderItem}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#121212",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingTop: 20,
//     marginBottom: 6,
//   },
//   headerText: {
//     marginLeft: 8,
//     fontSize: 20,
//     fontWeight: "700",
//     color: "white",
//   },
//   listContainer: {
//     paddingHorizontal: 10,
//     paddingBottom: 20,
//   },
//   card: {
//     flex: 1,
//     margin: 6,
//     borderRadius: 14,
//     backgroundColor: "#1E1E1E",
//     overflow: "hidden",
//     elevation: 3,
//   },
//   image: {
//     width: "100%",
//     height: undefined,
//     borderRadius: 12,
//   },
//   cardOverlay: {
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//     paddingVertical: 8,
//     backgroundColor: "rgba(0,0,0,0.55)",
//   },
//   cardTitle: {
//     color: "white",
//     fontSize: 14,
//     fontWeight: "600",
//     textAlign: "center",
//   },
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#121212",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#121212",
//   },
//   emptyText: {
//     color: "#aaa",
//     fontSize: 16,
//   },
// });

// export default TrendingTemplates;

import React, { useEffect, useState, useCallback } from "react";
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
import Icon from "react-native-vector-icons/MaterialIcons";
import { apiFetch } from "../../apiFetch";

const PAGE_SIZE = 10;

const TrendingTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();

  // ✅ Fetch templates with page control
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

        const { templates: fetched, hasMore: moreAvailable } = data;
        if (!Array.isArray(fetched)) return;

        const processed = await Promise.all(
          fetched.map(
            (item) =>
              new Promise((resolve) => {
                const uri = item.imageUrl || "https://via.placeholder.com/150";
                Image.getSize(
                  uri,
                  (w, h) => resolve({ ...item, width: w, height: h }),
                  () => resolve({ ...item, width: 1, height: 1 })
                );
              })
          )
        );

        // ✅ Append new data correctly
        if (pageNum === 1) setTemplates(processed);
        else
          setTemplates((prev) => {
            const ids = new Set(prev.map((t) => t.id));
            const newOnes = processed.filter((t) => !ids.has(t.id));
            return [...prev, ...newOnes];
          });

        setHasMore(moreAvailable);
      } catch (err) {
        console.error("❌ Error fetching templates:", err);
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

  // ✅ Properly load next page
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTemplates(nextPage);
    }
  }, [page, loadingMore, hasMore, fetchTemplates]);

  // ✅ Avoid double-calls on fast scroll
  const handleEndReached = useCallback(() => {
    if (!loadingMore && hasMore) {
      handleLoadMore();
    }
  }, [loadingMore, hasMore, handleLoadMore]);

  const renderItem = ({ item }) => {
    const aspectRatio = item.width / item.height || 1;
    const isPortrait = aspectRatio < 1;
    const cardHeight = isPortrait ? 280 : 180;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.card, { height: cardHeight }]}
        onPress={() =>
          navigation.navigate("templatefeatures", { templateId: item.id })
        }
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={[styles.image, { aspectRatio }]}
          resizeMode="cover"
        />
        <View style={styles.cardOverlay}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#8b3dff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="trending-up" size={24} color="#8b3dff" />
        <Text style={styles.headerText}>Trending Templates</Text>
      </View>

      <MasonryList
        data={templates}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color="#8b3dff" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 6,
  },
  headerText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  listContainer: { paddingHorizontal: 10, paddingBottom: 20 },
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 14,
    backgroundColor: "#1E1E1E",
    overflow: "hidden",
    elevation: 3,
  },
  image: { width: "100%", height: undefined, borderRadius: 12 },
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
});

export default TrendingTemplates;
