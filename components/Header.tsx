import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  headerTranslateY?: Animated.AnimatedInterpolation<string | number>;
  isDarkMode?: boolean; // Receive theme state from parent
  onThemeChange?: (isDark: boolean) => void; // Callback to notify parent
}

const Header = ({ headerTranslateY, isDarkMode = false, onThemeChange }: HeaderProps) => {
  // Use local state if no external state is provided
  const [localIsDarkMode, setLocalIsDarkMode] = useState(false);
  
  // Use either provided isDarkMode or local state
  const currentTheme = isDarkMode !== undefined ? isDarkMode : localIsDarkMode;
  
  const toggleTheme = () => {
    const newThemeValue = !currentTheme;
    
    // Update local state if needed
    if (isDarkMode === undefined) {
      setLocalIsDarkMode(newThemeValue);
    }
    
    // Notify parent component if callback is provided
    if (onThemeChange) {
      onThemeChange(newThemeValue);
    }
  };
  
  return (
    <Animated.View 
      style={[
        styles.header, 
        headerTranslateY ? {transform: [{translateY: headerTranslateY}]} : null,
        isDarkMode && styles.darkHeader
      ]}>
      <View>
        <Text style={[styles.appName, isDarkMode && styles.darkText]}>Dhanvantari Vatika</Text>
        <Text style={[styles.tagline, isDarkMode && styles.darkText]}>Ancient Wisdom For Modern Wellness</Text>
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
          <Ionicons name={currentTheme ? "sunny-outline" : "moon-outline"} size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="cart-outline" size={22} color="#fff" />
          <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 15,
    backgroundColor: "#3e7d32",
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
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
    backgroundColor: "#121212",
  },
  darkText: {
    color: "#fff",
  },
});

export default Header;
