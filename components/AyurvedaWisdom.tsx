import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

interface AyurvedaWisdomProps {
  quote: string;
  author: string;
  isDarkMode: boolean; // Add theme prop
}

const AyurvedaWisdom = ({ quote, author, isDarkMode }: AyurvedaWisdomProps) => {
  return (
    <LinearGradient 
      colors={isDarkMode ? ['#333', '#444'] : ['#e8f5e9', '#c8e6c9']} 
      style={styles.wisdomSection}
    >
      <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Ayurveda Wisdom</Text>
      <View style={[styles.wisdomCard, isDarkMode && styles.darkCard]}>
        <FontAwesome5 name="quote-left" size={20} color="#3e7d32" style={styles.quoteIcon} />
        <Text style={[styles.wisdomQuote, isDarkMode && styles.darkText]}>{quote}</Text>
        <Text style={[styles.wisdomAuthor, isDarkMode && styles.darkText]}>{author}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wisdomSection: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  darkText: {
    color: "#fff",
  },
  wisdomCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#3e7d32",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  darkCard: {
    backgroundColor: "#444",
  },
  quoteIcon: {
    marginBottom: 10,
  },
  wisdomQuote: {
    fontStyle: "italic",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
    color: "#555",
  },
  wisdomAuthor: {
    textAlign: "right",
    fontWeight: "500",
    color: "#3e7d32",
    fontSize: 14,
  },
});

export default AyurvedaWisdom;