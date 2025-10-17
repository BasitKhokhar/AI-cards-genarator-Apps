// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import Constants from "expo-constants";

// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const SplashScreen4 = ({ onNext }) => {
//   return (
//     <View style={styles.container}>
//       {/* Top Image with Gradient Overlay */}
//       <View style={styles.topcontainer}>
//         <Image
//           source={require("../../../assets/splash33.jpg")}
//           style={styles.image}
//         />
//         <LinearGradient
//           colors={["transparent", "rgba(0,0,0,0.8)"]}
//           style={styles.overlay}
//         >
//           <Text style={styles.title}>Get Ready for a Smart Experience</Text>
//         </LinearGradient>
//       </View>

//       {/* Content Section */}
//       <View style={styles.contentcontainer}>
//         <Text style={styles.description}>
//           Personalized tools, lightning-fast AI features, and modern shopping
//           made for you. Let’s dive in!
//         </Text>

//         <TouchableOpacity onPress={onNext} activeOpacity={0.9} style={styles.buttonWrapper}>
//           <LinearGradient
//             colors={["#8b3dff", "#ff3d9b"]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.button}
//           >
//             <Text style={styles.buttonText}>Next</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0d0d1a", // dark background
//     alignItems: "center",
//   },
//   topcontainer: {
//     width: "100%",
//     height: "70%",
//     position: "relative",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },
//   overlay: {
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//     paddingVertical: 30,
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: "center",
//     textShadowColor: "#8b3dff",
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//     paddingHorizontal: 20,
//   },
//   contentcontainer: {
//     width: "100%",
//     paddingHorizontal: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//   },
//   description: {
//     fontSize: 16,
//     color: "#c9c9e8",
//     textAlign: "center",
//     marginBottom: 20,
//     lineHeight: 22,
//   },
//   buttonWrapper: {
//     width: "100%",
//     borderRadius: 40,
//     shadowColor: "#ff66c4",
//     shadowOpacity: 0.8,
//     shadowRadius: 20,
//     elevation: 8,
//   },
//   button: {
//     paddingVertical: 16,
//     borderRadius: 40,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#ffffff",
//     fontSize: 18,
//     fontWeight: "600",
//     letterSpacing: 1,
//   },
// });

// export default SplashScreen4;
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../Themes/colors";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const SplashScreen4 = ({ onNext }) => {
  return (
    <View style={styles.container}>
      {/* Top Image with Gradient Overlay */}
      <View style={styles.topContainer}>
        <Image
          source={require("../../../assets/splash33.jpg")}
          style={styles.image}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)", colors.bodybackground]}
          style={styles.overlay}
        >
          <Text style={styles.title}>Get Ready for a Smart Experience</Text>
        </LinearGradient>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.description}>
          Personalized tools, lightning-fast AI features, and modern shopping
          made for you. Let’s dive in!
        </Text>

        <TouchableOpacity onPress={onNext} activeOpacity={0.9} style={styles.buttonWrapper}>
          <LinearGradient
            colors={colors.gradients.mintGlow} // using colors file gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bodybackground,
    alignItems: "center",
  },
  topContainer: {
    width: "100%",
    height: "70%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    paddingHorizontal: 20,
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: colors.mutedText,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 40,
    shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
});

export default SplashScreen4;
