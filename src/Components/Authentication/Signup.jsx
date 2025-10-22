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
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import Icon from "react-native-vector-icons/FontAwesome";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Constants from "expo-constants";
// import { colors } from "../../Themes/colors"; 

// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const SignupScreen = ({ navigation }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [city, setCity] = useState("");
//   const [address, setAddress] = useState("");
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   // Validation
//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const isValidPhone = (phone) => /^\d{11}$/.test(phone);

//   const validateInputs = () => {
//     if (!name || !email || !password || !phone || !city || !address) {
//       Alert.alert("Error", "All fields are required!");
//       return false;
//     }
//     if (!isValidEmail(email)) {
//       Alert.alert("Error", "Invalid email format!");
//       return false;
//     }
//     if (!isValidPhone(phone)) {
//       Alert.alert("Error", "Phone number must be 11 digits!");
//       return false;
//     }
//     if (password.length < 8) {
//       Alert.alert("Error", "Password must be at least 8 characters long!");
//       return false;
//     }
//     return true;
//   };

//   const handleSignup = async () => {
//     if (!validateInputs()) return;

//     try {
//       const termsAccepted = await AsyncStorage.getItem("termsAccepted");
//       const termsStatus = termsAccepted === "true";

//       const response = await fetch(`${API_BASE_URL}/auth/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//           phone,
//           city,
//           address,
//           termsStatus,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert("Success", "Signup successful! Please log in.");
//         navigation.navigate("Login");
//       } else {
//         Alert.alert("Error", data.message || "Signup failed");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Signup failed: " + error.message);
//     }
//   };

//   return (
//     <View
//       // colors={colors.gradients.deepTech}
//       style={styles.gradient}
//     >
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <View style={styles.formContainer}>
//           <Text style={styles.title}>Create Account</Text>
//           <Text style={styles.subtitle}>
//             Join us to start your smart journey
//           </Text>

//           <TextInput
//             placeholder="Full Name"
//             placeholderTextColor={colors.mutedText}
//             value={name}
//             onChangeText={setName}
//             style={styles.input}
//           />
//           <TextInput
//             placeholder="Email"
//             placeholderTextColor={colors.mutedText}
//             value={email}
//             onChangeText={setEmail}
//             style={styles.input}
//             keyboardType="email-address"
//           />

//           {/* Password with eye toggle */}
//           <View style={styles.passwordContainer}>
//             <TextInput
//               placeholder="Password"
//               placeholderTextColor={colors.mutedText}
//               value={password}
//               onChangeText={setPassword}
//               style={[styles.input, styles.passwordInput]}
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

//           <TextInput
//             placeholder="Phone (11 digits)"
//             placeholderTextColor={colors.mutedText}
//             value={phone}
//             onChangeText={setPhone}
//             style={styles.input}
//             keyboardType="phone-pad"
//           />
//           <TextInput
//             placeholder="City"
//             placeholderTextColor={colors.mutedText}
//             value={city}
//             onChangeText={setCity}
//             style={styles.input}
//           />
//           <TextInput
//             placeholder="Address"
//             placeholderTextColor={colors.mutedText}
//             value={address}
//             onChangeText={setAddress}
//             style={styles.input}
//           />

//           {/* Signup button */}
//           <TouchableOpacity
//             onPress={handleSignup}
//             activeOpacity={0.9}
//             style={styles.buttonWrapper}
//           >
//             <LinearGradient
//               colors={colors.gradients.ocean}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.button}
//             >
//               <Text style={styles.buttonText}>Sign Up</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           {/* Already have account */}
//           <View style={styles.signupRow}>
//             <Text style={styles.normalText}>Already have an account?</Text>
//             <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//               <Text style={styles.link}> Login</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   gradient: { flex: 1 },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,backgroundColor:colors.bodybackground
//   },
//   formContainer: {
//     backgroundColor: colors.cardsbackground,
//     padding: 25,
//     borderRadius: 20,
//     borderWidth: 1.5,
//     borderColor: colors.border,
//     shadowColor: colors.primary,
//     shadowOpacity: 0.5,
//     shadowRadius: 18,
//     elevation: 12,
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
//     shadowColor: colors.accent,
//     shadowOpacity: 0.8,
//     shadowRadius: 20,
//     elevation: 8,
//     marginTop: 15,
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
// });

// export default SignupScreen;
// 

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { MotiView, AnimatePresence } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../Themes/colors";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const SignupScreen = ({ navigation }) => {
  // Input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Error states
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  // Modal + Toast
  const [showLoader, setShowLoader] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\d{11}$/.test(phone);

  const validateInputs = () => {
    const nameErr = name.trim() === "";
    const emailErr = !isValidEmail(email);
    const passErr = password.length < 8;
    const phoneErr = !isValidPhone(phone);

    setNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passErr);
    setPhoneError(phoneErr);

    return !(nameErr || emailErr || passErr || phoneErr);
  };

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    try {
      setShowLoader(true);
      const termsAccepted = await AsyncStorage.getItem("termsAccepted");
      const termsStatus = termsAccepted === "true";

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          termsStatus,
        }),
      });

      const data = await response.json();
      setShowLoader(false);

      if (response.ok) {
        showToastMessage("Signup successful! Redirecting...");
        setTimeout(() => navigation.navigate("Login"), 2000);
      } else {
        showToastMessage(data.message || "Signup failed");
      }
    } catch (error) {
      setShowLoader(false);
      showToastMessage("Signup failed: " + error.message);
    }
  };

  return (
    <View style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to start your smart journey</Text>

          {/* Full Name */}
          <TextInput
            placeholder="Full Name"
            placeholderTextColor={colors.mutedText}
            value={name}
            onChangeText={setName}
            style={[styles.input, nameError && styles.errorInput]}
          />
          {nameError && <Text style={styles.errorText}>Name is required</Text>}

          {/* Email */}
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.mutedText}
            value={email}
            onChangeText={setEmail}
            style={[styles.input, emailError && styles.errorInput]}
            keyboardType="email-address"
          />
          {emailError && <Text style={styles.errorText}>Invalid email format</Text>}

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
            <Text style={styles.errorText}>Password must be at least 8 characters</Text>
          )}

          {/* Phone */}
          <TextInput
            placeholder="Phone (11 digits)"
            placeholderTextColor={colors.mutedText}
            value={phone}
            onChangeText={setPhone}
            style={[styles.input, phoneError && styles.errorInput]}
            keyboardType="phone-pad"
          />
          {phoneError && (
            <Text style={styles.errorText}>Phone number must be 11 digits</Text>
          )}

          {/* Signup Button */}
          <TouchableOpacity
            onPress={handleSignup}
            activeOpacity={0.9}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={colors.gradients.ocean}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Already have account */}
          <View style={styles.signupRow}>
            <Text style={styles.normalText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* 🔄 Loader Modal */}
      <AnimatePresence>
        {showLoader && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "timing", duration: 300 }}
            style={styles.overlay}
          >
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "timing", duration: 400 }}
              style={[styles.loaderBox, { backgroundColor: colors.cardsbackground }]}
            >
              <MotiView
                from={{ rotate: "0deg" }}
                animate={{ rotate: "360deg" }}
                transition={{ loop: true, type: "timing", duration: 1200 }}
                style={[styles.loaderRing, { borderTopColor: colors.primary }]}
              />
              <Text style={styles.loaderText}>Please wait...</Text>
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>

      {/* ✅ Toast Modal */}
      <AnimatePresence>
        {showToast && (
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "timing", duration: 400 }}
            style={styles.overlay}
          >
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 400, delay: 150 }}
              style={[styles.toastBox, { backgroundColor: colors.cardsbackground }]}
            >
              <View style={[styles.iconWrapper, { backgroundColor: "rgba(6,182,212,0.15)" }]}>
                <Ionicons
                  name={
                    toastMessage.toLowerCase().includes("fail") ||
                    toastMessage.toLowerCase().includes("error")
                      ? "close-circle"
                      : "checkmark-circle"
                  }
                  size={60}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.toastTitle}>Done</Text>
              <Text style={styles.toastMessage}>{toastMessage}</Text>
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.bodybackground,
  },
  formContainer: {
    backgroundColor: colors.cardsbackground,
    padding: 25,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 12,
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
  errorInput: { borderColor: "red" },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 5,
  },
  passwordContainer: { position: "relative", width: "100%" },
  passwordInput: { paddingRight: 45 },
  eyeIcon: { position: "absolute", right: 12, top: 20 },
  buttonWrapper: {
    width: "100%",
    borderRadius: 40,
    shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
    marginTop: 15,
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
  normalText: { color: colors.mutedText, fontSize: 14 },
  link: { color: colors.primary, fontWeight: "bold", fontSize: 15 },

  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  loaderBox: {
    width: 140,
    height: 140,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  loaderRing: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 12,
  },
  loaderText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  toastBox: {
    width: "75%",
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  toastTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  toastMessage: {
    color: colors.mutedText,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
