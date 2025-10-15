import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import PlanDetailsModal from "./PlanDetailsModel"; // 👈 secondary modal

const { height } = Dimensions.get("window");

const PaymentModal = ({ visible, onClose, onContinue, navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [showAllPlans, setShowAllPlans] = useState(false);

  const handleContinue = () => {
    const price = selectedPlan === "monthly" ? 499 : 999;
    onContinue({ plan: selectedPlan, price });
    navigation.navigate("PaymentScreen", { plan: selectedPlan, price });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <LinearGradient
          colors={["#0d0d1a", "#141427"]}
          style={styles.modalContainer}
        >
          {/* ❌ Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>

          {/* 🖼 Top Image Section */}
          <View style={styles.topImageWrapper}>
            <ImageBackground
              source={require("../../../assets/splash11.jpg")}
              style={styles.topImage}
            >
              <LinearGradient
                colors={["transparent", "rgba(13,13,26,0.9)"]}
                style={styles.topOverlay}
              />
            </ImageBackground>
          </View>

          {/* 📝 Text Content */}
          <View style={styles.textSection}>
            <Text style={styles.title}>10M+ Users Using Pro</Text>
            <Text style={styles.subtitle}>Start with Flexible Pro Plan</Text>
          </View>

          {/* 🪙 Plan Selector */}
          <View style={styles.planSelector}>
            {["monthly", "quarterly"].map((plan) => (
              <TouchableOpacity
                key={plan}
                style={[
                  styles.planOption,
                  selectedPlan === plan && styles.activePlan,
                ]}
                onPress={() => setSelectedPlan(plan)}
              >
                <Text
                  style={[
                    styles.planText,
                    selectedPlan === plan && styles.activeText,
                  ]}
                >
                  {plan === "monthly" ? "Monthly" : "Quarterly"}
                </Text>
                <View style={styles.saleBadge}>
                  <Text style={styles.saleText}>
                    {plan === "monthly" ? "30% OFF" : "50% OFF"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* 💡 Basic Plan Preview */}
          <View style={styles.basicSection}>
            <Text style={styles.basicTitle}>Basic Plan</Text>
            <Text style={styles.basicPrice}>Free</Text>
            <TouchableOpacity
              onPress={() => setShowAllPlans(true)}
              style={styles.seePlansBtn}
            >
              <Text style={styles.seePlansText}>See all Plans</Text>
            </TouchableOpacity>
          </View>

          {/* 🚀 Continue Button */}
          <TouchableOpacity
            style={styles.continueWrapper}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#8b3dff", "#ff3d9b"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.continueBtn}
            >
              <Text style={styles.continueText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* 👇 Nested full-screen Plan Details modal */}
        <PlanDetailsModal
          visible={showAllPlans}
          onClose={() => setShowAllPlans(false)}
        />
      </View>
    </Modal>
  );
};

export default PaymentModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: height * 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 6,
  },
  topImageWrapper: { height: height * 0.5, overflow: "hidden" },
  topImage: { width: "100%", height: "100%" },
  topOverlay: { flex: 1 },
  textSection: {
    alignItems: "center",
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    color: "#cfcfe6",
    marginTop: 6,
  },
  planSelector: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 25,
  },
  planOption: {
    width: "40%",
    backgroundColor: "#1e1e2e",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  activePlan: {
    borderWidth: 2,
    borderColor: "#ff3d9b",
    backgroundColor: "#28283d",
  },
  planText: { color: "#aaa", fontSize: 16, fontWeight: "500" },
  activeText: { color: "#fff", fontWeight: "700" },
  saleBadge: {
    position: "absolute",
    top: -10,
    right: -6,
    backgroundColor: "#ff3d9b",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  saleText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  basicSection: {
    alignItems: "center",
    marginTop: 40,
  },
  basicTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  basicPrice: {
    color: "#ff3d9b",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 5,
  },
  seePlansBtn: {
    marginTop: 10,
  },
  seePlansText: {
    color: "#8b3dff",
    fontSize: 15,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  continueWrapper: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  continueBtn: {
    width: "100%",
    borderRadius: 40,
    paddingVertical: 15,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
