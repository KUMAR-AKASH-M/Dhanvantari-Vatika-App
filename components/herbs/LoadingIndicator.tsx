import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

type LoadingIndicatorProps = {
  isDarkMode: boolean;
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isDarkMode }) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={isDarkMode ? "#8bc34a" : "#3e7d32"} />
      <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>Loading herbs...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  darkText: {
    color: '#f0f0f0',
  },
});

export default LoadingIndicator;
