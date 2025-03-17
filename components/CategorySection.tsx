import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Category {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  image: any;
}

interface CategorySectionProps {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
  onSeeAllPress: () => void;
  isDarkMode: boolean; // Add theme prop
}

const CategorySection = ({ categories, onCategoryPress, onSeeAllPress, isDarkMode }: CategorySectionProps) => {
  return (
    <View style={[styles.section, isDarkMode && styles.darkSection]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Categories</Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={[styles.seeAll, isDarkMode && styles.darkPrimaryText]}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
      >
        {categories.map((category, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.categoryItem, isDarkMode && styles.darkCategoryItem]}
            onPress={() => onCategoryPress(category)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.categoryImageContainer, 
              isDarkMode && styles.darkCategoryImageContainer
            ]}>
              <Image source={category.image} style={styles.categoryImage} />
              <LinearGradient
                colors={isDarkMode 
                  ? ['rgba(42,84,52,0.85)', 'rgba(62,125,50,0.9)'] 
                  : ['rgba(62,125,50,0.7)', 'rgba(62,125,50,0.8)']}
                style={styles.categoryIconOverlay}
              >
                <View style={[styles.iconCircle, isDarkMode && styles.darkIconCircle]}>
                  <Ionicons name={category.icon} size={24} color="#fff" />
                </View>
              </LinearGradient>
            </View>
            <Text style={[styles.categoryText, isDarkMode && styles.darkText]}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
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
  darkText: {
    color: "#f0f0f0",
  },
  seeAll: {
    color: "#3e7d32",
    fontSize: 14,
    fontWeight: "500",
  },
  categoriesContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
    width: 80,
  },
  darkCategoryItem: {
    // No additional styles needed
  },
  categoryImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginBottom: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  darkCategoryImageContainer: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  darkIconCircle: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  categoryText: {
    fontSize: 13,
    textAlign: "center",
    fontWeight: '500',
    marginTop: 4,
    color: "#333",
  },
  darkSection: {
    backgroundColor: "#121212",
  },
  darkPrimaryText: {
    color: "#8bc34a",
  },
});

export default CategorySection;