import { fonts } from "./src/Themes/fonts";
import { useFonts } from "expo-font";
import {Poppins_400Regular,Poppins_600SemiBold,Poppins_700Bold,} from "@expo-google-fonts/poppins";
import {Inter_300Light,Inter_400Regular,Inter_500Medium,Inter_700Bold,} from "@expo-google-fonts/inter";
import { Orbitron_500Medium, Orbitron_700Bold } from "@expo-google-fonts/orbitron";
import {Nunito_300Light,Nunito_400Regular,Nunito_500Medium,} from "@expo-google-fonts/nunito";
import { colors } from "./src/Themes/colors";
import React, { useState, useEffect } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator  } from "react-native";

import { TourGuideProvider } from "rn-tourguide";
// import RootNavigator from "./src/navigation/RootNavigator";
import { NavigationContainer } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

import GradientIcon from "./src/Screens/AssetsScreen/samplegradient";

import { GenerationProvider } from "./src/Context/ImageGenerationContext";

import CustomTooltip from "./src/Components/IntroGuiding/CustomTooltip";
// splashscreens //
import SplashScreen from "./src/Screens/SplashScreens/SplashScreen";
import SplashScreen1 from "./src/Screens/SplashScreens/SplashScreen1";
import SplashScreen2 from "./src/Screens/SplashScreens/SplashScreen2";
import SplashScreen3 from "./src/Screens/SplashScreens/SplashScreen3";
import SplashScreen4 from "./src/Screens/SplashScreens/SplashScreen4";
// Authentications Screens //
import SignupScreen from "./src/Components/Authentication/Signup";
import LoginScreen from "./src/Components/Authentication/Login";

import PaymentModal from "./src/Screens/PaymentMethodsScreen/PaymentModel";
import HomeScreen from "./src/Screens/HomeScreen/HomeScreen";
import TemplateDetail from "./src/Screens/HomeScreen/CardsTemplates";
import CommunityCategoryTemplatesScreen from "./src/Screens/HomeScreen/CommunityTemplates";

import AITemplatesResultScreen from "./src/Screens/HomeScreen/AITemplateResultsScreen";

import CategoriesScreen from "./src/Screens/HomeScreen/CardsCategories";
import SearchResultsScreen from "./src/Screens/HomeScreen/SearchResultsScreen";
import AssetsMainScreen from "./src/Screens/AssetsScreen/AssetsMain";

import AllNotifications from "./src/Screens/NotificationsScreen/AllNotifications";

import PaymentSelectionScreen from "./src/Screens/PaymentMethodsScreen/PaymentMethods";
import EasypaisaPaymentScreen from "./src/Screens/PaymentMethodsScreen/EasyPaisaScreen";
import JazzCashPaymentScreen from "./src/Screens/PaymentMethodsScreen/JazzCashScreen";

import SimpleImageEditor from "./src/Screens/HomeScreen/SimpleEditing";

import UserScreen from "./src/Screens/UserScreen/UserScreen";
import AccountDetailScreen from "./src/Screens/UserScreen/AccountDetailScreen";
import AboutApp from "./src/Screens/UserScreen/About";
import CustomerSupportScreen from "./src/Screens/UserScreen/CustomerSupportScreen";
import FAQ from "./src/Screens/UserScreen/FAQ";
// import StripePayment from "./Components/Cart/StripePayment";
import LogoutScreen from "./src/Screens/UserScreen/LogoutScreen";
import 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import PrivacyPolicy from "./src/Screens/UserScreen/PrivacyPolicy";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const stripeKey = Constants.expoConfig.extra.stripePublishableKey;
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainLayout = ({ navigation, children, currentScreen }) => {
  // const { theme } = useTheme();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  return (
    <View style={styles.container}>
      {/* 🔥 Header */}
      <View style={styles.header}>
        <View style={styles.headerItem}>
          <Image source={require("./assets/logo.png")} style={styles.logo} />
        </View>
        <View style={styles.headerRight}>
          {/* 💎 Pro Button */}
          <TouchableOpacity
            onPress={() => setShowPaymentModal(true)}
            style={styles.circularButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={colors.gradients.ocean}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.circularGradient}
            >
              <Text style={styles.proText}>PRO</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* 🔔 Notification Icon */}
          <TouchableOpacity
            onPress={() => navigation.navigate("AllNotifications")}
            style={[styles.circularButton, { borderWidth: 2, borderColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <View style={[styles.circularGradient, { backgroundColor: "#1f1f1f" }]}>
              <Icon name="notifications" size={22} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 💫 Payment Modal */}
      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onContinue={(planData) => console.log("Selected plan:", planData)}
        navigation={navigation}
      />

      {/* Body */}
      <View style={styles.body}>{children}</View>

      {/* Footer */}
      <View style={styles.footer}>
        {[
          { name: "Home", icon: "home" },
          { name: "Designs", icon: "auto-awesome" },
          { name: "Assets", icon: "collections" },
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
                  <GradientIcon iconName={icon} iconSize={22} />
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

// 💫 Common header style for all screens
export const commonHeaderOptions = {
  headerStyle: {
    backgroundColor: colors.cardsbackground, borderBottomWidth: 1, borderColor: colors.border
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

const App = () => {
 // for diffferent custom fonts 
 const [fontsLoaded] = useFonts({
    Orbitron_500Medium,
    Orbitron_700Bold,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
  });

 

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

 // ✅ Conditional rendering happens AFTER all hooks
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00f0ff" />
      </View>
    );
  }

  if (checkingLogin) {
    return <SplashScreen />;
  }

  return (
    <TourGuideProvider
      tooltipComponent={CustomTooltip}
      overlayColor="rgba(0,0,0,0.6)"
      androidStatusBarVisible={true}
      preventOutsideInteraction={true}  // ✅ block all background touches
      backdropColor="rgba(0,0,0,0.7)"   // ✅ darker focus effect
      tooltipStyle={{ borderRadius: 12 }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GenerationProvider>
          {/* <ThemeProvider> */}
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
                 <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }}/>

                <Stack.Screen name="AllNotifications" component={AllNotifications} options={{ title: "All Notifications", ...commonHeaderOptions, }} />
                <Stack.Screen name="templatefeatures" component={TemplateDetail} options={{
                  title: "Template Features Detail", ...commonHeaderOptions,
                }} />
                <Stack.Screen name="SearchResultsScreen" component={SearchResultsScreen} options={{ title: "Search Anything", ...commonHeaderOptions, }} />

                <Stack.Screen name="SimpleImageEditor" component={SimpleImageEditor} options={{ title: "Image Editor" }} />

                <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={UserScreen} options={{ title: "Profile" }} />

                <Stack.Screen name="CommunityTemplatesScreen" component={CommunityCategoryTemplatesScreen} options={{ headerShown: false }} />

                <Stack.Screen name="AitemplateResultsScreen" component={AITemplatesResultScreen} options={{ title: "AI Genaration Details", ...commonHeaderOptions, }} />


                <Stack.Screen name="PaymentmethodsScreen" component={PaymentSelectionScreen} options={{ title: "Payment Methods", ...commonHeaderOptions, }} />
                <Stack.Screen name="jazzcashscreenScreen" component={JazzCashPaymentScreen} options={{ title: "JazzCash", ...commonHeaderOptions, }} />
                <Stack.Screen name="easypaisaScreen" component={EasypaisaPaymentScreen} options={{ title: "EasyPaisa", ...commonHeaderOptions, }} />
                {/* <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} /> */}
                <Stack.Screen name="User" component={UserScreen} />
                <Stack.Screen name="AccountDetail" component={AccountDetailScreen} options={{ title: "Account Details", ...commonHeaderOptions, }} />
                <Stack.Screen name="AboutAppScreen" component={AboutApp} options={{ title: "About CardiFy-AI", ...commonHeaderOptions, }} />
                <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} options={{ title: "Customer Support", ...commonHeaderOptions, }} />
                <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicy} options={{ title: "Privacy Policies", ...commonHeaderOptions, }} />
                <Stack.Screen name="faq" component={FAQ} options={{ title: "All FAQs", ...commonHeaderOptions, }} />
                {/* <Stack.Screen name="StripePayment" component={StripePayment} /> */}
                <Stack.Screen name="Logout" component={LogoutScreen} options={{ title: "Logout", ...commonHeaderOptions, }} />
              </Stack.Navigator>
            </NavigationContainer>
          </StripeProvider>
        </GenerationProvider>
        {/* </ThemeProvider> */}
      </GestureHandlerRootView>
    </TourGuideProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cardsbackground },

  // 🔥 Header
  header: {
    paddingTop: 25,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardsbackground,
  },

  headerItem: {
    flexDirection: "row",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  // 🔘 Shared circular button
  circularButton: {
    width: 45,
    height: 45,
    borderRadius: 24,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },

  // 🌈 Gradient background (for PRO + Notification)
  circularGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  // 💎 PRO text styling
  proText: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.5,
    textShadowColor: colors.primary,
    textShadowRadius: 4,
  },

  logo: {
    width: 90,
    height: 70,
    borderRadius: 12,
  },

  // ⚡ App Title
  appTitle: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginLeft: 10,
    textTransform: "uppercase",
    color: colors.primary,
    textShadowColor: colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    shadowColor: colors.primary,
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },

  belliconmaincontainer: { paddingRight: 5 },

  // 🔔 Notification Icon
  belliconContainer: {
    padding: 8,
    backgroundColor: colors.secondary,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },

  // 🔥 Body
  body: { flex: 1, backgroundColor: colors.bodybackground },

  // 🌌 Footer
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 3,
    position: "absolute",
    bottom: 15,
    width: "92%",
    alignSelf: "center",
    borderRadius: 40,
    backgroundColor: colors.cardsbackground,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
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
    flexDirection: "column",
    padding: 6,
  },

  activeText: {
    fontSize: 12,
    marginTop: 4,
    color: colors.text,
    fontWeight: "600",
  },

  inactiveText: {
    fontSize: 12,
    marginTop: 4,
    color: colors.text,
  },
});

