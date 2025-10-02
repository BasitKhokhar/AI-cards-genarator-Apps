
import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
} from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import MasonryList from '@react-native-seoul/masonry-list';

const EnhancedImageGallery = ({ EnhancedGallerydata }) => {
  const { theme } = useTheme();
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [imagesWithSize, setImagesWithSize] = useState([]);

  useEffect(() => {
    const fetchImageSizes = async () => {
      const updatedData = await Promise.all(
        EnhancedGallerydata.map(async (item) => {
          try {
            const size = await new Promise((resolve, reject) => {
              Image.getSize(
                item.url,
                (width, height) => resolve({ width, height }),
                (err) => resolve({ width: 1, height: 1 }) // fallback
              );
            });
            return { ...item, ...size };
          } catch {
            return { ...item, width: 1, height: 1 };
          }
        })
      );
      setImagesWithSize(updatedData);
    };

    fetchImageSizes();
  }, [EnhancedGallerydata]);

  const handleImagePress = (id) => {
    setSelectedImageId(id === selectedImageId ? null : id);
  };

  const handleDownload = async (url) => {
    try {
      setDownloading(true);
      const fileUri = FileSystem.documentDirectory + `enhanced_${Date.now()}.jpg`;
      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Downloaded', 'Image saved to gallery');
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Could not download the image.');
    } finally {
      setDownloading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedImageId === item.id;
    const aspectRatio = item.width / item.height;
    const fixedWidth = 110;
    const dynamicHeight = fixedWidth / aspectRatio;

    return (
      <TouchableOpacity onPress={() => handleImagePress(item.id)} style={styles.imageWrapper}>
        <Image
          source={{ uri: item.url }}
          style={[
            styles.image,
            {
              width: '100%',
              height: dynamicHeight,
              borderColor: isSelected ? '#8b3dff' : '#ccc',
            },
          ]}
          resizeMode="cover"
        />
        {isSelected && (
          <TouchableOpacity
            style={styles.downloadIcon}
            onPress={() => handleDownload(item.url)}
          >
            <Ionicons name="arrow-down-circle" size={28} color="white" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Your Gallery</Text>
      {downloading && <ActivityIndicator size="large" color="#8b3dff" />}
      <MasonryList
        data={imagesWithSize}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No enhanced images yet.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginVertical: 15,
    marginLeft: 15,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 5,
    flex: 1,
  },
  image: {
    borderRadius: 8,
    borderWidth: 2,
  },
  downloadIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 2,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
});

export default EnhancedImageGallery;

// import React, { useState } from 'react';
// import {
//   View,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Text,
// } from 'react-native';
// import { useTheme } from '../context/ThemeContext';
// import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
// import { Ionicons } from '@expo/vector-icons';

// const EnhancedImageGallery = ({ EnhancedGallerydata }) => {
//   const { theme } = useTheme();
//   const [selectedImageId, setSelectedImageId] = useState(null);
//   const [downloading, setDownloading] = useState(false);

//   const handleImagePress = (id) => {
//     setSelectedImageId(id === selectedImageId ? null : id);
//   };

//   const handleDownload = async (url) => {
//     try {
//       setDownloading(true);
//       const fileUri = FileSystem.documentDirectory + `enhanced_${Date.now()}.jpg`;
//       const { uri } = await FileSystem.downloadAsync(url, fileUri);
//       await MediaLibrary.saveToLibraryAsync(uri);
//       Alert.alert('Downloaded', 'Image saved to gallery');
//     } catch (error) {
//       console.error('Download error:', error);
//       Alert.alert('Error', 'Could not download the image.');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const renderItem = ({ item }) => {
//     const isSelected = selectedImageId === item.id;

//     return (
//       <TouchableOpacity onPress={() => handleImagePress(item.id)} style={styles.imageWrapper}>
//         <Image source={{ uri: item.url }} style={styles.image} />
//         {isSelected && (
//           <TouchableOpacity
//             style={styles.downloadIcon}
//             onPress={() => handleDownload(item.url)}
//           >
//             <Ionicons name="arrow-down-circle" size={32} color="white" />
//           </TouchableOpacity>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={[styles.container,{backgroundColor: theme.background}]}>
//       <Text style={[styles.heading,{color: theme.text}]}>Your Gallery</Text>
//       {downloading && <ActivityIndicator size="large" color="#8b3dff" />}
//       <FlatList
//         data={EnhancedGallerydata}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={3}
//         renderItem={renderItem}
//         columnWrapperStyle={styles.row}
//         ListEmptyComponent={
//           <Text style={[styles.emptyText,{color: theme.text}]}>No enhanced images yet.</Text>
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // backgroundColor: '#F8F9FA',
//     flex: 1,
//     padding: 10,
//   },
//   heading: {
//     color: 'black',
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'left',
//     marginVertical: 15,
//     marginLeft:15
//   },
//   row: {
//     justifyContent: 'space-between',
//   },
//   imageWrapper: {
//     position: 'relative',
//     margin: 5,
//   },
//   image: {
//     width: 110,
//     height: 110,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor:'#8b3dff'
//   },
//   downloadIcon: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     borderRadius: 20,
//     padding: 2,
//   },
//   emptyText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#777',
//     marginTop: 20,
//   },
// });

// export default EnhancedImageGallery;


// import React, { useState } from 'react';
// import {
//   View,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Text,
//   Dimensions,
// } from 'react-native';
// import { useTheme } from '../context/ThemeContext';
// import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
// import { Ionicons } from '@expo/vector-icons';
// import MasonryList from '@react-native-seoul/masonry-list';

// const EnhancedImageGallery = ({ EnhancedGallerydata }) => {
//   const { theme } = useTheme();
//   const [selectedImageId, setSelectedImageId] = useState(null);
//   const [downloading, setDownloading] = useState(false);

//   const handleImagePress = (id) => {
//     setSelectedImageId(id === selectedImageId ? null : id);
//   };

//   const handleDownload = async (url) => {
//     try {
//       setDownloading(true);
//       const fileUri = FileSystem.documentDirectory + `enhanced_${Date.now()}.jpg`;
//       const { uri } = await FileSystem.downloadAsync(url, fileUri);
//       await MediaLibrary.saveToLibraryAsync(uri);
//       Alert.alert('Downloaded', 'Image saved to gallery');
//     } catch (error) {
//       console.error('Download error:', error);
//       Alert.alert('Error', 'Could not download the image.');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const renderItem = ({ item }) => {
//   const isSelected = selectedImageId === item.id;
//   return (
//     <TouchableOpacity onPress={() => handleImagePress(item.id)} style={styles.imageWrapper}>
//       <Image
//         source={{ uri: item.url }}
//         style={[styles.image, { height: item.height || 200 }]} // dynamic height
//         resizeMode="cover"
//       />
//       {isSelected && (
//         <TouchableOpacity
//           style={styles.downloadIcon}
//           onPress={() => handleDownload(item.url)}
//         >
//           <Ionicons name="arrow-down-circle" size={28} color="white" />
//         </TouchableOpacity>
//       )}
//     </TouchableOpacity>
//   );
// };


//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <Text style={[styles.heading, { color: theme.text }]}>Your Gallery</Text>
//       {downloading && <ActivityIndicator size="large" color="#8b3dff" />}
//       <MasonryList
//         data={EnhancedGallerydata}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={3}
//         renderItem={renderItem}
//         ListEmptyComponent={
//           <Text style={[styles.emptyText, { color: theme.text }]}>
//             No enhanced images yet.
//           </Text>
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'left',
//     marginVertical: 15,
//     marginLeft: 15,
//   },
//   imageWrapper: {
//     position: 'relative',
//     borderRadius: 8,
//     overflow: 'hidden',
//     margin: 5,
//   },
//   image: {
//     width: '100%',
//     // aspectRatio: 1, // Helps MasonryList decide layout; adjust based on your actual image ratios
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: '#8b3dff',
//   },
//   downloadIcon: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     borderRadius: 20,
//     padding: 2,
//   },
//   emptyText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#777',
//     marginTop: 20,
//   },
// });

// export default EnhancedImageGallery;
