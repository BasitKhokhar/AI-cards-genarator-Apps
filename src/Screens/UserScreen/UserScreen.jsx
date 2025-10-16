import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  ScrollView, RefreshControl
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import PaymentModal from "../PaymentMethodsScreen/PaymentModel";
import ThemeToggleButton from "../../Components/Buttons/ThemeToggleButton";
import { useTheme } from "../../Context/ThemeContext";
import Loader from "../../Components/Loader/Loader";
import { apiFetch } from "../../apiFetch";
import Constants from 'expo-constants';

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
      if (!Paymentimgresponse.ok) throw new Error(`HTTP Error: ${Paymentimgresponse.status}`);
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
    <View style={styles.maincontainer}>
      <ScrollView
        contentContainerStyle={styles.container}
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
              <View style={styles.imageContainer}>
                {userImage ? (
                  <Image source={{ uri: userImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.defaultProfileCircle} />
                )}
              </View>
              <View style={styles.headingsContainer}>
                <Text style={styles.title}>{userData.name}</Text>
                <Text style={styles.email}>{userData.email}</Text>
              </View>
            </View>
            <PaymentModal
              visible={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              onContinue={(planData) => console.log("Selected plan:", planData)}
              navigation={navigation}
            />
            {/* Payment Card Image */}
            {paymnetImgBtndata && (
              <TouchableOpacity
                style={styles.cardButton}
                // onPress={() => navigation.navigate("AccountDetail", { userData })}
                onPress={() => setShowPaymentModal(true)}
                activeOpacity={0.8}
              >
                <Image source={require('../../../assets/paymentpic.png')} style={styles.profileImage} />
              </TouchableOpacity>
            )}

            {/* General Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.heading}>General</Text>
              {/* <View style={styles.line} /> */}
            </View>

            {[
              { name: "person-outline", label: "Personal Info", color: "white", route: "AccountDetail" },
              { name: "credit-card", label: "Payment Methods", color: "white", route: "PaymentmethodsScreen" },
              // { name: "security", label: "Security", color: "#2ecc71", route: "AccountDetail" }
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.section}
                onPress={() => navigation.navigate(item.route, { userData })}
              >
                <View style={styles.leftContent}>
                  <Icon name={item.name} size={24} color={item.color} style={styles.icon} />
                  <Text style={styles.sectionText}>{item.label}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="white" />
              </TouchableOpacity>
            ))}

            {/* About Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.heading}>About</Text>
              {/* <View style={styles.line} /> */}
            </View>

            {[
              { name: "info-outline", label: "About CardiFy-AI", color: "white", route: "AboutAppScreen" },
              { name: "headset-mic", label: "Customer Support", color: "white", route: "CustomerSupport" },
              { name: "security", label: "Privacy Policy", color: "white", route: "PrivacyPolicyScreen" },
              { name: "help-outline", label: "FAQs", color: "white", route: "faq" },
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.section}
                onPress={() => navigation.navigate(item.route, { userData })}
              >
                <View style={styles.leftContent}>
                  <Icon name={item.name} size={24} color={item.color} />
                  <Text style={styles.sectionText}>{item.label}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="white" />
              </TouchableOpacity>
            ))}

            {/* Logout */}
            <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("Logout", { userData })}>
              <View style={styles.leftContent}>
                <Icon name="logout" size={24} color="#ffff" />
                <Text style={styles.logoutText}>Logout</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#ffff" />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.text}>No user data found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: "#0d0d0d", // deep dark background
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
    borderColor: "#4d4d4d",
    backgroundColor: "#1a1a1a", // card background
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
    borderColor: "#3a3a3a",
    // shadowColor: "#9b59b6",
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  defaultProfileCircle: {
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: "#2c2c2c",
  },
  headingsContainer: {
    flexDirection: "column",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    // textShadowColor: "#ff00ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  email: {
    fontSize: 14,
    color: "#bbb",
  },
  cardButton: {
    width: "100%",
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#4d4d4d",
    shadowColor: "#9b59b6",
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff",
    marginRight: 8, marginBottom: 10,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#ff3d9b",
    shadowColor: "#ff00ff",
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#0d0d0d",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#4d4d4d",
    shadowColor: "#9b59b6",
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
    color: "#f5f5f5", // text white
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff3d9b", // red neon
  },
  text: {
    fontSize: 18,
    marginTop: 20,
    color: "#aaa",
    textAlign: "center",
  },
});


export default UserScreen;
