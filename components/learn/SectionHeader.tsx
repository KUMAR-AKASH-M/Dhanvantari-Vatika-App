import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SectionHeaderProps {
  title: string;
  onViewAll: () => void;
  isDarkMode: boolean;
}

const SectionHeader = ({ title, onViewAll, isDarkMode }: SectionHeaderProps) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
        {title}
      </Text>
      <TouchableOpacity onPress={onViewAll}>
        <Text style={[styles.viewAllText, isDarkMode && styles.darkViewAllText]}>
          View All
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3e7d32',
    fontWeight: '500',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkViewAllText: {
    color: '#6baf5e',
  },
});

export default SectionHeader;
