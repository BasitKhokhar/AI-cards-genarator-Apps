import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../Themes/colors";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PaymentSelectionScreen({ navigation, route }) {
  const { gameTypeId } = route.params;
  console.log("gametypeid in paymentscreen", gameTypeId);

  const handleSelectPayment = (paymentMethod) => {
    if (paymentMethod === "jazzcash") {
      navigation.navigate("jazzcashscreenScreen", { gameTypeId });
    } else if (paymentMethod === "easypaisa") {
      navigation.navigate("easypaisaScreen", { gameTypeId });
    } else if (paymentMethod === "card") {
      navigation.navigate("cardPaymentScreen", { gameTypeId });
    }
  };

  const paymentOptions = [
    {
      name: "JazzCash",
      gradient: ["#ff3d9b", "#ff8fbf"],
      icon: "cellphone-wireless",
      key: "jazzcash",
    },
    {
      name: "Easypaisa",
      gradient: ["#8b3dff", "#c47dff"],
      icon: "cash-multiple",
      key: "easypaisa",
    },
    {
      name: "Credit Card",
      gradient: ["#00F5A0", "#00D9F5"],
      icon: "credit-card-outline",
      key: "card",
    },
  ];

  return (
    <View
      colors={colors.gradients.deepTech}
      style={styles.container}
    >
      {/* <Text style={styles.heading}>Select Payment Method</Text> */}

      {paymentOptions.map((option) => (
        <TouchableOpacity
          key={option.key}
          activeOpacity={0.9}
          onPress={() => handleSelectPayment(option.key)}
          style={styles.buttonWrapper}
        >
          {/* <LinearGradient
            colors={option.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          > */}
            <View style={styles.buttonInner}>
              <MaterialCommunityIcons
                name={option.icon}
                size={26}
                color={colors.text}
                style={{ marginRight: 12 }}
              />
              <Text style={styles.buttonText}>{option.name}</Text>
            </View>
          {/* </LinearGradient> */}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bodybackground,
  },
  heading: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
    marginBottom: 50,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    textShadowColor: colors.accent,
    textShadowRadius: 12,
  },
  buttonWrapper: {
    width: "100%",
    marginBottom: 25,
    borderRadius: 16,
    borderWidth:1,borderColor:colors.border
  },
  gradientBorder: {
    borderRadius: 16,
    padding: 2,
    // shadowColor: "#00F5A0",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  buttonInner: {
    backgroundColor: colors.cardsbackground,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    textShadowColor: "rgba(255,255,255,0.3)",
    textShadowRadius: 6,
  },
});
