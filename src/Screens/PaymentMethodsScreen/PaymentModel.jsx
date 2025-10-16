// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ImageBackground,
//   Dimensions,
//   Modal,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import PlanDetailsModal from "./PlanDetailsModel";

// const { height } = Dimensions.get("window");

// const PaymentModal = ({ visible, onClose, onContinue, navigation }) => {
//   const [selectedPlan, setSelectedPlan] = useState("monthly");
//   const [showAllPlans, setShowAllPlans] = useState(false);

//   const handleContinue = () => {
//     const price = selectedPlan === "monthly" ? 499 : 999;
//     onContinue({ plan: selectedPlan, price });
//     navigation.navigate("PaymentScreen", { plan: selectedPlan, price });
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         <LinearGradient
//           colors={["#0d0d1a", "#141427"]}
//           style={styles.modalContainer}
//         >
//           {/* ❌ Close Button */}
//           <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//             <Ionicons name="close" size={26} color="#fff" />
//           </TouchableOpacity>

//           {/* 🖼 Top Image Section */}
//           <View style={styles.topImageWrapper}>
//             <ImageBackground
//               source={require("../../../assets/splash11.jpg")}
//               style={styles.topImage}
//             >
//               <LinearGradient
//                 colors={["transparent", "rgba(13,13,26,0.9)"]}
//                 style={styles.topOverlay}
//               />
//             </ImageBackground>
//           </View>

//           {/* 📝 Text Content */}
//           <View style={styles.textSection}>
//             <Text style={styles.title}>10M+ Users Using Pro</Text>
//             <Text style={styles.subtitle}>Start with Flexible Pro Plan</Text>
//           </View>

//           {/* 🪙 Plan Selector */}
//           <View style={styles.planSelector}>
//             {["monthly", "quarterly"].map((plan) => (
//               <TouchableOpacity
//                 key={plan}
//                 style={[
//                   styles.planOption,
//                   selectedPlan === plan && styles.activePlan,
//                 ]}
//                 onPress={() => setSelectedPlan(plan)}
//               >
//                 <Text
//                   style={[
//                     styles.planText,
//                     selectedPlan === plan && styles.activeText,
//                   ]}
//                 >
//                   {plan === "monthly" ? "Monthly" : "Quarterly"}
//                 </Text>
//                 <View style={styles.saleBadge}>
//                   <Text style={styles.saleText}>
//                     {plan === "monthly" ? "30% OFF" : "50% OFF"}
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* 💡 Basic Plan Preview */}
//           <View style={styles.basicSection}>
//             <Text style={styles.basicTitle}>Basic Plan</Text>
//             <Text style={styles.basicPrice}>Free</Text>
//             <TouchableOpacity
//               onPress={() => setShowAllPlans(true)}
//               style={styles.seePlansBtn}
//             >
//               <Text style={styles.seePlansText}>See all Plans</Text>
//             </TouchableOpacity>
//           </View>

//           {/* 🚀 Continue Button */}
//           <TouchableOpacity
//             style={styles.continueWrapper}
//             onPress={handleContinue}
//             activeOpacity={0.8}
//           >
//             <LinearGradient
//               colors={["#8b3dff", "#ff3d9b"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.continueBtn}
//             >
//               <Text style={styles.continueText}>Continue</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </LinearGradient>

//         {/* 👇 Nested full-screen Plan Details modal */}
//         <PlanDetailsModal
//           visible={showAllPlans}
//           onClose={() => setShowAllPlans(false)}
//         />
//       </View>
//     </Modal>
//   );
// };

// export default PaymentModal;

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.8)",
//     justifyContent: "flex-end",
//   },
//   modalContainer: {
//     height: height * 1,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     overflow: "hidden",
//   },
//   closeButton: {
//     position: "absolute",
//     top: 30,
//     right: 20,
//     zIndex: 10,
//     backgroundColor: "rgba(255,255,255,0.1)",
//     borderRadius: 20,
//     padding: 6,
//   },
//   topImageWrapper: { height: height * 0.5, overflow: "hidden" },
//   topImage: { width: "100%", height: "100%" },
//   topOverlay: { flex: 1 },
//   textSection: {
//     alignItems: "center",
//     marginTop: 15,
//   },
//   title: {
//     fontSize: 24,
//     color: "#fff",
//     fontWeight: "700",
//   },
//   subtitle: {
//     fontSize: 15,
//     color: "#cfcfe6",
//     marginTop: 6,
//   },
//   planSelector: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     marginTop: 25,
//   },
//   planOption: {
//     width: "40%",
//     backgroundColor: "#1e1e2e",
//     borderRadius: 14,
//     paddingVertical: 12,
//     alignItems: "center",
//     position: "relative",
//   },
//   activePlan: {
//     borderWidth: 2,
//     borderColor: "#ff3d9b",
//     backgroundColor: "#28283d",
//   },
//   planText: { color: "#aaa", fontSize: 16, fontWeight: "500" },
//   activeText: { color: "#fff", fontWeight: "700" },
//   saleBadge: {
//     position: "absolute",
//     top: -10,
//     right: -6,
//     backgroundColor: "#ff3d9b",
//     borderRadius: 8,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//   },
//   saleText: { color: "#fff", fontSize: 10, fontWeight: "700" },
//   basicSection: {
//     alignItems: "center",
//     marginTop: 40,
//   },
//   basicTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   basicPrice: {
//     color: "#ff3d9b",
//     fontSize: 22,
//     fontWeight: "800",
//     marginTop: 5,
//   },
//   seePlansBtn: {
//     marginTop: 10,
//   },
//   seePlansText: {
//     color: "#8b3dff",
//     fontSize: 15,
//     fontWeight: "600",
//     textDecorationLine: "underline",
//   },
//   continueWrapper: {
//     marginTop: 40,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 30,
//   },
//   continueBtn: {
//     width: "100%",
//     borderRadius: 40,
//     paddingVertical: 15,
//     alignItems: "center",
//   },
//   continueText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//     letterSpacing: 0.5,
//   },
// });


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
import PlanDetailsModal from "./PlanDetailsModel";

const { height } = Dimensions.get("window");

// 🧮 Base prices (per month)
const BASE_PLANS = {
  basic: { name: "Basic", price: 1000 },
  standard: { name: "Standard", price: 2000 },
  pro: { name: "Pro", price: 3000 },
};

// 🪙 Billing options (discount only)
const BILLING_TYPES = {
  monthly: { label: "Monthly", discount: 0.25 },
  quarterly: { label: "Quarterly", discount: 0.35 },
};

const PaymentModal = ({ visible, onClose, onContinue, navigation }) => {
  const [selectedBilling, setSelectedBilling] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [showAllPlans, setShowAllPlans] = useState(false);

  // 💰 Calculate discounted price
  const getDiscountedPrice = () => {
    const basePrice = BASE_PLANS[selectedPlan].price;
    const discount = BILLING_TYPES[selectedBilling].discount;
    return Math.round(basePrice * (1 - discount));
  };

  const handleContinue = () => {
    const selectedData = {
      plan: BASE_PLANS[selectedPlan].name,
      billing: BILLING_TYPES[selectedBilling].label,
      basePrice: BASE_PLANS[selectedPlan].price,
      discount: BILLING_TYPES[selectedBilling].discount * 100,
      finalPrice: getDiscountedPrice(),
    };
    onContinue(selectedData);
    navigation.navigate("PaymentmethodsScreen", selectedData);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <LinearGradient
          colors={["#0d0d1a", "#141427"]}
          style={styles.modalContainer}
        >
          {/* ❌ Close */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>

          {/* 🖼 Header image */}
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

          {/* 📝 Text */}
          <View style={styles.textSection}>
            <Text style={styles.title}>10M+ Users Using Pro</Text>
            <Text style={styles.subtitle}>Start with Flexible Pro Plan</Text>
          </View>

          {/* 💳 Billing Selector */}
          <View style={styles.planSelector}>
            {Object.keys(BILLING_TYPES).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.planOption,
                  selectedBilling === key && styles.activePlan,
                ]}
                onPress={() => setSelectedBilling(key)}
              >
                <Text
                  style={[
                    styles.planText,
                    selectedBilling === key && styles.activeText,
                  ]}
                >
                  {BILLING_TYPES[key].label} Billing
                </Text>
                <Text style={styles.planPrice}>
                  {BILLING_TYPES[key].discount * 100}% OFF
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 🧱 Current Plan */}
          <TouchableOpacity
            style={[
              styles.basicSection,
              selectedPlan === "basic" && styles.activeBasic,
            ]}
            onPress={() => setSelectedPlan("basic")}
          >
            <Text style={styles.basicTitle}>{BASE_PLANS.basic.name} Plan</Text>
            <Text style={styles.basicPrice}>
              PKR {getDiscountedPrice()}{" "}
              <Text style={{ color: "#aaa", fontSize: 12 }}>
                {/* (after discount) */}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* 🔍 See All Plans */}
          <View style={{ alignItems: "center" }}>
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
              <Text style={styles.continueText}>
                Continue with {BASE_PLANS[selectedPlan].name} Plan 
                {/* (
                {BILLING_TYPES[selectedBilling].label}) - PKR {getDiscountedPrice()} */}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* 👇 Plan Details Modal */}
        <PlanDetailsModal
          visible={showAllPlans}
          onClose={() => setShowAllPlans(false)}
          navigation={navigation}
          selectedBilling={selectedBilling}
          onSelectPlan={(planKey) => {
            setSelectedPlan(planKey);
            setShowAllPlans(false);
          }}
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
  textSection: { alignItems: "center", marginTop: 15 },
  title: { fontSize: 24, color: "#fff", fontWeight: "700" },
  subtitle: { fontSize: 15, color: "#cfcfe6", marginTop: 6 },
  planSelector: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 25,
  },
  planOption: {
    width: "40%",
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  activePlan: {
    borderWidth: 1,
    borderColor: "#ff3d9b",
    backgroundColor: "#28283d",
  },
  planText: { color: "#aaa", fontSize: 16, fontWeight: "500" },
  activeText: { color: "#fff", fontWeight: "700" },
  planPrice: {
    color: "#ff3d9b",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 3,
  },
  basicSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 10,
    width: "90%",
    alignSelf: "center",
  },
  activeBasic: {
    borderWidth: 1,
    borderColor: "#4d4d4d",
    backgroundColor: "#1a1a1a",
  },
  basicTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  basicPrice: {
    color: "#ff3d9b",
    fontSize: 20,
    fontWeight: "700",
  },
  seePlansBtn: { marginTop: 10 },
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
    paddingHorizontal: 20,
  },
  continueBtn: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
