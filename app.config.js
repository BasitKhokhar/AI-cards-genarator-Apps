import 'dotenv/config';

export default () => ({
  expo: {
    name: "AI Cards Genarator App",
    slug: "AI Cards Genarator App",
    owner: "basitkhokhar4949",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/picnova.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/picnova.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    android: {
      package: "com.basitkhokhar.sanitaryapp",
      adaptiveIcon: {
        foregroundImage: "./assets/picnova.png",
      }
    },
    web: {
      favicon: "./assets/picnova.png"
    },
    plugins: [
      "expo-secure-store",
      "expo-web-browser",
    ],
    extra: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      API_BASE_URL: process.env.API_BASE_URL,
      eas: {
        "projectId": "efe6213b-a303-4ae6-b3f1-e8f715fbeb45"
      },

    }
  }
});
