import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // Changed from useNavigation to useRouter

interface HeroBannerProps {
  imageSource: any;
  title: string;
  subtitle: string;
  buttonText: string;
  onPress?: () => void;
  isDarkMode: boolean;
  navigateToTab?: string; 
}

const HeroBanner = ({ 
  imageSource, 
  title, 
  subtitle, 
  buttonText, 
  onPress,
  isDarkMode,
  navigateToTab = 'herbs' // Changed from 'Herbs' to lowercase 'herbs' to match route
}: HeroBannerProps) => {
  const router = useRouter(); // Use Expo Router instead
  
  // Handle button press with navigation logic
  const handlePress = () => {
    if (buttonText.toLowerCase().includes('explore')) {
      // Navigate to the correct route using Expo Router
      router.replace(navigateToTab === 'home' ? '/' : `/(tabs)/${navigateToTab}`);
    } else if (onPress) {
      // Otherwise use the provided onPress handler
      onPress();
    }
  };
  
  return (
    <View style={styles.heroBanner}>
      <Image
        source={imageSource}
        style={styles.bannerImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)']}
        style={styles.bannerOverlay}
      >
        <Text style={[styles.bannerTitle, isDarkMode && styles.darkText]}>{title}</Text>
        <Text style={[styles.bannerSubtitle, isDarkMode && styles.darkText]}>{subtitle}</Text>
        <TouchableOpacity style={styles.bannerButton} onPress={handlePress}>
          <Text style={styles.bannerButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  heroBanner: {
    height: 220,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    elevation: 4,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    height: '70%',
    justifyContent: 'flex-end',
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  darkText: {
    color: "#fff",
  },
  bannerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginBottom: 15,
  },
  bannerButton: {
    backgroundColor: "#3e7d32",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: "flex-start",
    elevation: 2,
  },
  bannerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default HeroBanner;