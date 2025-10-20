import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const GradientIcon = ({
  iconName = "home",
  iconSize = 40,
  gradientColors = ['#00ffa3', '#00b3ff'],
  style = {},
}) => {
  return (
    <View style={[styles.container, style]}>
      <MaskedView
        maskElement={
          <MaterialIcons name={iconName} size={iconSize} color="black" />
        }
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: iconSize, height: iconSize }}
        />
      </MaskedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GradientIcon;
