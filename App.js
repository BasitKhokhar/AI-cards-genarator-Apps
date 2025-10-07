// import { ThemeProvider } from "./Components/context/ThemeContext";
// import { useTheme } from "./Components/context/ThemeContext";
import { ThemeProvider, useTheme } from "./src/Context/ThemeContext";
import React, { useState, useEffect } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import VideoGenerateScreen from "./src/Screens/VideosScreen/VideosgenerateScreen";
// splashscreens //
import SplashScreen from "./src/Screens/SplashScreens/SplashScreen";
import SplashScreen1 from "./src/Screens/SplashScreens/SplashScreen1";
import SplashScreen2 from "./src/Screens/SplashScreens/SplashScreen2";
import SplashScreen3 from "./src/Screens/SplashScreens/SplashScreen3";
import SplashScreen4 from "./src/Screens/SplashScreens/SplashScreen4";
// Authentications Screens //
import SignupScreen from "./src/Components/Authentication/Signup";
import LoginScreen from "./src/Components/Authentication/Login";

import HomeScreen from "./src/Screens/HomeScreen/HomeScreen";
import TemplateDetail from "./src/Screens/HomeScreen/CardsTemplates";

import CategoriesScreen from "./src/Screens/HomeScreen/CardsCategories";
import EnhancedImageGallery from "./src/Screens/HomeScreen/EnhancedImagesGallery";
import AssetsMainScreen from "./src/Screens/AssetsScreen/AssetsMain";

import CardsCategoriesScreen from "./src/Screens/HomeScreen/CardsCategories";
import CardCategoryTemplatesScreen from "./src/Screens/HomeScreen/CardsTemplates";

import AllNotifications from "./src/Screens/NotificationsScreen/AllNotifications";
import AIPicsFeatureList from "./src/Screens/AI_PicsFeatures_Screen/AIPics_Features";
import PicFeatureDetailScreen from "./src/Screens/AI_PicsFeatures_Screen/AIPics_Featuredetail";

import SimpleImageEditor from "./src/Screens/HomeScreen/SimpleEditing";

import Videoscreen from "./src/Screens/VideosScreen/Videoscreen";

import UserScreen from "./src/Screens/UserScreen/UserScreen";
import AccountDetailScreen from "./src/Screens/UserScreen/AccountDetailScreen";
import CustomerSupportScreen from "./src/Screens/UserScreen/CustomerSupportScreen";
import FAQ from "./src/Screens/UserScreen/FAQ";
// import StripePayment from "./Components/Cart/StripePayment";
import LogoutScreen from "./src/Screens/UserScreen/LogoutScreen";
import 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const stripeKey = Constants.expoConfig.extra.stripePublishableKey;
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainLayout = ({ navigation, children, currentScreen }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerItem}>
          <Image source={require("./assets/logo.png")} style={styles.logo} />
        </View>

        <View style={styles.headerItem}>
          <Text style={styles.appTitle}>CardiFy-AI</Text>
        </View>

        <View style={styles.headerItem}>
          <TouchableOpacity onPress={() => navigation.navigate("AllNotifications")} style={styles.belliconmaincontainer}>
            <View style={styles.belliconContainer}>
              <Icon name="notifications" size={20} color="white" />
            </View>

          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>{children}</View>
      <View >
        <LinearGradient
          colors={["#8b3dff", "#ff3d9b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.footer}
        >
          {[
            { name: "Home", icon: "home" },
            { name: "Designs", icon: "photo-camera" },
            { name: "Assets", icon: "video-library" },
            { name: "Profile", icon: "person" },
          ].map(({ name, icon }) => {
            const isActive = currentScreen === name;

            return (
              <TouchableOpacity
                key={name}
                style={styles.footerButton}
                onPress={() => navigation.navigate(name)}
              >
                {isActive ? (
                  <View style={[styles.iconWrapper, styles.activeCircle]}>
                    <Icon name={icon} size={20} color="#ff3d9b" />
                    <Text style={styles.activeText}>{name}</Text>
                  </View>
                ) : (
                  <>
                    <Icon name={icon} size={22} color="white" />
                    <Text style={styles.inactiveText}>{name}</Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })}

        </LinearGradient>

      </View>
    </View>
  );
};
const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen name="Home">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Home">
            <HomeScreen />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Designs">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Designs">
            <CategoriesScreen />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Assets">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Assets">
            <AssetsMainScreen />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Profile">
            <UserScreen />
          </MainLayout>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
const App = () => {
  const [userId, setUserId] = useState(null);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [isSplash1Visible, setIsSplash1Visible] = useState(true);
  const [isSplash2Visible, setIsSplash2Visible] = useState(null);
  const [isSplash3Visible, setIsSplash3Visible] = useState(null);
  const [isSplash4Visible, setIsSplash4Visible] = useState(null);

  //   useEffect(() => {
  //   const clearAppDataOnce = async () => {
  //     try {
  //       await AsyncStorage.clear();
  //       console.log("✅ AsyncStorage cleared");

  //       await SecureStore.deleteItemAsync("jwt_token");
  //       await SecureStore.deleteItemAsync("userId"); // add more keys if needed
  //       console.log("✅ SecureStore cleared");

  //       console.log("📦 Storage wiped — next start will force login");
  //     } catch (error) {
  //       console.error("❌ Error clearing app data:", error);
  //     }
  //   };

  //   clearAppDataOnce();
  // }, []);


  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await SecureStore.getItemAsync("refreshToken");
        const storedUserId = await AsyncStorage.getItem("userId");
        console.log("userid in app.js is", storedUserId, token)
        if (token && storedUserId) {
          setUserId(storedUserId);
          setIsSplash2Visible(false);
          setIsSplash3Visible(false);
          setIsSplash4Visible(false);
        } else {
          setIsSplash2Visible(true);
          setIsSplash3Visible(false);
          setIsSplash4Visible(false);
        }
      } catch (error) {
        console.error("Error checking login:", error);
      } finally {
        setCheckingLogin(false);
      }
    };

    checkLogin();
  }, []);

  useEffect(() => {
    const splashFlow = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setIsSplash1Visible(false);
    };

    splashFlow();
  }, []);

  if (isSplash1Visible) {
    return <SplashScreen1 />;
  }

  if (isSplash2Visible) {
    return <SplashScreen2 onNext={() => {
      setIsSplash2Visible(false);
      setIsSplash3Visible(true);
    }} />;
  }
  if (isSplash3Visible) {
    return <SplashScreen3 onNext={() => {
      setIsSplash3Visible(false);
      setIsSplash4Visible(true);
    }} />;
  }
  if (isSplash4Visible) {
    return <SplashScreen4 onNext={() => setIsSplash4Visible(false)} />;
  }


  if (checkingLogin) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>


      <ThemeProvider>
        <StripeProvider
          publishableKey={stripeKey}
          merchantDisplayName="Basit Sanitary App"
        >
          <NavigationContainer>
            <Stack.Navigator initialRouteName={userId ? "Main" : "Login"}>
              <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" options={{ headerShown: false }}>
                {(props) => <LoginScreen {...props} setUserId={setUserId} />}
              </Stack.Screen>
              <Stack.Screen name="Main" options={{ headerShown: false }}>
                {(props) => <BottomTabs {...props} />}
              </Stack.Screen>
              <Stack.Screen name="AllNotifications" component={AllNotifications} />
              <Stack.Screen name="templatefeatures" component={TemplateDetail} options={{
                title: "AI Pics Features Detail", headerStyle: {
                  backgroundColor: "#141414", // ✅ Change this to your desired color
                },
                headerTintColor: "#ff3d9b", // ✅ makes title & back button white
                headerTitleStyle: {
                  fontWeight: "bold", // optional styling for title
                },
              }} />
              <Stack.Screen name="AIpicsfeaturedetail" component={PicFeatureDetailScreen} options={{ title: "AI Pics Features Detail" }} />

              <Stack.Screen name="SimpleImageEditor" component={SimpleImageEditor} options={{ title: "Image Editor" }} />

              <Stack.Screen name="VideoGenerateScreen" component={VideoGenerateScreen} options={{ title: "Videos Features" }} />

              <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Profile" component={UserScreen} options={{ title: "Profile" }} />
              {/* <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} /> */}
              <Stack.Screen name="User" component={UserScreen} />
              <Stack.Screen name="AccountDetail" component={AccountDetailScreen} />
              <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} />
              <Stack.Screen name="faq" component={FAQ} />
              {/* <Stack.Screen name="StripePayment" component={StripePayment} /> */}
              <Stack.Screen name="Logout" component={LogoutScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </StripeProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },

  // 🔥 Neon Header
  header: {
    paddingTop: 25,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderBottomWidth: 1,
    // borderColor: "#222",
    backgroundColor: "#141414",
    shadowColor: "#8b3dff",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  headerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    // borderColor: "#8b3dff",
    // shadowColor: "#8b3dff",
    // shadowOpacity: 0.8,
    // shadowRadius: 12,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginLeft: 10,
    textTransform: "uppercase",
    color: "#ff3d9b", // base white text
    textShadowColor: "#8b3dff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    // Extra layered glow
    shadowColor: "#ff3d9b",
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },
  belliconmaincontainer: { paddingRight: 5 },
  belliconContainer: {
    padding: 8,
    backgroundColor: "#1f1f1f",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ff3d9b",
    shadowColor: "#8b3dff",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },

  // 🔥 Body
  body: { flex: 1, backgroundColor: "#0d0d0d" },

  // 🔥 Neon Footer
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 3,
    position: "absolute",
    bottom: 15,
    width: "92%",
    alignSelf: "center",
    borderRadius: 40,
    backgroundColor: "rgba(20,20,20,0.95)",
    borderWidth: 1,
    borderColor: "rgba(139,61,255,0.3)",
    shadowColor: "#8b3dff",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },

  footerButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 6,
    borderRadius: 30,
  },

  iconWrapper: {
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column", // stack icon + text vertically
    padding: 6,
  },

  activeCircle: {
    backgroundColor: "#292929ff",  // neon purple
    shadowColor: "#ff3d9b",      // pink glow
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },

  activeText: {
    fontSize: 12,
    marginTop: 4,
    color: "#ff3d9b",
    fontWeight: "600",
  },

  inactiveText: {
    fontSize: 12,
    marginTop: 4,
    color: "white",
  },

});

