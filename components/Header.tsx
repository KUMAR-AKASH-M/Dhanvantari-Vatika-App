import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

interface HeaderProps {
  headerTranslateY?: Animated.AnimatedInterpolation<string | number>;
  onCartPress?: () => void; // Add cart press handler
  cartItemsCount?: number; // Add cart items count prop
  title?: string; // Optional title override
}

// SVG path for a simple leaf shape
const leafPath = "M10,0 C10,0 20,15 10,30 C0,15 10,0 10,0 Z";

const Header = ({ 
  headerTranslateY,
  onCartPress,
  cartItemsCount = 0,
  title
}: HeaderProps) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Colors based on theme
  const gradientColors = isDarkMode 
    ? ['#1a3a30', '#0f2018'] 
    : ['#4e9a41', '#3e7d32'];
    
  // Leaf colors based on theme
  const lightLeafColors = ['rgba(255, 255, 255, 0.5)', 'rgba(220, 255, 220, 0.6)'];
  const darkLeafColors = ['rgba(255, 255, 255, 0.3)', 'rgba(200, 255, 200, 0.3)'];
  
  return (
    <Animated.View 
      style={[
        styles.header, 
        headerTranslateY ? {transform: [{translateY: headerTranslateY}]} : null,
        isDarkMode && styles.darkHeader
      ]}>
      <LinearGradient
        colors={gradientColors}
        style={styles.backgroundGradient}
      >
        {/* Pattern overlay */}
        <View style={styles.patternContainer}>
          {/* Leaf patterns */}
          {[...Array(10)].map((_, i) => {
            const isLightMode = !isDarkMode;
            const size = isLightMode ? 
              15 + Math.random() * 10 : 
              20 + Math.random() * 15;
            const leafColor = isLightMode ? 
              lightLeafColors[i % 2] : 
              darkLeafColors[i % 2];
            const rotation = Math.random() * 360;
            const posX = i * 40 + Math.random() * 30;
            const posY = Math.random() * 100;
              
            return (
              <View 
                key={i} 
                style={[
                  styles.leafContainer,
                  {
                    left: posX,
                    top: posY,
                    transform: [
                      { rotate: `${rotation}deg` },
                      { scale: 0.8 + Math.random() * 0.5 }
                    ],
                  }
                ]}
              >
                <Svg width={size * 2} height={size * 3} viewBox="0 0 20 30">
                  <Path 
                    d={leafPath} 
                    fill={leafColor} 
                    stroke={isLightMode ? "rgba(0,100,0,0.1)" : "rgba(255,255,255,0.1)"} 
                    strokeWidth="0.5" 
                  />
                </Svg>
                <View 
                  style={[
                    styles.leafStem,
                    { backgroundColor: isLightMode ? "rgba(210,255,210,0.6)" : "rgba(200,255,200,0.3)" }
                  ]} 
                />
              </View>
            );
          })}
        </View>
        
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.appName, isDarkMode && styles.darkText]}>
              {title || "Dhanvantari Vatika"}
            </Text>
            <Text style={[styles.tagline, isDarkMode && styles.darkText]}>
              Ancient Wisdom For Modern Wellness
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
              <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={22} color="#fff" />
            </TouchableOpacity>
            {onCartPress && (
              <TouchableOpacity style={styles.iconButton} onPress={onCartPress}>
                <Ionicons name="cart-outline" size={22} color="#fff" />
                {cartItemsCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartItemsCount > 99 ? '99+' : cartItemsCount.toString()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
    backgroundColor: "#3e7d32", // Fallback
  },
  backgroundGradient: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  leafContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  leafStem: {
    position: 'absolute',
    width: 2,
    height: 15,
    bottom: -12,
    backgroundColor: 'rgba(210,255,210,0.6)',
  },
  leafShape: {
    position: 'absolute',
    width: 30,
    height: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  lightModeLeaf: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    // Add subtle shadow for better visibility in light mode
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  darkModeLeaf: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 15,
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  tagline: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 8,
    marginLeft: 5,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ff5722',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  darkHeader: {
    backgroundColor: "#1a3a30", // Darker green that matches a night theme
  },
  darkText: {
    color: "#e0e0e0", // Slightly off-white for better night mode readability
  },
});

export default Header;
