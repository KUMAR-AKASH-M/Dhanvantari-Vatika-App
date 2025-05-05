export default {
  expo: {
    name: "DhanvantariVatika",
    slug: "DhanvantariVatika",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.dhanvantarivatika.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.dhanvantarivatika.app"
    },
    web: {
      favicon: "./assets/images/favicon.png"
    },
    extra: {
      stripePublishableKey: "",
      apiUrl: process.env.NODE_ENV === 'development' 
        ? "http://localhost:3000"
        : "https://your-production-api-url.com"
    }
  }
};
