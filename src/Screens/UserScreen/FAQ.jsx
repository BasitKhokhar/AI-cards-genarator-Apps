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
import * as SecureStore from "expo-secure-store";
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

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: "#0B0B10" }, // Dark Cardify base
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* <Text style={styles.title}>💡 Frequently Asked Questions</Text> */}

      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : (
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
                  color="white"
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
      )}
    </ScrollView>
  );
};

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
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#111",
  },
  card: {
    marginBottom: 14,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
     borderWidth: 1,
    borderColor: "#4d4d4d",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(20,20,35,0.9)",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    paddingRight: 10,
  },
  answerBox: {
    backgroundColor: "#0F0F15",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,255,255,0.15)",
  },
  answerText: {
    fontSize: 14,
    color: "#CFCFCF",
    lineHeight: 20,
  },
});

export default FAQ;
