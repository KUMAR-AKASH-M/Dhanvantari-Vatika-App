import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Tip {
  title: string;
  content: string;
}

interface DailyTipsProps {
  tips: Tip[];
  onTipPress: (tip: Tip) => void;
  onSeeMorePress: () => void;
  isDarkMode: boolean; // Add isDarkMode prop
}

const DailyTips = ({ tips, onTipPress, onSeeMorePress, isDarkMode }: DailyTipsProps) => {
  return (
    <View style={[styles.tipsSection, isDarkMode && styles.darkSection]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Daily Ayurveda Tips</Text>
        <TouchableOpacity onPress={onSeeMorePress}>
          <Text style={[styles.seeAll, isDarkMode && styles.darkText]}>More Tips</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tips.map((tip, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.tipCard, isDarkMode && styles.darkCard]}
            onPress={() => onTipPress(tip)}
          >
            <View style={styles.tipHeader}>
              <FontAwesome5 name="sun" size={16} color="#ff9800" />
              <Text style={[styles.tipTitle, isDarkMode && styles.darkText]}>{tip.title}</Text>
            </View>
            <Text style={[styles.tipContent, isDarkMode && styles.darkText]}>{tip.content}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tipsSection: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    color: "#3e7d32",
    fontSize: 14,
    fontWeight: "500",
  },
  tipCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipTitle: {
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
    color: '#333',
  },
  tipContent: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  darkSection: {
    backgroundColor: "#121212",
  },
  darkCard: {
    backgroundColor: "#333",
  },
  darkText: {
    color: "#fff",
  },
});

export default DailyTips;