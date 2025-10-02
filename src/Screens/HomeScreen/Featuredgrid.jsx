import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
// import SelectImageGallery from './SelectImageGallery';
import SelectImageGallery from './SelectImageGallery';
import PromptSelectGallery from './PropmtSelectGallery';
import RemoveBGGallerySelction from '../../Components/Models/RemoveBGGallerySelction';
const FeaturedGrid = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container,{backgroundColor: theme.background}]}>
      <Text style={[styles.heading,{color: theme.text}]}>Featured</Text>
      <View style={styles.grid}>
        <View style={styles.column}><SelectImageGallery /></View>
        <View style={styles.column}><RemoveBGGallerySelction /></View>
        <View style={styles.column}><PromptSelectGallery /></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    marginLeft:15
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
});

export default FeaturedGrid;
