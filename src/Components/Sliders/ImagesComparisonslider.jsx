import React, { useRef } from 'react';
import { View, Image, Animated, PanResponder, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ImagesComparisonSlider = ({ originalImageUri, enhancedImageUri }) => {
  const panX = useRef(new Animated.Value(width / 2)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        const newX = Math.max(0, Math.min(width, gestureState.moveX));
        panX.setValue(newX);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
   
      <Image source={{ uri: originalImageUri }} style={styles.image} />

    
      <Animated.View style={[styles.enhancedContainer, { width: panX }]}>
        <Image source={{ uri: enhancedImageUri }} style={styles.image} />
      </Animated.View>

      <Animated.View
        style={[styles.divider, { transform: [{ translateX: panX }] }]}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    // position: 'absolute',
  },
  enhancedContainer: {
    position: 'absolute',
    height: '100%',
    overflow: 'hidden',
  },
  divider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: 'white',
    zIndex: 10,
  },
});

export default ImagesComparisonSlider;
