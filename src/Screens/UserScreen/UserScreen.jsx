import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import SocialIconsRow from "./SocialIconsRow";
import ThemeToggleButton from "../../Components/Buttons/ThemeToggleButton";
import { useTheme } from "../../Context/ThemeContext";
import Loader from "../../Components/Loader/Loader";
import { colors } from "../../Themes/colors";
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

  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const Paymentimgresponse = await apiFetch(`/content/paymentbtnimage`);
      if (!Paymentimgresponse.ok) throw new Error(`HTTP Error: ${Paymentimgresponse.status}`);
      const PaymentImagedata = await Paymentimgresponse.json();
      setPaymnetImageBtnData(PaymentImagedata);
      console.log("Payment Image Data:", PaymentImagedata);

      const storedUserId = await AsyncStorage.getItem("userId");
      console.log("User ID in UserScreen is:", storedUserId);
      if (storedUserId) {

        const response = await apiFetch(`/users/${storedUserId}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        setUserData(data);

        const imageResponse = await apiFetch(`/users/user_images/${storedUserId}`);
        console.log("Image Response Status:", imageResponse);
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          console.log("Fetched user image:", imageData.userImage);
          setUserImage(imageData.userImage);
        } else {
          console.log("User image fetch failed.");
        }
      }
    } catch (error) {
      console.error("Error fetching user data or image:", error);
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

  console.log("userImage in UserScreen:", userImage);

  return (
    <View style={[styles.maincontainer, { backgroundColor: theme.primary }]}>
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
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
                {userImage && typeof userImage === 'string' && userImage.startsWith('http') ? (
                  <Image
                    source={{ uri: userImage }}
                    style={styles.profileImage}
                    onError={() => {
                      console.log("Image load failed, setting fallback.");
                      setUserImage(null);
                    }}
                  />
                ) : (
                  <View style={styles.defaultProfileCircle} />
                )}
              </View>
              <View style={styles.headingscontianer}>
                <Text style={styles.title}>{userData.name}</Text>
                <Text style={[styles.email, { color: theme.text }]}>{userData.email}</Text>
              </View>


            </View>
            <View>
              {paymnetImgBtndata && (
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => navigation.navigate('AccountDetail', { userData })}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: paymnetImgBtndata.sliderimage_url }} // ensure the key is correct
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}

            </View>


            <View style={styles.sectionHeader}>
              <Text style={styles.heading}>General</Text>
              <View style={styles.line} />
            </View>
            {/* <View>
              <ThemeToggleButton />
            </View> */}
            <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('AccountDetail', { userData })}>
              <View style={styles.leftContent}>
                <Icon name="person" size={24} color="#8b3dff" style={styles.icon} />
                <Text style={[styles.sectionText, { color: theme.text }]}>Personal Info</Text>
              </View>
              <View><Icon name="chevron-right" size={24} color="#888" /></View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('AccountDetail', { userData })}>
              <View style={styles.leftContent}>
                <Icon name="credit-card" size={24} color="#1e90ff" style={styles.icon} />
                <Text style={[styles.sectionText, { color: theme.text }]}>Payment methods</Text>
              </View>
              <View><Icon name="chevron-right" size={24} color="#888" /></View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('AccountDetail', { userData })}>
              <View style={styles.leftContent}>
                <Icon name="security" size={24} color="#00b894" style={styles.icon} />
                <Text style={[styles.sectionText, { color: theme.text }]}>Security</Text>
              </View>
              <View><Icon name="chevron-right" size={24} color="#888" /></View>
            </TouchableOpacity>

            <View style={styles.section}>
              <View style={styles.leftContent}>
                <Icon name="brightness-6" size={24} color="#f39c12" style={styles.icon} />
                <Text style={[styles.sectionText, { color: theme.text }]}>Change Theme</Text>
              </View>
              <View><ThemeToggleButton /></View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.heading}>About</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('about', { userData })}>
              <View style={styles.leftContent}>
                <Icon name="info" size={24} color="#3498db" style={styles.icon} />
                <Text style={[styles.sectionText, { color: theme.text }]}>About PicNova-AI</Text>
              </View>
              <View><Icon name="chevron-right" size={24} color="#888" /></View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('CustomerSupport', { userData })}>
              <View style={styles.leftContent}>
                <Icon name="support-agent" size={24} color="#9b59b6" style={styles.icon} />
                <Text style={[styles.sectionText, { color: theme.text }]}>Customer Support</Text>
              </View>
              <View><Icon name="chevron-right" size={24} color="#888" /></View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('CustomerSupport', { userData })}>
              <View style={styles.leftContent}>
                <Icon name="shield" size={24} color="#e67e22" style={styles.icon} />
                <Text style={[styles.sectionText, { color: theme.text }]}>Privacy Policy</Text>
              </View>
              <View><Icon name="chevron-right" size={24} color="#888" /></View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('faq', { userData })}>
              <View style={styles.leftContent}>
                <Icon name="question-answer" size={24} color="#16a085" style={styles.icon} />
                <Text style={[styles.sectionText, { color: theme.text }]}>FAQs</Text>
              </View>
              <View><Icon name="chevron-right" size={24} color="#888" /></View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('Logout', { userData })}>
              <View style={styles.leftContent}>
                <Icon name="logout" size={24} color="#e74c3c" style={styles.icon} />
                <Text style={[styles.logoutText, { color: "#e74c3c" }]}>Logout</Text>
              </View>
              <View><Icon name="chevron-right" size={24} color="#e74c3c" /></View>
            </TouchableOpacity>

            {/* <View style={styles.iconscontainer}>
            <SocialIconsRow />
          </View> */}
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
    color: colors.primary,
    paddingTop: 50,
    paddingHorizontal: 16,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    color: colors.background,
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    color: '#fff',
  },
  profileContainer: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50
  },
  defaultProfileCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    color: "#fff"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 20,
    // justifyContent: "space-between",
    width: "100%",
    borderRadius: 10,
  },
  headingscontianer: {
    display: 'flex',
    flexDirection: 'column',

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary
  },
  email: {
    fontSize: 14,
    // fontWeight: "bold",
    color: "#333"
  },
  cardButton: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    color: colors.background,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
  },
  line: {
    flex: 1,
    height: 2,
    color: colors.primary,
  },
  section: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  leftContent: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'red',
  },
  logout: {
    borderBottomWidth: 0
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
    color: "#555"
  },
  iconscontainer: {
    display: 'flex',
  },
});

export default UserScreen;
