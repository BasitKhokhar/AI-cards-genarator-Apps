// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import Loader from "../../Components/Loader/Loader";
// import { useNavigation } from "@react-navigation/native";
// import Constants from "expo-constants";
// import { apiFetch } from "../../apiFetch";
// import { colors } from "../../Themes/colors"; // ✅ imported theme colors
// import * as SecureStore from "expo-secure-store";

// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const FAQ = () => {
//   const navigation = useNavigation();
//   const [faqs, setFaqs] = useState([]);
//   const [expandedIndex, setExpandedIndex] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchFAQs();
//   }, []);

//   const fetchFAQs = async () => {
//     try {
//       setLoading(true);
//       const response = await apiFetch(`/content/faqs`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch FAQs");
//       }
//       const data = await response.json();
//       setFaqs(data);
//     } catch (error) {
//       console.error("Error fetching FAQs:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleExpand = (index) => {
//     setExpandedIndex(expandedIndex === index ? null : index);
//   };

//   return (
//     <ScrollView
//       style={[styles.container, { backgroundColor: colors.bodybackground }]}
//       showsVerticalScrollIndicator={false}
//     >
//       {loading ? (
//         <View style={styles.loaderContainer}>
//           <Loader />
//         </View>
//       ) : (
//         <View style={{ paddingBottom: 80 }}>
//           {faqs.map((faq, index) => (
//             <View key={faq.id} style={styles.card}>
//               <TouchableOpacity
//                 onPress={() => toggleExpand(index)}
//                 style={styles.questionHeader}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.questionText}>{faq.question}</Text>
//                 <Ionicons
//                   name={
//                     expandedIndex === index
//                       ? "chevron-up-outline"
//                       : "chevron-down-outline"
//                   }
//                   size={22}
//                   color={colors.text}
//                 />
//               </TouchableOpacity>

//               {expandedIndex === index && (
//                 <View style={styles.answerBox}>
//                   <Text style={styles.answerText}>{faq.answer}</Text>
//                 </View>
//               )}
//             </View>
//           ))}
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// export default FAQ;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     paddingBottom: 50,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//     height: "100%",
//     borderRadius: 10,
//     backgroundColor: colors.cardsbackground,
//   },
//   card: {
//     marginBottom: 14,
//     borderRadius: 12,
//     overflow: "hidden",
//     backgroundColor: colors.cardsbackground,
//     borderWidth: 1,
//     borderColor: colors.border,
//     // shadowColor: colors.primary,
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   questionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     backgroundColor: colors.cardsbackground,
//   },
//   questionText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: colors.text,
//     flex: 1,
//     paddingRight: 10,
//   },
//   answerBox: {
//     backgroundColor: colors.secondary,
//     padding: 15,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   answerText: {
//     fontSize: 14,
//     color: colors.mutedText,
//     lineHeight: 20,
//   },
// });
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../Components/Loader/Loader";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { apiFetch } from "../../apiFetch";
import { colors } from "../../Themes/colors"; // ✅ imported theme colors

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const FAQ = () => {
  const navigation = useNavigation();
  const [faqs, setFaqs] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/content/faqs`);
      if (!response.ok) {
        throw new Error("Failed to fetch FAQs");
      }
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // ✅ If loading, show centered loader full-screen
  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.bodybackground }]}>
        <Loader />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bodybackground }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ paddingBottom: 80 }}>
        {faqs.map((faq, index) => (
          <View key={faq.id} style={styles.card}>
            <TouchableOpacity
              onPress={() => toggleExpand(index)}
              style={styles.questionHeader}
              activeOpacity={0.8}
            >
              <Text style={styles.questionText}>{faq.question}</Text>
              <Ionicons
                name={
                  expandedIndex === index
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>

            {expandedIndex === index && (
              <View style={styles.answerBox}>
                <Text style={styles.answerText}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 50,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  card: {
    marginBottom: 14,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.cardsbackground,
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: colors.cardsbackground,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
    paddingRight: 10,
  },
  answerBox: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  answerText: {
    fontSize: 14,
    color: colors.mutedText,
    lineHeight: 20,
  },
});
