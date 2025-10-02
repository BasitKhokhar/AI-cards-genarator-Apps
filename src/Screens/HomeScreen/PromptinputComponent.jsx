import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../Context/ThemeContext';
import { apiFetch } from '../../apiFetch';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const PromptInputComponent = ({ defaultModel }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [modelUsed, setModelUsed] = useState(defaultModel);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      Alert.alert('Validation', 'Prompt cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No user ID found. Please log in.');
        return;
      }

      const response = await apiFetch(`/replicate/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          modelUsed: modelUsed,
          prompt: prompt.trim(),
          imageUrl: '',
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (data?.enhancedImageUrl) {
        setImageUrl(data.enhancedImageUrl);
        Alert.alert('Success', 'Image enhanced successfully!');
      } else {
        Alert.alert('Error', 'No image returned from backend.');
      }
    } catch (error) {
      console.error('Prompt error:', error);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
      setPrompt('');
    }
  };

  const handleDownload = async () => {
    try {
      if (!imageUrl) return;

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow gallery access.');
        return;
      }

      const filename = FileSystem.documentDirectory + `enhanced_${Date.now()}.jpg`;
      const download = await FileSystem.downloadAsync(imageUrl, filename);
      await MediaLibrary.saveToLibraryAsync(download.uri);
      Alert.alert('Downloaded', 'Image saved to gallery.');
    } catch (err) {
      console.error('Download failed:', err);
      Alert.alert('Error', 'Download failed.');
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
  };

  return (
    <View style={styles.maincontainer}>
      {!imageUrl && (
        <View style={styles.container}>
          <TextInput
            placeholder="Write your prompt..."
            placeholderTextColor="#999"
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Icon name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("SimpleImageEditor")}
      >
        <LinearGradient
          colors={['#8b3dff', '#a86bff']}
          style={styles.squareBox}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={{ color: "white", fontSize: 16,fontWeight:'600' }}>Open Image Editor</Text>
        </LinearGradient>

      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#8b3dff" style={{ marginTop: 20 }} />}

      {imageUrl && (
        <View style={styles.imageSection}>
          {/*  Close Icon */}
          <TouchableOpacity style={styles.closeIcon} onPress={handleRemoveImage}>
            <Icon name="close" size={26} color="#fff" />
          </TouchableOpacity>

          <Image
            source={{ uri: imageUrl }}
            style={styles.generatedImage}
            resizeMode="contain"
          />

          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
            <Icon name="file-download" size={24} color="#fff" />
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    maincontainer: {
    flexDirection: 'column',
    gap:20,
    marginHorizontal: 16,
    // marginTop: 20,
    // backgroundColor: '#f0f0f0',
    // borderRadius: 10,
    // borderWidth: 2,
    // borderColor: '#8b3dff',
    // paddingLeft: 10,
    // alignItems: 'center',
    // elevation: 2,
  },
  container: {
    flexDirection: 'row',
    // marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#8b3dff',
    paddingLeft: 10,
    alignItems: 'center',
    elevation: 2,
  },
    squareBox: {
       width: "100%",            // 👈 makes it full width
    paddingVertical: 12,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignSelf: "stretch",
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#333',

  },
  button: {
    backgroundColor: '#8b3dff',
    padding: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSection: {
    marginTop: 25,
    alignItems: 'center',
    position: 'relative',
  },
  generatedImage: {
    width: '90%',
    height: 300,
    borderRadius: 12,
  },
  closeIcon: {
    position: 'absolute',
    top: -10,
    right: 15,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 20,
  },
  downloadBtn: {
    flexDirection: 'row',
    backgroundColor: '#8b3dff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 15,
    alignItems: 'center',
  },
  downloadText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default PromptInputComponent;


// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Alert,
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// import { useTheme } from '../../Context/ThemeContext';
// import Constants from 'expo-constants';
// import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
// import { apiFetch } from '../../apiFetch';
// const PromptInputComponent = ({ defaultModel = "stability-ai/sdxl:free" }) => {
//   const { theme } = useTheme();
//   const [prompt, setPrompt] = useState('');
//   const [modelUsed, setModelUsed] = useState(defaultModel);
//   const [loading, setLoading] = useState(false);
//   const [imageUrl, setImageUrl] = useState(null);

//   const handleSubmit = async () => {
//     if (!prompt.trim()) {
//       Alert.alert('Validation', 'Prompt cannot be empty');
//       return;
//     }

//     try {
//       setLoading(true);
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) {
//         Alert.alert('Error', 'No user ID found. Please log in.');
//         return;
//       }

//       const response = await apiFetch(`/openrouter/enhance`, {
//         method: 'POST',
//         body: JSON.stringify({
//           userId: parseInt(userId),
//           modelUsed: modelUsed,
//           prompt: prompt.trim(),
//         }),
//       });

//       const data = await response.json();
//       console.log('API Response:', data);

//       if (data?.generatedImageUrl) {
//         setImageUrl(data.generatedImageUrl);
//         Alert.alert('Success', 'Image generated successfully!');
//       } else {
//         Alert.alert('Error', 'No image returned from backend.');
//       }
//     } catch (error) {
//       console.error('Prompt error:', error);
//       Alert.alert('Error', 'Something went wrong.');
//     } finally {
//       setLoading(false);
//       setPrompt('');
//     }
//   };

//   const handleDownload = async () => {
//     try {
//       if (!imageUrl) return;

//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Required', 'Please allow gallery access.');
//         return;
//       }

//       const filename = FileSystem.documentDirectory + `generated_${Date.now()}.jpg`;
//       const download = await FileSystem.downloadAsync(imageUrl, filename);
//       await MediaLibrary.saveToLibraryAsync(download.uri);
//       Alert.alert('Downloaded', 'Image saved to gallery.');
//     } catch (err) {
//       console.error('Download failed:', err);
//       Alert.alert('Error', 'Download failed.');
//     }
//   };

//   const handleRemoveImage = () => {
//     setImageUrl(null);
//   };

//   return (
//     <View>
//       {!imageUrl && (
//         <View style={styles.container}>
//           <TextInput
//             placeholder="Write your prompt..."
//             placeholderTextColor="#999"
//             style={styles.input}
//             value={prompt}
//             onChangeText={setPrompt}
//           />
//           <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//             <Icon name="send" size={22} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       )}

//       {loading && <ActivityIndicator size="large" color="#8b3dff" style={{ marginTop: 20 }} />}

//       {imageUrl && (
//         <View style={styles.imageSection}>
//           {/* Close Icon */}
//           <TouchableOpacity style={styles.closeIcon} onPress={handleRemoveImage}>
//             <Icon name="close" size={26} color="#fff" />
//           </TouchableOpacity>

//           <Image
//             source={{ uri: imageUrl }}
//             style={styles.generatedImage}
//             resizeMode="contain"
//           />

//           <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
//             <Icon name="file-download" size={24} color="#fff" />
//             <Text style={styles.downloadText}>Download</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     marginHorizontal: 16,
//     marginTop: 20,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 30,
//     borderWidth: 2,
//     borderColor: '#8b3dff',
//     paddingLeft: 10,
//     alignItems: 'center',
//     elevation: 2,
//   },
//   input: {
//     flex: 1,
//     height: 45,
//     paddingHorizontal: 10,
//     fontSize: 15,
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#8b3dff',
//     padding: 10,
//     borderRadius: 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageSection: {
//     marginTop: 25,
//     alignItems: 'center',
//     position: 'relative',
//   },
//   generatedImage: {
//     width: '90%',
//     height: 300,
//     borderRadius: 12,
//   },
//   closeIcon: {
//     position: 'absolute',
//     top: -10,
//     right: 15,
//     zIndex: 1,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 6,
//     borderRadius: 20,
//   },
//   downloadBtn: {
//     flexDirection: 'row',
//     backgroundColor: '#8b3dff',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 30,
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   downloadText: {
//     color: '#fff',
//     fontWeight: '600',
//     marginLeft: 8,
//     fontSize: 16,
//   },
// });

// export default PromptInputComponent;
