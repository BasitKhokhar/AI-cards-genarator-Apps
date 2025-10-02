    import React from 'react';
    import { View } from 'react-native';
    import ReactCompareImage from 'react-compare-image';

    const ImageComparisonScreen = () => {
      const leftImageUri = 'https://firebasestorage.googleapis.com/v0/b/basit-b2712.appspot.com/o/PicNovaPromptOriginal%2Foriginal_1752341093271.jpg?alt=media&token=78ef6162-1295-4677-bea3-44d82893a338'; // Replace with your image URI
      const rightImageUri = 'https://firebasestorage.googleapis.com/v0/b/basit-b2712.appspot.com/o/PicNovaPromptEnhanced%2Fenhanced_1752341162670.jpg?alt=media&token=20f3a1f5-acf5-40b0-a894-9953ad9e2910'; // Replace with your image URI

      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ReactCompareImage
            leftImage={leftImageUri}
            rightImage={rightImageUri}
            sliderLineColor="#FF0000" // Optional: Customize slider line color
            sliderLineWidth={3}      // Optional: Customize slider line width
            // Add other props like imageWidth, imageHeight, etc. as needed
          />
        </View>
      );
    };

    export default ImageComparisonScreen;