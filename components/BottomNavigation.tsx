import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
}

interface BottomNavigationProps {
  items: NavItem[];
  onItemPress: (item: NavItem) => void;
  isDarkMode: boolean; // Added prop
}

const BottomNavigation = ({ items, onItemPress, isDarkMode }: BottomNavigationProps) => {
  return (
    <View style={[styles.bottomNav, isDarkMode && styles.darkNav]}>
      {items.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.navItem}
          onPress={() => onItemPress(item)}
        >
          <Ionicons 
            name={item.active ? item.icon : (item.icon.endsWith('-outline') ? item.icon : `${item.icon}-outline`)} 
            size={24} 
            color={item.active ? "#3e7d32" : (isDarkMode ? "#ccc" : "#888")} 
          />
          <Text style={[
            styles.navText, 
            item.active && styles.activeNavText,
            isDarkMode && styles.darkText
          ]}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 5,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  navText: {
    fontSize: 11,
    marginTop: 4,
    color: '#888',
  },
  activeNavText: {
    color: '#3e7d32',
    fontWeight: '500',
  },
  darkNav: {
    backgroundColor: "#333",
  },
  darkText: {
    color: "#ccc",
  }
});

export default BottomNavigation;