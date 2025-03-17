import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

type Category = {
  id: string;
  name: string;
  icon: string;
  filter?: string;
};

type CategoriesListProps = {
  categories: Category[];
  activeCategory: string;
  isDarkMode: boolean;
  onSelectCategory: (categoryId: string) => void;
};

const CategoriesList: React.FC<CategoriesListProps> = ({ 
  categories, 
  activeCategory, 
  isDarkMode, 
  onSelectCategory 
}) => {
  return (
    <View style={styles.categoriesContainer}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.categoryButton,
              activeCategory === item.id && styles.activeCategoryButton,
              isDarkMode && styles.darkCategoryButton,
              activeCategory === item.id && isDarkMode && styles.darkActiveCategoryButton
            ]}
            onPress={() => onSelectCategory(item.id)}
          >
            <Ionicons 
              name={item.icon} 
              size={18} 
              color={
                activeCategory === item.id 
                  ? "#fff" 
                  : (isDarkMode ? "#bbb" : "#666")
              } 
            />
            <Text 
              style={[
                styles.categoryText,
                activeCategory === item.id && styles.activeCategoryText,
                isDarkMode && styles.darkCategoryText,
                activeCategory === item.id && styles.activeCategoryText
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  activeCategoryButton: {
    backgroundColor: '#3e7d32',
  },
  darkCategoryButton: {
    backgroundColor: '#333',
  },
  darkActiveCategoryButton: {
    backgroundColor: '#4a8c3f',
  },
  categoryText: {
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
  },
  darkCategoryText: {
    color: '#bbb',
  },
});

export default CategoriesList;
