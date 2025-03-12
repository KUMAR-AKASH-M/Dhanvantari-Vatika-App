import React, { useState } from "react";
import { 
  Text, 
  View, 
  ScrollView, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  FlatList,
  Dimensions
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import Header from "../../components/Header";

const { width } = Dimensions.get("window");

// Sample courses data
const COURSES = [
  {
    id: '1',
    title: 'Introduction to Ayurveda',
    instructor: 'Dr. Rajesh Verma',
    image: { uri: 'https://nationaleczema.org/wp-content/uploads/2020/05/shutterstock_661873999.jpg' },
    duration: '3 weeks',
    level: 'Beginner',
    lessons: 12,
    progress: 0.3
  },
  {
    id: '2',
    title: 'Ayurvedic Herbs Masterclass',
    instructor: 'Dr. Meena Sharma',
    image: { uri: 'https://www.healthifyme.com/blog/wp-content/uploads/2023/02/feature-image-1-1.jpg' },
    duration: '5 weeks',
    level: 'Intermediate',
    lessons: 20,
    progress: 0
  },
  {
    id: '3',
    title: 'Daily Ayurvedic Rituals',
    instructor: 'Anjali Patel',
    image: { uri: 'https://www.shutterstock.com/image-photo/ayurvedic-face-pack-sandalwood-powder-260nw-2164876735.jpg' },
    duration: '2 weeks',
    level: 'Beginner',
    lessons: 8,
    progress: 0.7
  }
];

// Articles data
const ARTICLES = [
  {
    id: '1',
    title: 'Understanding Your Dosha Type',
    author: 'Dr. Priya Sharma',
    image: { uri: 'https://www.ayurvedaguru.net/wp-content/uploads/2023/10/Ayurvedic-Dosha-Types.jpg' },
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
    image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbnZ2x56R92vw0_JfFDXMCbXKhfaSSAHKdEeQvM2vAMW7xph4EaYAHjNF3eneVBXXxR1c&usqp=CAU' },
    readTime: '10 min read',
    publishedDate: '3 weeks ago'
  }
];

// Recipe data for home remedies
const RECIPES = [
  {
    id: '1',
    title: 'Immunity Boosting Kadha',
    image: { uri: 'https://static.toiimg.com/photo/msid-75662720/75662720.jpg' },
    ingredients: ['Tulsi leaves', 'Ginger', 'Black pepper', 'Cinnamon', 'Honey'],
    prepTime: '10 min'
  },
  {
    id: '2',
    title: 'Golden Milk for Sleep',
    image: { uri: 'https://www.acouplecooks.com/wp-content/uploads/2021/02/Golden-Milk-004.jpg' },
    ingredients: ['Milk', 'Turmeric', 'Black pepper', 'Cinnamon', 'Cardamom'],
    prepTime: '5 min'
  }
];

export default function LearnScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme change handler
  const handleThemeChange = (isDark: boolean) => {
    setIsDarkMode(isDark);
    console.log("Theme changed to:", isDark ? "dark" : "light");
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <Header 
        isDarkMode={isDarkMode}
        onThemeChange={handleThemeChange}
      />
      
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

        {/* Courses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Courses</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={COURSES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.courseCard, isDarkMode && styles.darkCard]}
                activeOpacity={0.8}
              >
                <Image source={item.image} style={styles.courseImage} />
                <View style={styles.courseBadge}>
                  <Text style={styles.courseBadgeText}>{item.level}</Text>
                </View>
                <View style={styles.courseContent}>
                  <Text style={[styles.courseTitle, isDarkMode && styles.darkText]} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={[styles.courseInstructor, isDarkMode && styles.darkMutedText]}>
                    {item.instructor}
                  </Text>
                  
                  <View style={styles.courseMetaContainer}>
                    <View style={styles.courseMeta}>
                      <Ionicons name="time-outline" size={14} color={isDarkMode ? "#bbb" : "#666"} />
                      <Text style={[styles.courseMetaText, isDarkMode && styles.darkMutedText]}>
                        {item.duration}
                      </Text>
                    </View>
                    <View style={styles.courseMeta}>
                      <Ionicons name="book-outline" size={14} color={isDarkMode ? "#bbb" : "#666"} />
                      <Text style={[styles.courseMetaText, isDarkMode && styles.darkMutedText]}>
                        {item.lessons} lessons
                      </Text>
                    </View>
                  </View>
                  
                  {item.progress > 0 && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${item.progress * 100}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {Math.round(item.progress * 100)}%
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.coursesList}
          />
        </View>

        {/* Articles Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Articles</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {ARTICLES.map(article => (
            <TouchableOpacity 
              key={article.id}
              style={[styles.articleCard, isDarkMode && styles.darkCard]}
            >
              <Image source={article.image} style={styles.articleImage} />
              <View style={styles.articleContent}>
                <Text style={[styles.articleTitle, isDarkMode && styles.darkText]} numberOfLines={2}>
                  {article.title}
                </Text>
                <Text style={[styles.articleAuthor, isDarkMode && styles.darkMutedText]}>
                  {article.author}
                </Text>
                <View style={styles.articleMeta}>
                  <Text style={[styles.articleMetaText, isDarkMode && styles.darkMutedText]}>
                    {article.readTime}
                  </Text>
                  <Text style={[styles.articleMetaText, isDarkMode && styles.darkMutedText]}>
                    • {article.publishedDate}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recipes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Home Remedies</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={RECIPES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.recipeCard, isDarkMode && styles.darkCard]}
                activeOpacity={0.8}
              >
                <Image source={item.image} style={styles.recipeImage} />
                <View style={styles.recipeContent}>
                  <Text style={[styles.recipeTitle, isDarkMode && styles.darkText]}>
                    {item.title}
                  </Text>
                  <View style={styles.recipeMetaContainer}>
                    <View style={styles.recipeMeta}>
                      <Ionicons name="time-outline" size={14} color={isDarkMode ? "#bbb" : "#666"} />
                      <Text style={[styles.recipeMetaText, isDarkMode && styles.darkMutedText]}>
                        {item.prepTime}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.ingredientsContainer}>
                    <Text style={[styles.ingredientsTitle, isDarkMode && styles.darkText]}>
                      Ingredients:
                    </Text>
                    {item.ingredients.map((ingredient, index) => (
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
            )}
            contentContainerStyle={styles.recipesList}
          />
        </View>
      </ScrollView>
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
  coursesList: {
    paddingLeft: 20,
    paddingRight: 5,
  },
  courseCard: {
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
  courseImage: {
    height: 120,
    width: '100%',
    resizeMode: 'cover',
  },
  courseBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(62, 125, 50, 0.85)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  courseBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  courseContent: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  courseMetaContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  courseMetaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3e7d32',
  },
  progressText: {
    fontSize: 10,
    color: '#3e7d32',
    fontWeight: '600',
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  articleImage: {
    width: 100,
    height: '100%',
    resizeMode: 'cover',
  },
  articleContent: {
    flex: 1,
    padding: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  articleAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleMetaText: {
    fontSize: 12,
    color: '#888',
    marginRight: 4,
  },
  recipesList: {
    paddingLeft: 20,
    paddingRight: 5,
  },
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
  }
});