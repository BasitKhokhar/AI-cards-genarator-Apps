import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const plans = [
  {
    name: "Basic",
    price: "Free",
    features: ["Limited image enhancement", "Watermark on exports"],
  },
  {
    name: "Standard",
    price: "$4.99/mo",
    features: [
      "Unlimited enhancements",
      "HD export quality",
      "No watermark",
      "Priority processing",
    ],
  },
  {
    name: "Pro",
    price: "$9.99/mo",
    features: [
      "All Standard features",
      "Batch enhancement",
      "Exclusive Pro filters",
      "Fastest queue access",
    ],
  },
];

const PlanDetailsModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>All Subscription Plans</Text>

            {plans.map((plan, i) => (
              <View key={i} style={styles.planCard}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
                {plan.features.map((f, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" color="#ff3d9b" size={18} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
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
    backgroundColor: "#0d0d1a",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 60,
    paddingHorizontal: 20,
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
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: "#1E1E2A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2c2c3d",
  },
  planName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  planPrice: {
    color: "#ff3d9b",
    fontSize: 16,
    marginBottom: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  featureText: {
    color: "#bbb",
    marginLeft: 8,
    fontSize: 14,
  },
});
