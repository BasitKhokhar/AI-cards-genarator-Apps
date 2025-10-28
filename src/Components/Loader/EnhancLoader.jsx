// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { MotiView, AnimatePresence } from "moti";
// import { useNavigation } from "@react-navigation/native";
// import { colors } from "../../Themes/colors";
// import { apiFetch } from "../../apiFetch";


// export const EnhanceLoader = ({ userId, modelUsed, payload,onFinish }) => {
//   const [progressText, setProgressText] = useState("Starting...");
//   const [progress, setProgress] = useState(0);
//   const [showLoader, setShowLoader] = useState(true);
//   const navigation = useNavigation();

//   useEffect(() => {
//     // Progress text stages
//     const stages = [
//       { t: 0, text: "Preparing input..." },
//       { t: 4000, text: "Running AI model..." },
//       { t: 5000, text: "Processing output..." },
//       { t: 6000, text: "Finalizing..." },
//     ];
//     stages.forEach((s) => setTimeout(() => setProgressText(s.text), s.t));

//     // Animated percentage progress
//     let current = 0;
//     const interval = setInterval(() => {
//       current += Math.floor(Math.random() * 6) + 3; // 3–8% increments
//       if (current >= 100) current = 100;
//       setProgress(current);
//     }, 300);

//     // 🔥 Single backend API call (this will later use your model)
//     const callEnhancement = async () => {
//       try {
//         const res = await apiFetch(`/Model/mock-enhance`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             userId,
//             modelUsed,
//             ...payload, // send everything (prompt, aspect ratio, etc.)
//           }),
//         });
//         const data = await res.json();
//          console.log("data coming from api",data)
//         // Wait for visual completion before navigating
//         setTimeout(() => {
//           clearInterval(interval);
//           setShowLoader(false);
//           navigation.navigate("AitemplateResultsScreen", {
//             imageUrl: data.enhancedImageUrl,
//             prompt: payload.query,
//             model: modelUsed,
//             createdAt: data.createdAt,
//           });
//            // ✅ Now trigger onFinish properly here
//       if (onFinish) onFinish();
//         }, 1000);
//       } catch (err) {
//         clearInterval(interval);
//         setProgressText("⚠️ Network or server error");
//         setTimeout(() => setShowLoader(false), 2000);
//       }
//     };

//     callEnhancement();
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <AnimatePresence>
//       {showLoader && (
//         <MotiView
//           from={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ type: "timing", duration: 300 }}
//           style={styles.overlay}
//         >
//           <MotiView
//             from={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ type: "timing", duration: 400 }}
//             style={styles.card}
//           >
//             {/* Rotating loader circle */}
//             <MotiView
//               from={{ rotate: "0deg" }}
//               animate={{ rotate: "360deg" }}
//               transition={{ loop: true, type: "timing", duration: 1000 }}
//               style={styles.loaderCircle}
//             />

//             {/* Animated percentage */}
//             <Text style={styles.percentage}>{progress}%</Text>

//             {/* Changing status text */}
//             <Text style={styles.text}>{progressText}</Text>
//           </MotiView>
//         </MotiView>
//       )}
//     </AnimatePresence>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     position: "absolute",
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//     height: "100%",
//   },
//   card: {
//     backgroundColor: colors.cardsbackground,
//     padding: 25,
//     borderRadius: 20,
//     alignItems: "center",
//     width: 220,
//   },
//   loaderCircle: {
//     width: 70,
//     height: 70,
//     borderWidth: 5,
//     borderColor: colors.border,
//     borderTopColor: colors.primary,
//     borderRadius: 35,
//     marginBottom: 12,
//   },
//   percentage: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: colors.primary,
//     marginBottom: 6,
//   },
//   text: {
//     color: colors.text,
//     fontSize: 15,
//     fontWeight: "500",
//     textAlign: "center",
//   },
// });
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MotiView, AnimatePresence } from "moti";
import Svg, { Circle } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../Themes/colors";
import { apiFetch } from "../../apiFetch";

export const EnhanceLoader = ({ userId, modelUsed, payload, onFinish }) => {
  // console.log("payload in enahcer component",payload)
  const [progressText, setProgressText] = useState("Starting...");
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const navigation = useNavigation();

  const size = 90; // circle size
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

useEffect(() => {
  // Progress text stages (match backend)
  const stages = [
    { t: 0, text: "Preparing input..." },
    { t: 4000, text: "Running AI model..." },
    { t: 7000, text: "Processing output..." },
    { t: 9000, text: "Finalizing..." },
  ];
  stages.forEach((s) => setTimeout(() => setProgressText(s.text), s.t));

  // Simulate smooth progress over 10 seconds
  const totalDuration = 10000; // 10s same as backend
  const intervalTime = 100; // update every 100ms
  let current = 0;
  const increment = 100 / (totalDuration / intervalTime); // 1% every 100ms = 10s total

  const interval = setInterval(() => {
    current += increment;
    if (current >= 100) current = 100;
    setProgress(current);
  }, intervalTime);

  // Call backend simultaneously
  const callEnhancement = async () => {
    try {
      const res = await apiFetch(`/Model/mock-enhance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, modelUsed, ...payload }),
      });
      const data = await res.json();

      // Stop loader when both progress = 100 and API done
      setTimeout(() => {
        clearInterval(interval);
        setShowLoader(false);
        navigation.navigate("AitemplateResultsScreen", {
          imageUrl: data.enhancedImageUrl,
          prompt: payload.query,
          model: modelUsed,
          createdAt: data.createdAt,
          resolution:payload.resolution,
          aspectratio:payload.aspectRatio,
        });
        if (onFinish) onFinish();
      }, 1000); // small delay for smoother finish
    } catch (err) {
      clearInterval(interval);
      setProgressText("⚠️ Network or server error");
      setTimeout(() => setShowLoader(false), 2000);
    }
  };

  callEnhancement();

  return () => clearInterval(interval);
}, []);

  return (
    <AnimatePresence>
      {showLoader && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "timing", duration: 300 }}
          style={styles.overlay}
        >
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "timing", duration: 400 }}
            style={styles.card}
          >
            {/* Circular progress indicator */}
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Svg width={size} height={size}>
                {/* Background ring */}
                <Circle
                  stroke={colors.border}
                  fill="none"
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                />
                {/* Foreground progress ring */}
                <Circle
                  stroke={colors.primary}
                  fill="none"
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              </Svg>

              {/* Rotating overlay for AI “movement” */}
              <MotiView
                from={{ rotate: "0deg" }}
                animate={{ rotate: "360deg" }}
                transition={{ loop: true, type: "timing", duration: 1500 }}
                style={styles.rotatorOverlay}
              />
              <Text style={styles.percentage}>{progress}%</Text>
            </View>

            {/* Changing status text */}
            <Text style={styles.text}>{progressText}</Text>
          </MotiView>
        </MotiView>
      )}
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  card: {
    backgroundColor: colors.cardsbackground,
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    width: 220,
  },
  rotatorOverlay: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: colors.primary,
  },
  percentage: {
    position: "absolute",
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  text: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 12,
  },
});
