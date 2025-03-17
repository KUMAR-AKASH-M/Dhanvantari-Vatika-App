import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MenuItem = ({ item, isDarkMode }) => {
  return (
    <TouchableOpacity 
      style={[styles.menuItem, isDarkMode && styles.darkMenuItem]} 
      onPress={item.onPress}
    >
      <View style={styles.menuLeft}>
        <Ionicons 
          name={item.icon} 
          size={22} 
          color={isDarkMode ? '#aaa' : '#3e7d32'} 
          style={styles.menuIcon} 
        />
        <Text style={[styles.menuText, isDarkMode && styles.darkText]}>
          {item.title}
        </Text>
      </View>
      
      <View style={styles.menuRight}>
        {item.switch ? (
          item.switch
        ) : item.value ? (
          <Text style={[styles.menuValue, isDarkMode && styles.darkMenuValue]}>
            {item.value}
          </Text>
        ) : item.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.badge.toString()}
            </Text>
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#777' : '#999'} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const MenuSection = ({ title, items, isDarkMode }) => {
  return (
    <View style={[styles.menuSection, isDarkMode && styles.darkSection]}>
      <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
        {title}
      </Text>
      
      {items.map((item) => (
        <MenuItem key={item.id} item={item} isDarkMode={isDarkMode} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkSection: {
    backgroundColor: '#2a2a2a',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkMenuItem: {
    borderBottomColor: '#333',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    color: '#333',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValue: {
    fontSize: 14,
    color: '#888',
    marginRight: 8,
  },
  darkMenuValue: {
    color: '#aaa',
  },
  badge: {
    backgroundColor: '#3e7d32',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
});

export default MenuSection;
