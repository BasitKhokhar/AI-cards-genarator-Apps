import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import PaymentModal from "../PaymentMethodsScreen/PaymentModel";
import { useTheme } from "../../Context/ThemeContext";
import Loader from "../../Components/Loader/Loader";
import { apiFetch } from "../../apiFetch";
import Constants from "expo-constants";
import { colors } from "../../Themes/colors"; // ✅ Import colors file

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const UserScreen = () => {
  const { theme } = useTheme();
  const [userData, setUserData] = useState(null);
  const [paymnetImgBtndata, setPaymnetImageBtnData] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const Paymentimgresponse = await apiFetch(`/content/paymentbtnimage`);
      if (!Paymentimgresponse.ok)
        throw new Error(`HTTP Error: ${Paymentimgresponse.status}`);
      const PaymentImagedata = await Paymentimgresponse.json();
      setPaymnetImageBtnData(PaymentImagedata);

      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) {
        const response = await apiFetch(`/users/${storedUserId}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        setUserData(data);

        const imageResponse = await apiFetch(`/users/user_images/${storedUserId}`);
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          setUserImage(imageData.userImage);
        } else {
          setUserImage(null);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData();
    setRefreshing(false);
  };

  return (
    <View style={[styles.maincontainer, { backgroundColor: colors.bodybackground }]}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.cardsbackground, borderColor: colors.border },
        ]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loaderContainer}>
            <Loader />
          </View>
        ) : userData ? (
          <View style={styles.profileContainer}>
            {/* Profile Header */}
            <View style={styles.header}>
              <View style={[styles.imageContainer, { borderColor: colors.border }]}>
                {userImage ? (
                  <Image source={{ uri: userImage }} style={styles.profileImage} />
                ) : (
                  <View style={[styles.defaultProfileCircle, { backgroundColor: colors.secondary }]} />
                )}
              </View>
              <View style={styles.headingsContainer}>
                <Text style={[styles.title, { color: colors.text }]}>{userData.name}</Text>
                <Text style={[styles.email, { color: colors.mutedText }]}>{userData.email}</Text>
              </View>
            </View>

            {/* Payment Modal */}
            <PaymentModal
              visible={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              onContinue={(planData) => console.log("Selected plan:", planData)}
              navigation={navigation}
            />

            {/* Payment Card Image */}
            {paymnetImgBtndata && (
              <TouchableOpacity
                style={[styles.cardButton, { borderColor: colors.border }]}
                onPress={() => setShowPaymentModal(true)}
                activeOpacity={0.8}
              >
                <Image
                  source={require("../../../assets/paymentpic.png")}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            )}

            {/* General Section */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.heading, { color: colors.text }]}>General</Text>
            </View>

            {[
              { name: "person-outline", label: "Personal Info", route: "AccountDetail" },
              { name: "credit-card", label: "Payment Methods", route: "PaymentmethodsScreen" },
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.section, { backgroundColor: colors.bodybackground, borderColor: colors.border }]}
                onPress={() => navigation.navigate(item.route, { userData })}
              >
                <View style={styles.leftContent}>
                  <Icon name={item.name} size={24} color={colors.text} />
                  <Text style={[styles.sectionText, { color: colors.text }]}>{item.label}</Text>
                </View>
                <Icon name="chevron-right" size={24} color={colors.text} />
              </TouchableOpacity>
            ))}

            {/* About Section */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.heading, { color: colors.text }]}>About</Text>
            </View>

            {[
              { name: "info-outline", label: "About CardiFy-AI", route: "AboutAppScreen" },
              { name: "headset-mic", label: "Customer Support", route: "CustomerSupport" },
              { name: "security", label: "Privacy Policy", route: "PrivacyPolicyScreen" },
              { name: "help-outline", label: "FAQs", route: "faq" },
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.section, { backgroundColor: colors.bodybackground, borderColor: colors.border }]}
                onPress={() => navigation.navigate(item.route, { userData })}
              >
                <View style={styles.leftContent}>
                  <Icon name={item.name} size={24} color={colors.text} />
                  <Text style={[styles.sectionText, { color: colors.text }]}>{item.label}</Text>
                </View>
                <Icon name="chevron-right" size={24} color={colors.text} />
              </TouchableOpacity>
            ))}

            {/* Logout */}
            <TouchableOpacity
              style={[styles.section, { backgroundColor: colors.bodybackground, borderColor: colors.border }]}
              onPress={() => navigation.navigate("Logout", { userData })}
            >
              <View style={styles.leftContent}>
                <Icon name="logout" size={24} color={colors.text} />
                <Text style={[styles.logoutText, { color: colors.text }]}>Logout</Text>
              </View>
              <Icon name="chevron-right" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={[styles.text, { color: colors.mutedText }]}>No user data found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 100,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 2,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  defaultProfileCircle: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  headingsContainer: {
    flexDirection: "column",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
  },
  cardButton: {
    width: "100%",
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 2,
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
    marginBottom: 10,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  leftContent: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  sectionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },
});

export default UserScreen;
