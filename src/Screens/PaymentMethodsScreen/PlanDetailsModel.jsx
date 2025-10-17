import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../Themes/colors";

const { width } = Dimensions.get("window");

const plans = [
  {
    name: "Basic",
    price: 1000,
    description: "Includes all essential AI tools",
    image: require("../../../assets/basic.jpg"),
    features: [
      "4,500 credits / quarter",
      "Up to ~1,500 Image Generations/month",
      "Up to ~25 Video Generations/month",
      "Public showcase for your creations",
      "Perfect for creators on the go",
      "4,500 credits / quarter",
      "Up to ~1,500 Image Generations/month",
      "Up to ~25 Video Generations/month",
    ],
  },
  {
    name: "Standard",
    price: 2000,
    description: "Best for creators and designers",
    image: require("../../../assets/basic.jpg"),
    features: [
      "15,000 credits / quarter",
      "Unlimited turbo image generations",
      "Up to ~5,000 AI Image credits/month",
      "Up to ~83 Video Generations/month",
      "Balanced image & video power",
      "15,000 credits / quarter",
      "Unlimited turbo image generations",
      "Up to ~5,000 AI Image credits/month",
    ],
  },
  {
    name: "Ultimate",
    price: 3500,
    description: "Unlimited creations with full control",
    image: require("../../../assets/Pro.jpg"),
    features: [
      "45,000 credits / quarter",
      "Unlimited turbo image generations",
      "Up to ~15,000 AI Image credits/month",
      "Up to ~250 Video Generations/month",
      "Consistent creativity made easy",
      "45,000 credits / quarter",
      "Unlimited turbo image generations",
      "Up to ~15,000 AI Image credits/month",
    ],
  },
];

const PlanDetailsModal = ({ visible, onClose, navigation, billingType }) => {
  // 🧮 Apply discounts based on billing type
  const getDiscountedPrice = (basePrice) => {
    if (billingType === "monthly") return (basePrice * 0.75).toFixed(0); // 25% off
    if (billingType === "quarterly") return (basePrice * 0.65).toFixed(0); // 35% off
    return basePrice;
  };

  const handleContinue = (plan) => {
    const discountedPrice = getDiscountedPrice(plan.price);
    navigation.navigate("PaymentmethodsScreen", {
      planName: plan.name,
      planPrice: discountedPrice,
      billingType: billingType,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <LinearGradient
          colors={colors.gradients.deepTech}
          style={styles.modalBox}
        >
          {/* ❌ Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={26} color={colors.text} />
          </TouchableOpacity>

          {/* 🏷 Heading */}
          <Text style={styles.heading}>All Subscription Plans</Text>

          {/* 💳 Plans List */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {plans.map((plan, i) => (
              <View key={i} style={styles.planCard}>
                {/* 🖼️ Plan Image */}
                <Image source={plan.image} style={styles.planImage} />

                <View style={{ padding: 14 }}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planDesc}>{plan.description}</Text>
                  <Text style={styles.planPrice}>
                    PKR {getDiscountedPrice(plan.price)} /{" "}
                    {billingType === "monthly" ? "month" : "quarter"}
                  </Text>

                  {/* 📋 Features */}
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.featureScroll}
                  >
                    {plan.features.map((f, idx) => (
                      <View key={idx} style={styles.featureRow}>
                        <Ionicons
                          name="checkmark-circle"
                          color={colors.primary}
                          size={18}
                        />
                        <Text style={styles.featureText}>{f}</Text>
                      </View>
                    ))}
                  </ScrollView>

                  {/* 🚀 Continue Button */}
                  <TouchableOpacity onPress={() => handleContinue(plan)}>
                    <LinearGradient
                      colors={colors.gradients.ocean}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.continueButton}
                    >
                      <Text style={styles.continueText}>
                        Continue with {plan.name}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default PlanDetailsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "flex-end",
  },
  modalBox: {
    height: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 60,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 25,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 6,
  },
  heading: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollContainer: { paddingHorizontal: 20 },
  planCard: {
    width: width * 0.8,
    backgroundColor: colors.cardsbackground,
    borderRadius: 16,
    marginRight: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 100,
  },
  planImage: { width: "100%", height: 150, resizeMode: "cover" },
  planName: { color: colors.text, fontSize: 20, fontWeight: "700" },
  planDesc: { color: colors.mutedText, fontSize: 14, marginBottom: 10 },
  planPrice: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  featureScroll: { maxHeight: 250 },
  featureRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  featureText: { color: colors.mutedText, marginLeft: 8, fontSize: 14 },
  continueButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  continueText: { color: colors.text, fontSize: 16, fontWeight: "700" },
});
