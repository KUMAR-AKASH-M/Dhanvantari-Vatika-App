import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type HerbScreenTitleProps = {
  isDarkMode: boolean;
};

const HerbScreenTitle: React.FC<HerbScreenTitleProps> = ({ isDarkMode }) => {
  return (
    <View style={styles.titleSection}>
      <Text style={[styles.screenTitle, isDarkMode && styles.darkText]}>
        Medicinal Herbs
      </Text>
      <Text style={[styles.screenSubtitle, isDarkMode && styles.darkMutedText]}>
        Discover nature's healing treasures
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
});

export default HerbScreenTitle;
