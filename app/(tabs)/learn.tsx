import React, { useState } from "react";
import { 
  Text, 
  View, 
  ScrollView, 
  StyleSheet, 
  FlatList,
  Dimensions
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../context/ThemeContext";

import Header from "../../components/Header";
import ArticleCard, { ArticleType } from "../../components/learn/ArticleCard";
import RecipeCard, { RecipeType } from "../../components/learn/RecipeCard";
import SectionHeader from "../../components/learn/SectionHeader";
import ArticleDetailModal from "../../components/learn/ArticleDetailModal";
import RecipeDetailModal from "../../components/learn/RecipeDetailModal";
import ArticlesAllModal from "../../components/learn/ArticlesAllModal";
import RemediesAllModal from "../../components/learn/RemediesAllModal";

const { width } = Dimensions.get("window");

// Articles data
const ARTICLES: ArticleType[] = [
  {
    id: '1',
    title: 'Understanding Your Dosha Type',
    author: 'Dr. Priya Sharma',
    image: { uri: 'https://astroera.in/public/cms-images/blogs/1705569344_Understand-What-is-Dosha-in-Hinduism.jpg' },
    readTime: '5 min read',
    publishedDate: '2 days ago'
  },
  {
    id: '2',
    title: 'The Power of Triphala in Daily Life',
    author: 'Rahul Mishra',
    image: { uri: 'https://images-prod.healthline.com/hlcmsresource/images/AN_images/triphala-ayurvedic-fruits-1296x728.jpg' },
    readTime: '7 min read',
    publishedDate: '1 week ago'
  },
  {
    id: '3',
    title: 'Ayurvedic Diet Principles for Modern Life',
    author: 'Dr. Arjun Gupta',
    image: { uri: 'https://www.ayurvedainstitute.co.uk/wp-content/uploads/2023/09/the-ayurvedic-approach-to-a-vegetarian-diet.jpg' },
    readTime: '10 min read',
    publishedDate: '3 weeks ago'
  }
];

// Recipe data for home remedies
const RECIPES: RecipeType[] = [
  {
    id: '1',
    title: 'Immunity Boosting Kadha',
    image: { uri: 'https://www.bitensip.com/wp-content/uploads/2023/01/kadha.jpg' },
    ingredients: ['Tulsi leaves', 'Ginger', 'Black pepper', 'Cinnamon', 'Honey'],
    prepTime: '10 min'
  },
  {
    id: '2',
    title: 'Golden Milk for Sleep',
    image: { uri: 'https://awcim.arizona.edu/file/?id=112567' },
    ingredients: ['Milk', 'Turmeric', 'Black pepper', 'Cinnamon', 'Cardamom'],
    prepTime: '5 min'
  }
];

export default function LearnScreen() {
  const { isDarkMode } = useTheme();
  const [articlesAllModalVisible, setArticlesAllModalVisible] = useState(false);
  const [recipesAllModalVisible, setRecipesAllModalVisible] = useState(false);
  
  // States for detail modals
  const [articleDetailVisible, setArticleDetailVisible] = useState(false);
  const [recipeDetailVisible, setRecipeDetailVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleType | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number>(0);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number>(0);
  
  // Open articles modal
  const openArticlesModal = () => {
    setArticlesAllModalVisible(true);
  };

  // Open recipes modal
  const openRecipesModal = () => {
    setRecipesAllModalVisible(true);
  };
  
  // Open article detail modal with index tracking
  const openArticleDetail = (article: ArticleType) => {
    const index = ARTICLES.findIndex(item => item.id === article.id);
    setSelectedArticleIndex(index);
    setSelectedArticle(article);
    setArticleDetailVisible(true);
  };
  
  // Open recipe detail modal with index tracking
  const openRecipeDetail = (recipe: RecipeType) => {
    const index = RECIPES.findIndex(item => item.id === recipe.id);
    setSelectedRecipeIndex(index);
    setSelectedRecipe(recipe);
    setRecipeDetailVisible(true);
  };

  // Navigation handlers for articles
  const goToNextArticle = () => {
    if (selectedArticleIndex < ARTICLES.length - 1) {
      const nextIndex = selectedArticleIndex + 1;
      setSelectedArticleIndex(nextIndex);
      setSelectedArticle(ARTICLES[nextIndex]);
    }
  };
  
  const goToPreviousArticle = () => {
    if (selectedArticleIndex > 0) {
      const prevIndex = selectedArticleIndex - 1;
      setSelectedArticleIndex(prevIndex);
      setSelectedArticle(ARTICLES[prevIndex]);
    }
  };
  
  // Navigation handlers for recipes
  const goToNextRecipe = () => {
    if (selectedRecipeIndex < RECIPES.length - 1) {
      const nextIndex = selectedRecipeIndex + 1;
      setSelectedRecipeIndex(nextIndex);
      setSelectedRecipe(RECIPES[nextIndex]);
    }
  };
  
  const goToPreviousRecipe = () => {
    if (selectedRecipeIndex > 0) {
      const prevIndex = selectedRecipeIndex - 1;
      setSelectedRecipeIndex(prevIndex);
      setSelectedRecipe(RECIPES[prevIndex]);
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <Header />
      
      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.titleSection}>
          <Text style={[styles.screenTitle, isDarkMode && styles.darkText]}>
            Learn & Grow
          </Text>
          <Text style={[styles.screenSubtitle, isDarkMode && styles.darkMutedText]}>
            Explore Ayurvedic wisdom for holistic wellness
          </Text>
        </View>

        {/* Articles Section */}
        <View style={styles.section}>
          <SectionHeader 
            title="Articles" 
            onViewAll={openArticlesModal} 
            isDarkMode={isDarkMode} 
          />

          {ARTICLES.map(article => (
            <ArticleCard 
              key={article.id}
              article={article} 
              isDarkMode={isDarkMode}
              onPress={() => openArticleDetail(article)}
            />
          ))}
        </View>

        {/* Recipes Section */}
        <View style={styles.section}>
          <SectionHeader 
            title="Home Remedies" 
            onViewAll={openRecipesModal} 
            isDarkMode={isDarkMode} 
          />

          <FlatList
            data={RECIPES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <RecipeCard 
                recipe={item} 
                isDarkMode={isDarkMode}
                onPress={() => openRecipeDetail(item)}
              />
            )}
            contentContainerStyle={styles.recipesList}
          />
        </View>
      </ScrollView>

      {/* Articles All Modal */}
      <ArticlesAllModal
        visible={articlesAllModalVisible}
        articles={ARTICLES}
        onClose={() => setArticlesAllModalVisible(false)}
        onArticlePress={openArticleDetail}
        isDarkMode={isDarkMode}
      />
      
      {/* Recipes All Modal - Updated to use new RemediesAllModal */}
      <RemediesAllModal
        visible={recipesAllModalVisible}
        recipes={RECIPES}
        onClose={() => setRecipesAllModalVisible(false)}
        onRecipePress={openRecipeDetail}
        isDarkMode={isDarkMode}
      />
      
      {/* Individual Article Detail Modal */}
      <ArticleDetailModal
        visible={articleDetailVisible}
        onClose={() => setArticleDetailVisible(false)}
        article={selectedArticle}
        isDarkMode={isDarkMode}
        onNext={goToNextArticle}
        onPrevious={goToPreviousArticle}
        hasNext={selectedArticleIndex < ARTICLES.length - 1}
        hasPrevious={selectedArticleIndex > 0}
      />
      
      {/* Individual Recipe Detail Modal */}
      <RecipeDetailModal
        visible={recipeDetailVisible}
        onClose={() => setRecipeDetailVisible(false)}
        recipe={selectedRecipe}
        isDarkMode={isDarkMode}
        onNext={goToNextRecipe}
        onPrevious={goToPreviousRecipe}
        hasNext={selectedRecipeIndex < RECIPES.length - 1}
        hasPrevious={selectedRecipeIndex > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingTop: 100, // Space for header
    paddingBottom: 80, // Space for bottom nav
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
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
  section: {
    marginBottom: 24,
  },
  recipesList: {
    paddingLeft: 20,
    paddingRight: 5,
  },
});