import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import EnhanceImageModal from './EnhanceModel';

const SelectImageGallery = () => {
  const { theme } = useTheme();
  const [modeldetail, setModedetail] = useState(
    'sczhou/codeformer:cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2'
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant media library permission to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.featureButton} onPress={openImagePicker}>
        <LinearGradient
          colors={['#8b3dff', '#a86bff']}
          style={styles.squareBox}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon name="photo-library" size={30} color="#fff" />
        </LinearGradient>
        <Text style={[styles.featureLabel,{color: theme.text}]}>Enhance Image</Text>
      </TouchableOpacity>

      <EnhanceImageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedImage={selectedImage}
        modeldetails={modeldetail}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#F8F9FA',
    flex: 1,
  },
  featureButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  squareBox: {
    width: 70,
    height: 70,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  featureLabel: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SelectImageGallery;
