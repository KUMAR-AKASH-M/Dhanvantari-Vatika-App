import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type RecipeType = {
  id: string;
  title: string;
  image: { uri: string };
  ingredients: string[];
  prepTime: string;
};

interface RecipeCardProps {
  recipe: RecipeType;
  isDarkMode: boolean;
  isModal?: boolean;
  onPress?: () => void;
}

const RecipeCard = ({ recipe, isDarkMode, isModal = false, onPress }: RecipeCardProps) => {
  return (
    <TouchableOpacity 
      style={[
        styles.recipeCard, 
        isDarkMode && styles.darkCard,
        isModal && styles.modalRecipeCard
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image 
        source={recipe.image} 
        style={isModal ? styles.modalRecipeImage : styles.recipeImage} 
      />
      <View style={styles.recipeContent}>
        <Text style={[styles.recipeTitle, isDarkMode && styles.darkText]}>
          {recipe.title}
        </Text>
        <View style={styles.recipeMetaContainer}>
          <View style={styles.recipeMeta}>
            <Ionicons name="time-outline" size={14} color={isDarkMode ? "#bbb" : "#666"} />
            <Text style={[styles.recipeMetaText, isDarkMode && styles.darkMutedText]}>
              {recipe.prepTime}
            </Text>
          </View>
        </View>
        <View style={styles.ingredientsContainer}>
          <Text style={[styles.ingredientsTitle, isDarkMode && styles.darkText]}>
            Ingredients:
          </Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={styles.bulletPoint} />
              <Text style={[styles.ingredientText, isDarkMode && styles.darkMutedText]}>
                {ingredient}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: width * 0.7,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  darkCard: {
    backgroundColor: '#2a2a2a',
  },
  recipeImage: {
    height: 120,
    width: '100%',
    resizeMode: 'cover',
  },
  recipeContent: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeMetaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  ingredientsContainer: {
    marginTop: 4,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  bulletPoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3e7d32',
    marginRight: 6,
  },
  ingredientText: {
    fontSize: 12,
    color: '#666',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
  modalRecipeCard: {
    width: '100%',
    marginRight: 0,
    marginBottom: 15,
    flexDirection: 'row',
  },
  modalRecipeImage: {
    width: 120,
    height: '100%',
    resizeMode: 'cover',
  }
});

export default RecipeCard;
export type { RecipeType };
