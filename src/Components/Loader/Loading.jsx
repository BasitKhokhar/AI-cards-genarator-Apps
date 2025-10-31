import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';


function Loading() {
  return (
     <View style={styles.container}>
      <LottieView
        source={require('../../../assets/loading.json')} 
        autoPlay
        loop
        style={{ width: 50, height: 50 }}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    padding:0,
    // backgroundColor:'black'
  },
});
export default Loading;
