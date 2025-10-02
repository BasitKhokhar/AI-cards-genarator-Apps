import React, { useEffect, useState } from 'react';
import { View, Image, Text, useWindowDimensions } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';

const DATA = [
  { id: '1', uri: 'https://picsum.photos/id/1015/300/500' },
  { id: '2', uri: 'https://picsum.photos/id/1018/400/600' },
  { id: '3', uri: 'https://picsum.photos/id/1016/500/300' },
  { id: '4', uri: 'https://picsum.photos/id/1025/600/400' },
  { id: '5', uri: 'https://picsum.photos/id/1035/500/800' },
  { id: '6', uri: 'https://picsum.photos/id/1042/800/500' },
  // Add more image URIs with various aspect ratios
];

const ImageCard = ({ uri }) => {
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    Image.getSize(uri, (width, height) => {
      setAspectRatio(width / height);
    });
  }, [uri]);

  return (
    <View style={{ borderRadius: 10, overflow: 'hidden', margin: 5 }}>
      <Image
        source={{ uri }}
        style={{
          width: '100%',
          aspectRatio,
          borderRadius: 10,
        }}
        resizeMode="cover"
      />
    </View>
  );
};

export default function GalleryScreen() {
  const { width } = useWindowDimensions();
  return (
    <View style={{ flex: 1, paddingTop: 40, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 10 }}>Pinterest Gallery</Text>
      <MasonryList
        data={DATA}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ImageCard uri={item.uri} />}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      />
    </View>
  );
}
