import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { apiFetch } from '../../apiFetch';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import ImageCompareSlider from '../Sliders/ImagesComparisonslider';
import { BeforeAfterSlider } from 'expo-image-compare';

import Loader from '../../Components/Loader/Loader';

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const EnhanceImageModal = ({ visible, onClose, selectedImage, modeldetails, prompt }) => {
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const enhanceImage = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.warn('No userId found');
        return;
      }

      const response = await fetch(selectedImage.uri);
      const blob = await response.blob();
      const filename = `original_${Date.now()}.jpg`;
      const storageRef = ref(getStorage(app), `PicNovaOriginalimages/${filename}`);
      const uploadTask = await uploadBytesResumable(storageRef, blob);
      const originalUrl = await getDownloadURL(uploadTask.ref);

      const replicateRes = await apiFetch(`/replicate/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: originalUrl, userId, modelUsed: modeldetails, prompt }),
      });

      const { enhancedImageUrl } = await replicateRes.json();
      setEnhancedImage(enhancedImageUrl);
    } catch (error) {
      console.error('Enhance failed', error);
    } finally {
      setLoading(false);
    }
  };
  const resetModal = () => {
    setEnhancedImage(null);
    setLoading(false);
    onClose();
  };
  const downloadEnhancedImage = async () => {
    if (!enhancedImage) return;
    const fileUri = FileSystem.documentDirectory + 'enhanced.jpg';
    await FileSystem.downloadAsync(enhancedImage, fileUri);
    await MediaLibrary.saveToLibraryAsync(fileUri);
    alert('Image downloaded to gallery');
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={resetModal}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Display Enhanced Image Slider or Original Image */}
          {selectedImage?.uri && enhancedImage ? (
            <View style={styles.sliderWrapper}>
              <BeforeAfterSlider
                beforeImage={{ uri: selectedImage.uri }}
                afterImage={{ uri: enhancedImage }}
                height={300}
              />
            </View>
          ) : selectedImage?.uri ? (
            <Image source={{ uri: selectedImage.uri }} style={styles.modalImage} />
          ) : null}

          {/* Enhance / Download Buttons */}
          {!loading && !enhancedImage && (
            <TouchableOpacity style={styles.enhanceButton} onPress={enhanceImage}>
              <Text style={styles.enhanceText}>Enhance Image</Text>
            </TouchableOpacity>
          )}

          {enhancedImage && (
            <TouchableOpacity style={styles.downloadButton} onPress={downloadEnhancedImage}>
              <Text style={styles.enhancedownloadText}>Download</Text>
            </TouchableOpacity>
          )}

          {/* Loader overlay */}
          {loading && (
            <View style={styles.loaderOverlay}>
              <Loader />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '60%',
    backgroundColor: '#8b3dff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 5,
    backgroundColor: 'black',
    borderRadius: 50,
  },
  modalImage: {
    marginTop: 30,
    width: '100%',
    height: '70%',
    resizeMode: 'contain',
    marginBottom: 15,
  },
  enhanceButton: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 25,
    marginTop: 10,
    width: '70%',
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: '#FFFFFF',
    borderColor: 'black',
    padding: 12,
    borderRadius: 25,
    marginTop: 10,
    width: '70%',
    alignItems: 'center',
  },
  enhanceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  enhancedownloadText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  sliderWrapper: {
    width: '100%',
    height: 300,
    marginBottom: 15,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});

export default EnhanceImageModal;