import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../Context/ThemeContext';
import VideoPromptInputComponent from './VideoPromptinput';
import Loader from '../../Components/Loader/Loader';
import { apiFetch } from '../../apiFetch';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const Videoscreen = () => {
  const { theme } = useTheme();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await apiFetch(`/videos/videosfeatures`);
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
        navigation.navigate('VideoGenerateScreen', {
          feature: item, // Pass full feature details
        })
      }
    >
      <Image source={{ uri: item.image_url }} style={styles.featureImage} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <VideoPromptInputComponent />
      <FlatList
        data={features}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFeature}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
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
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginRight: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Videoscreen;


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useTheme } from '../../Context/ThemeContext';
// import VideoPromptInputComponent from './VideoPromptinput';
// import Loader from '../../Components/Loader/Loader';
// import { apiFetch } from '../../apiFetch';
// import Constants from 'expo-constants';
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
// const Videoscreen = () => {
//   const { theme } = useTheme();
//   const [features, setFeatures] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchFeatures = async () => {
//       try {
//         const res = await apiFetch(`/videos/enhancevideos`);
//         const data = await res.json();
//         setFeatures(data);
//       } catch (error) {
//         console.error('Failed to fetch features:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeatures();
//   }, []);

//   const renderFeature = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.featureContainer, { backgroundColor: theme.featuresboxbg }]}
//       onPress={() =>
//         navigation.navigate('AIpicsfeaturedetail', {
//           feature: item,
//         })
//       }
//     >
//       <Image source={{ uri: item.image_url }} style={styles.featureImage} />
//       {/* <View style={styles.textContainer}>
//         <Text style={[styles.featureTitle, { color: theme.text }]}>{item.name}</Text>
//         <Text style={[styles.featureDescription, { color: theme.text }]}>{item.description}</Text>
//       </View> */}
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <Loader />
//         {/* <ActivityIndicator size="large" color="#8b3dff" /> */}
//       </View>
//     );
//   }

//   return (
//      <View style={[styles.container, { backgroundColor: theme.background }]}>

//       <VideoPromptInputComponent />

//       {/*  The list of features */}
//       <FlatList
//         data={features}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderFeature}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//    container: {
//     flex: 1,
//   },
//   listContainer: {
//     padding: 16,
//     // backgroundColor: '#f8f8f8',
//   },
//   featureContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 12,
//     marginBottom: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     elevation: 2,
//   },
//   featureImage: {
//     width: '100%',
//     height: 150,
//     borderRadius: 10,
//     marginRight: 12,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   featureTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   featureDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default Videoscreen;
