import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

type EmptyResultsProps = {
  isDarkMode: boolean;
  onReset: () => void;
};

const EmptyResults: React.FC<EmptyResultsProps> = ({ isDarkMode, onReset }) => {
  return (
    <View style={styles.emptyResultsContainer}>
      <Ionicons name="leaf-outline" size={60} color={isDarkMode ? "#555" : "#ccc"} />
      <Text style={[styles.emptyResultsTitle, isDarkMode && styles.darkText]}>No herbs found</Text>
      <Text style={[styles.emptyResultsSubtitle, isDarkMode && styles.darkMutedText]}>
        Try a different search or category
      </Text>
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={onReset}
      >
        <Text style={styles.resetButtonText}>Reset Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyResultsSubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#3e7d32',
    borderRadius: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
});

export default EmptyResults;
