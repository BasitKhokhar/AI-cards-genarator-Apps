import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../Context/ThemeContext";
import ImageSlider from "../../Components/Sliders/Slider";
import CategoriesScreen from "./CardsCategories";
import SearchHeader from "./HomeinputSearch";
// import CategoriesWithTemplates from "./CardsCategories";
import EnhancedImageGallery from "./EnhancedImagesGallery";
import PromptInputComponent from "./PromptinputComponent";
import FeaturedGrid from "./Featuredgrid";
import SimpleImageEditor from "./SimpleEditing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../../Components/Loader/Loader";
import Constants from "expo-constants";
import { apiFetch } from "../../apiFetch";   

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [filterExpanded, setFilterExpanded] = useState(false);

  const [homeData, setHomeData] = useState({
    sliderData: [],
    EnhancedGalleryData: [],
  });

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({ headerShown: false });
    }
  }, []);

  const fetchData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      console.log("User ID from AsyncStorage:", storedUserId);

      const endpoints = [
        { key: "sliderData", url: `/content/sliderimages` },
        // { key: "EnhancedGalleryData", url: `/replicate/enhanced-images?userId=${storedUserId}` },
      ];

      const responses = await Promise.all(
        endpoints.map(async (endpoint) => {
          try {
            const res = await apiFetch(endpoint.url, { method: "GET" }); // ✅ use apiFetch
            const data = await res.json();
            return { key: endpoint.key, data };
          } catch (err) {
            console.error(`Error fetching ${endpoint.key}:`, err);
            return { key: endpoint.key, data: [] };
          }
        })
      );

      const updated = responses.reduce((acc, { key, data }) => {
        acc[key] = data;
        return acc;
      }, {});

      setHomeData(updated);
    } catch (error) {
      console.error("Home data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= 0) {
      handleRefresh();
    }
  };

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: theme.background }]}>
        <Loader />
      </View>
    );
  }

  const sections = [
  { key: "slider", render: () => <ImageSlider sliderData={homeData.sliderData} /> },
  { key: "Searchheader", render: () => <SearchHeader onToggle={(open) => setFilterExpanded(open)} /> },
  { key: "categoriesWithTemplates", render: () => <CategoriesScreen /> },
];

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => <View>{item.render()}</View>}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      initialNumToRender={2}
      windowSize={5}
      maxToRenderPerBatch={3}
      updateCellsBatchingPeriod={100}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal:16
  },
  listContainer: {
    
    paddingBottom: 120,
    backgroundColor: "#0d0d0d",
  },
});

export default HomeScreen;
