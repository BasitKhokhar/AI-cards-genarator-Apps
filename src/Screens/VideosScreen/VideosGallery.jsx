import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const VideosGallery = ({ userId }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/videos/user/${userId}`)
      .then(res => res.json())
      .then(setVideos)
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Generated Videos</Text>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Video
            source={{ uri: item.url }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay={false}
            useNativeControls
            style={{ height: 200, marginBottom: 20 }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});

export default VideosGallery;
