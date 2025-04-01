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
      favicon: "./assets/favicon.png"
    },
    extra: {
      stripePublishableKey: "pk_test_51R3MjH00u6wzvIw1kKyruiEAfGOCI3prdDHAc0gyqYBhSjCWJ8vgiMERjXcNqwHzgVLlV4zpzLi9L3bJx4fmCpWV00XrypsthE",
      apiUrl: process.env.NODE_ENV === 'development' 
        ? "http://localhost:3000"
        : "https://your-production-api-url.com"
    }
  }
};
