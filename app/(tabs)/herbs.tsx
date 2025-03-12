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
import SearchBar from "../../components/SearchBar";

const { width } = Dimensions.get("window");

// Sample data for herbs
const HERBS_DATA = [
  {
    id: '1',
    name: 'Tulsi (Holy Basil)',
    scientificName: 'Ocimum sanctum',
    image: { uri: 'https://nurserylive.com/cdn/shop/products/nurserylive-seeds-krishna-tulsi-tulsi-black-0-5-kg-seeds-112929_600x600.png?v=1679750449' },
    benefits: ['Respiratory disorders', 'Stress relief', 'Immunity booster'],
    description: 'A sacred plant in Ayurveda known for its healing properties and religious significance.'
  },
  {
    id: '2',
    name: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    image: { uri: 'https://m.media-amazon.com/images/I/41U1Uz5Q9HL.jpg' },
    benefits: ['Reduces stress & anxiety', 'Improves energy', 'Enhances concentration'],
    description: 'An adaptogenic herb that helps the body manage stress and promotes overall wellbeing.'
  },
  {
    id: '3',
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    image: { uri: 'https://dwibhashi.co.in/cdn/shop/articles/neem-oil_b9b833ce-e7e6-45c1-9d79-385ffc6da7e9.jpg?v=1738676177' },
    benefits: ['Blood purifier', 'Skin disorders', 'Anti-bacterial'],
    description: 'Known for its bitter taste and incredible medicinal properties, especially for skin and blood.'
  },
  {
    id: '4',
    name: 'Amla (Indian Gooseberry)',
    scientificName: 'Phyllanthus emblica',
    image: { uri: 'https://m.media-amazon.com/images/I/61gRfOuOWxL.jpg' },
    benefits: ['Rich in Vitamin C', 'Improves digestion', 'Hair health'],
    description: 'One of the richest sources of Vitamin C and a powerful rejuvenating herb in Ayurveda.'
  },
  {
    id: '5',
    name: 'Brahmi',
    scientificName: 'Bacopa monnieri',
    image: { uri: 'https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FPlants%2F2023-04%2FBrahmi-GettyImages-1458690762' },
    benefits: ['Memory enhancement', 'Cognitive function', 'Reduces anxiety'],
    description: 'Traditional brain tonic that enhances memory and cognitive function.'
  },
  {
    id: '6',
    name: 'Shatavari',
    scientificName: 'Asparagus racemosus',
    image: { uri: 'https://nutrijaorganics.com/wp-content/uploads/2023/01/shatavari-powder.webp' },
    benefits: ["Women's health", 'Hormonal balance', 'Digestive aid'],
    description: "Known as the 'Queen of Herbs' in Ayurveda, particularly beneficial for women's health."
  }
];

// Categories for herbs
const CATEGORIES = [
  { id: '1', name: 'All', icon: 'apps-outline' },
  { id: '2', name: 'Immune', icon: 'shield-outline' },
  { id: '3', name: 'Digestive', icon: 'fitness-outline' },
  { id: '4', name: 'Skin', icon: 'color-palette-outline' },
  { id: '5', name: 'Stress', icon: 'leaf-outline' },
  { id: '6', name: 'Brain', icon: 'brain-outline' }
];

export default function HerbsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('1');

  // Theme change handler
  const handleThemeChange = (isDark: boolean) => {
    setIsDarkMode(isDark);
    console.log("Theme changed to:", isDark ? "dark" : "light");
  };

  // Render herb card
  const renderHerbCard = ({ item }) => (
    <TouchableOpacity 
      style={[styles.herbCard, isDarkMode && styles.darkHerbCard]}
      activeOpacity={0.9}
    >
      <Image source={item.image} style={styles.herbImage} />
      <View style={styles.herbContent}>
        <Text style={[styles.herbName, isDarkMode && styles.darkText]}>{item.name}</Text>
        <Text style={[styles.scientificName, isDarkMode && styles.darkMutedText]}>{item.scientificName}</Text>
        <View style={styles.benefitsContainer}>
          {item.benefits.slice(0, 2).map((benefit, index) => (
            <View key={index} style={styles.benefitTag}>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
          {item.benefits.length > 2 && (
            <View style={styles.benefitTag}>
              <Text style={styles.benefitText}>+{item.benefits.length - 2}</Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={24} 
        color={isDarkMode ? "#aaa" : "#888"} 
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <Header 
        isDarkMode={isDarkMode}
        onThemeChange={handleThemeChange}
      />
      
      <View style={styles.contentContainer}>
        <SearchBar isDarkMode={isDarkMode} />
        
        <View style={styles.titleSection}>
          <Text style={[styles.screenTitle, isDarkMode && styles.darkText]}>
            Medicinal Herbs
          </Text>
          <Text style={[styles.screenSubtitle, isDarkMode && styles.darkMutedText]}>
            Discover nature's healing treasures
          </Text>
        </View>
        
        <View style={styles.categoriesContainer}>
          <FlatList
            data={CATEGORIES}
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
                onPress={() => setActiveCategory(item.id)}
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
        
        <FlatList
          data={HERBS_DATA}
          renderItem={renderHerbCard}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.herbsList}
        />
      </View>
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
  contentContainer: {
    flex: 1,
    paddingTop: 100, // Space for header
    paddingBottom: 70, // Space for bottom nav
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 10,
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
  herbsList: {
    padding: 16,
    paddingTop: 0,
  },
  herbCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkHerbCard: {
    backgroundColor: '#2a2a2a',
  },
  herbImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  herbContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  herbName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scientificName: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888',
    marginTop: 2,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  benefitTag: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  benefitText: {
    color: '#3e7d32',
    fontSize: 10,
    fontWeight: '500',
  },
  arrowIcon: {
    alignSelf: 'center',
  }
});