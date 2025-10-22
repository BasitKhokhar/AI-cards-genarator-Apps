import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { colors } from "../../Themes/colors"; 

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateInputs = () => {
    setEmailError(!isValidEmail(email));
    setPasswordError(password.length < 8);
    return isValidEmail(email) && password.length >= 8;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.userId && data.email && data.accessToken && data.refreshToken) {
        await SecureStore.setItemAsync("accessToken", data.accessToken);
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);
        await AsyncStorage.setItem("userId", data.userId.toString());

        navigation.replace("SplashScreen");
      } else {
        Alert.alert("Error", data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "Login failed");
    }
  };

  return (
    <View
      // colors={colors.gradients.deepTech}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue your smart journey
          </Text>

          {/* Email */}
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.mutedText}
            value={email}
            onChangeText={setEmail}
            style={[styles.input, emailError && styles.errorInput]}
            keyboardType="email-address"
          />
          {emailError && (
            <Text style={styles.errorText}>Invalid email format</Text>
          )}

          {/* Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.mutedText}
              value={password}
              onChangeText={setPassword}
              style={[
                styles.input,
                styles.passwordInput,
                passwordError && styles.errorInput,
              ]}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon
                name={passwordVisible ? "eye-slash" : "eye"}
                size={20}
                color={colors.mutedText}
              />
            </TouchableOpacity>
          </View>
          {passwordError && (
            <Text style={styles.errorText}>
              Password must be at least 8 characters
            </Text>
          )}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.9}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={colors.gradients.ocean}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Signup Link */}
          <View style={styles.signupRow}>
            <Text style={styles.normalText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.link}> Sign up</Text>
            </TouchableOpacity>
          </View>

          {/* Social Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="google" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="facebook" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="apple" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor:colors.bodybackground
  },
  formContainer: {
    backgroundColor: colors.cardsbackground,
    padding: 30,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 18,
    elevation: 10,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    textShadowColor: colors.primary,
    textShadowRadius: 12,
    marginBottom: 5,
  },
  subtitle: {
    color: colors.mutedText,
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    color: colors.text,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 5,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    paddingRight: 45,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 20,
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 40,
    // shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
    marginTop: 30,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  normalText: {
    color: colors.mutedText,
    fontSize: 14,
  },
  link: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    gap: 20,
  },
  socialButton: {
    backgroundColor: colors.secondary,
    padding: 14,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default LoginScreen;


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   Modal,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import Icon from "react-native-vector-icons/FontAwesome";
// import * as SecureStore from "expo-secure-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Constants from "expo-constants";
// import { colors } from "../../Themes/colors";
// import { MotiView, MotiText } from "moti";

// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [emailError, setEmailError] = useState(false);
//   const [passwordError, setPasswordError] = useState(false);
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const showModal = (message) => {
//     setModalMessage(message);
//     setModalVisible(true);
//     setTimeout(() => setModalVisible(false), 2500);
//   };

//   const validateInputs = () => {
//     if (!email || !password) {
//       showModal("Please fill in all fields.");
//       return false;
//     }
//     if (!isValidEmail(email)) {
//       setEmailError(true);
//       showModal("Invalid email format.");
//       return false;
//     }
//     if (password.length < 8) {
//       setPasswordError(true);
//       showModal("Password must be at least 8 characters.");
//       return false;
//     }
//     setEmailError(false);
//     setPasswordError(false);
//     return true;
//   };

//   const handleLogin = async () => {
//     if (!validateInputs()) return;

//     try {
//       const res = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (data.userId && data.email && data.accessToken && data.refreshToken) {
//         await SecureStore.setItemAsync("accessToken", data.accessToken);
//         await SecureStore.setItemAsync("refreshToken", data.refreshToken);
//         await AsyncStorage.setItem("userId", data.userId.toString());
//         navigation.replace("SplashScreen");
//       } else {
//         showModal(data.message || "Invalid credentials");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       showModal("Login failed. Please try again.");
//     }
//   };

//   return (
//     <View style={styles.gradient}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <View style={styles.formContainer}>
//           <Text style={styles.title}>Welcome Back</Text>
//           <Text style={styles.subtitle}>
//             Sign in to continue your smart journey
//           </Text>

//           {/* Email */}
//           <TextInput
//             placeholder="Email"
//             placeholderTextColor={colors.mutedText}
//             value={email}
//             onChangeText={setEmail}
//             style={[styles.input, emailError && styles.errorInput]}
//             keyboardType="email-address"
//           />
//           {emailError && (
//             <Text style={styles.errorText}>Invalid email format</Text>
//           )}

//           {/* Password */}
//           <View style={styles.passwordContainer}>
//             <TextInput
//               placeholder="Password"
//               placeholderTextColor={colors.mutedText}
//               value={password}
//               onChangeText={setPassword}
//               style={[
//                 styles.input,
//                 styles.passwordInput,
//                 passwordError && styles.errorInput,
//               ]}
//               secureTextEntry={!passwordVisible}
//             />
//             <TouchableOpacity
//               style={styles.eyeIcon}
//               onPress={() => setPasswordVisible(!passwordVisible)}
//             >
//               <Icon
//                 name={passwordVisible ? "eye-slash" : "eye"}
//                 size={20}
//                 color={colors.mutedText}
//               />
//             </TouchableOpacity>
//           </View>
//           {passwordError && (
//             <Text style={styles.errorText}>
//               Password must be at least 8 characters
//             </Text>
//           )}

//           {/* Login Button */}
//           <TouchableOpacity
//             onPress={handleLogin}
//             activeOpacity={0.9}
//             style={styles.buttonWrapper}
//           >
//             <LinearGradient
//               colors={colors.gradients.ocean}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.button}
//             >
//               <Text style={styles.buttonText}>Login</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           {/* Signup Link */}
//           <View style={styles.signupRow}>
//             <Text style={styles.normalText}>Don’t have an account?</Text>
//             <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
//               <Text style={styles.link}> Sign up</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Social Buttons */}
//           <View style={styles.buttonsContainer}>
//             <TouchableOpacity style={styles.socialButton}>
//               <Icon name="google" size={22} color={colors.text} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.socialButton}>
//               <Icon name="facebook" size={22} color={colors.text} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.socialButton}>
//               <Icon name="apple" size={22} color={colors.text} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingView>

//       {/* Animated Error Modal */}
//       <Modal transparent visible={modalVisible} animationType="fade">
//         <View style={styles.modalBackdrop}>
//           <MotiView
//             from={{ opacity: 0, translateY: -20 }}
//             animate={{ opacity: 1, translateY: 0 }}
//             exit={{ opacity: 0, translateY: -20 }}
//             transition={{ type: "timing", duration: 350 }}
//             style={styles.modalContainer}
//           >
//             <MotiText
//               from={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               style={styles.modalText}
//             >
//               {modalMessage}
//             </MotiText>
//           </MotiView>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   gradient: { flex: 1 },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: colors.bodybackground,
//   },
//   formContainer: {
//     backgroundColor: colors.cardsbackground,
//     padding: 30,
//     borderRadius: 20,
//     borderWidth: 1.5,
//     borderColor: colors.border,
//     shadowColor: colors.primary,
//     shadowOpacity: 0.5,
//     shadowRadius: 18,
//     elevation: 10,
//     width: "100%",
//     maxWidth: 400,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: colors.text,
//     textAlign: "center",
//     textShadowColor: colors.primary,
//     textShadowRadius: 12,
//     marginBottom: 5,
//   },
//   subtitle: {
//     color: colors.mutedText,
//     textAlign: "center",
//     marginBottom: 20,
//     fontSize: 14,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: colors.border,
//     padding: 12,
//     marginVertical: 8,
//     borderRadius: 12,
//     backgroundColor: colors.secondary,
//     color: colors.text,
//   },
//   errorInput: {
//     borderColor: "red",
//   },
//   errorText: {
//     color: "red",
//     fontSize: 12,
//     marginBottom: 5,
//     marginLeft: 5,
//   },
//   passwordContainer: {
//     position: "relative",
//     width: "100%",
//   },
//   passwordInput: {
//     paddingRight: 45,
//   },
//   eyeIcon: {
//     position: "absolute",
//     right: 12,
//     top: 20,
//   },
//   buttonWrapper: {
//     width: "100%",
//     borderRadius: 40,
//     shadowOpacity: 0.8,
//     shadowRadius: 20,
//     elevation: 8,
//     marginTop: 30,
//   },
//   button: {
//     paddingVertical: 16,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: colors.text,
//     fontSize: 18,
//     fontWeight: "600",
//     letterSpacing: 1,
//   },
//   signupRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 15,
//   },
//   normalText: {
//     color: colors.mutedText,
//     fontSize: 14,
//   },
//   link: {
//     color: colors.primary,
//     fontWeight: "bold",
//     fontSize: 15,
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 25,
//     gap: 20,
//   },
//   socialButton: {
//     backgroundColor: colors.secondary,
//     padding: 14,
//     borderRadius: 50,
//     alignItems: "center",
//     justifyContent: "center",
//     width: 55,
//     height: 55,
//     borderWidth: 1,
//     borderColor: colors.border,
//     shadowColor: colors.primary,
//     shadowOpacity: 0.4,
//     shadowRadius: 10,
//     elevation: 5,
//   },

//   // 🔹 Modal Styles
//   modalBackdrop: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.3)",
//   },
//   modalContainer: {
//     backgroundColor: colors.cardsbackground,
//     padding: 20,
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: colors.border,
//     shadowColor: colors.primary,
//     shadowOpacity: 0.5,
//     shadowRadius: 10,
//     elevation: 6,
//   },
//   modalText: {
//     color: colors.text,
//     fontSize: 16,
//     fontWeight: "500",
//     textAlign: "center",
//   },
// });

// export default LoginScreen;
