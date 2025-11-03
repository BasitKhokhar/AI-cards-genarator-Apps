import 'dotenv/config';

export default () => ({
  expo: {
    name: "AI Cards Genarator App",
    slug: "AI Cards Genarator App",
    owner: "basitkhokhar4949",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    android: {
      package: "com.basitkhokhar.sanitaryapp",
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
      }
    },
    web: {
      favicon: "./assets/logo.png"
    },
    plugins: [
      "expo-secure-store",
      "expo-web-browser",
       "expo-font"
    ],
    extra: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      API_BASE_URL: process.env.API_BASE_URL,

        // ✅ Add Firebase keys here
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASURMENT_ID,

      eas: {
        "projectId": "efe6213b-a303-4ae6-b3f1-e8f715fbeb45"
      },

    }
  }
});
