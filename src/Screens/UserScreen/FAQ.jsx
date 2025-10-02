
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../Components/Loader/Loader";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { useTheme } from "../../Context/ThemeContext";
import {apiFetch} from "../../apiFetch";
import * as SecureStore from "expo-secure-store";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const FAQ = () => {
  const { theme } = useTheme();
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
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}
     showsVerticalScrollIndicator={false}>
      <Text
        style={[styles.title, { color: theme.primary }]}>
        Frequently Asked Questions
      </Text>

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            borderRadius: 10,
            backgroundColor: "#fff",
          }}
        >
          <Loader />
        </View>
      ) : (
      <View style={{paddingBottom:80}}>
        {  faqs.map((faq, index) => (
          <View
            key={faq.id}
            style={{
              marginBottom: 10,
              borderRadius: 10,
              overflow: "hidden",
              backgroundColor: "#222",
              elevation: 4,
            }}
          >
            <TouchableOpacity
              onPress={() => toggleExpand(index)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 15,
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "black",
                  flex: 1,
                }}
              >
                {faq.question}
              </Text>
              <Ionicons
                name={
                  expandedIndex === index
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color="black"
              />
            </TouchableOpacity>

            {expandedIndex === index && (
              <View style={{ backgroundColor: "#444", padding: 15 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#FFF",
                    lineHeight: 20,
                  }}
                >
                  {faq.answer}
                </Text>
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
    // color: colors.background,
    padding: 16,
    paddingBottom:50
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginVertical: 20,
    textAlign: "center",
    textShadowColor: "rgba(80, 79, 79, 0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    borderTopColor: "rgba(0,0,0,0.3)",

  },

});
export default FAQ;
