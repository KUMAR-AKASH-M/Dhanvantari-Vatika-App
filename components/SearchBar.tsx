import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  isDarkMode: boolean;
  onChangeText?: (text: string) => void; // Add handler prop
  value?: string; // Add value prop
  placeholder?: string; // Add customizable placeholder
}

const SearchBar = ({ 
  isDarkMode, 
  onChangeText, 
  value = '', 
  placeholder = "Search for herbs, products, remedies..." 
}: SearchBarProps) => {
  return (
    <View style={[styles.searchContainer, isDarkMode && styles.darkContainer]}>
      <Ionicons name="search" size={20} color={isDarkMode ? "#ccc" : "#666"} style={styles.searchIcon} />
      <TextInput
        placeholder={placeholder}
        style={[styles.searchInput, isDarkMode && styles.darkInput]}
        placeholderTextColor={isDarkMode ? "#ccc" : "#999"}
        value={value}
        onChangeText={onChangeText}
      />
      {value ? (
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={() => onChangeText && onChangeText('')}
        >
          <Ionicons name="close-circle" size={18} color={isDarkMode ? "#ccc" : "#666"} />
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="filter" size={18} color={isDarkMode ? "#ccc" : "#3e7d32"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop: 20,
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  darkInput: {
    color: "#fff",
  },
  filterButton: {
    padding: 8,
  },
  clearButton: {
    padding: 8,
  },
});

export default SearchBar;
