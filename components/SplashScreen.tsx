import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(0.3);
  const textOpacity = new Animated.Value(0);
  const textTranslateY = new Animated.Value(20);
  
  useEffect(() => {
    const animations = [
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ];
    
    Animated.parallel(animations).start();
    
    // Trigger the onFinish callback after splash screen duration
    setTimeout(onFinish, 2500);
  }, []);

  return (
    <LinearGradient
      colors={['#4a8f3a', '#2d5e1f']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.Image
          source={{ uri: 'https://images.unsplash.com/photo-1515446134809-993c501ca304?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' }}
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.appName}>Dhanvantari Vatika</Text>
          <Text style={styles.tagline}>Ancient Wisdom, Modern Wellness</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
