import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
          <Text style={[styles.seeAll, isDarkMode && styles.darkText]}>See All</Text>
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
            style={[styles.categoryItem, isDarkMode && styles.darkCard]}
            onPress={() => onCategoryPress(category)}
          >
            <View style={styles.categoryImageContainer}>
              <Image source={category.image} style={styles.categoryImage} />
              <View style={styles.categoryIconOverlay}>
                <Ionicons name={category.icon} size={24} color="#fff" />
              </View>
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
    color: "#fff",
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
    backgroundColor: 'rgba(62,125,50,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 13,
    textAlign: "center",
    fontWeight: '500',
  },
  darkSection: {
    backgroundColor: "#121212",
  },
  darkCard: {
    backgroundColor: "#333",
  },
});

export default CategorySection;