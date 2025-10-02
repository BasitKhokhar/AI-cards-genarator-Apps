import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../Components/Loader/Loader';
import { useTheme } from '../../Context/ThemeContext';
import { apiFetch } from '../../apiFetch';
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const AIPicsFeatureList = () => {
  const { theme } = useTheme();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await apiFetch(`/aipicsfeatures/ai_pics_Featureslist`);
        const data = await res.json();
        setFeatures(data);
      } catch (error) {
        console.error('Failed to fetch features:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const renderFeature = ({ item }) => (
    <TouchableOpacity
      style={[styles.featureContainer, { backgroundColor: theme.featuresboxbg }]}
      onPress={() =>
        navigation.navigate('AIpicsfeaturedetail', {
          feature: item,
        })
      }
    >
      <Image source={{ uri: item.image_url }} style={styles.featureImage} />
      <View style={styles.textContainer}>
        <Text style={[styles.featureTitle, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.featureDescription, { color: theme.text }]}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
        {/* <ActivityIndicator size="large" color="#8b3dff" /> */}
      </View>
    );
  }

  return (
    <FlatList
      data={features}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderFeature}
      contentContainerStyle={[styles.listContainer, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    // backgroundColor: '#f8f8f8',
  },
  featureContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  featureImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AIPicsFeatureList;
