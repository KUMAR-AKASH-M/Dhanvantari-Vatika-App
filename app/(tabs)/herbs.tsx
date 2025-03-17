import React, { useState, useEffect } from "react";
import { 
  View, 
  StyleSheet, 
  FlatList,
  Animated,
  Dimensions
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from 'expo-router';
import { useTheme } from "../../context/ThemeContext";
import { useSavedHerbs } from "../../context/HerbContext";

import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import HerbDetailModal from "../../components/HerbDetailModal";
import { 
  HerbScreenTitle,
  CategoriesList,
  HerbCard,
  LoadingIndicator,
  EmptyResults
} from "../../components/herbs";

const { width } = Dimensions.get("window");

// Enhanced data for herbs with additional fields
const HERBS_DATA = [
  {
    id: '1',
    name: 'Tulsi (Holy Basil)',
    scientificName: 'Ocimum sanctum',
    image: { uri: 'https://nurserylive.com/cdn/shop/products/nurserylive-seeds-krishna-tulsi-tulsi-black-0-5-kg-seeds-112929_600x600.png?v=1679750449' },
    benefits: [
      'Boosts immunity and fights infections',
      'Reduces stress and anxiety',
      'Helps with respiratory disorders',
      'Rich in antioxidants'
    ],
    howToUse: [
      'Make tulsi tea by steeping fresh or dried leaves in hot water for 5-7 minutes',
      'Add fresh tulsi leaves to salads or sandwiches',
      'Mix dried tulsi powder with honey for immunity boost',
      'Chew 5-6 fresh tulsi leaves daily on an empty stomach'
    ],
    growingTips: [
      'Plant in well-drained soil with plenty of sunlight',
      'Water regularly but avoid overwatering',
      'Pinch off flower buds to encourage leaf growth',
      'Protect from frost as tulsi is sensitive to cold'
    ],
    description: 'A sacred plant in Ayurveda known for its healing properties and religious significance.',
    rating: 4.8,
    reviews: 127,
    categories: ['immune', 'stress'],
    featured: true,
    classification: 'Adaptogenic, Nervine',
    origin: 'India'
  },
  {
    id: '2',
    name: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    image: { uri: 'https://m.media-amazon.com/images/I/41U1Uz5Q9HL.jpg' },
    benefits: ['Reduces stress & anxiety', 'Improves energy', 'Enhances concentration'],
    description: 'An adaptogenic herb that helps the body manage stress and promotes overall wellbeing.',
    rating: 4.7,
    reviews: 98,
    categories: ['stress', 'brain'],
    featured: true,
    classification: 'Adaptogenic, Tonic',
    origin: 'India, North Africa'
  },
  {
    id: '3',
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    image: { uri: 'https://dwibhashi.co.in/cdn/shop/articles/neem-oil_b9b833ce-e7e6-45c1-9d79-385ffc6da7e9.jpg?v=1738676177' },
    benefits: ['Blood purifier', 'Skin disorders', 'Anti-bacterial'],
    description: 'Known for its bitter taste and incredible medicinal properties, especially for skin and blood.',
    price: "₹199",
    rating: 4.5,
    reviews: 75,
    categories: ['skin', 'immune'],
    featured: false,
    stock: 30
  },
  {
    id: '4',
    name: 'Amla (Indian Gooseberry)',
    scientificName: 'Phyllanthus emblica',
    image: { uri: 'https://m.media-amazon.com/images/I/61gRfOuOWxL.jpg' },
    benefits: ['Rich in Vitamin C', 'Improves digestion', 'Hair health'],
    description: 'One of the richest sources of Vitamin C and a powerful rejuvenating herb in Ayurveda.',
    price: "₹179",
    rating: 4.6,
    reviews: 112,
    categories: ['immune', 'digestive'],
    featured: true,
    stock: 40
  },
  {
    id: '5',
    name: 'Brahmi',
    scientificName: 'Bacopa monnieri',
    image: { uri: 'https://m.media-amazon.com/images/I/61iVLkY90SL._SX679_.jpg' },
    benefits: ['Memory enhancement', 'Cognitive function', 'Reduces anxiety'],
    description: 'Traditional brain tonic that enhances memory and cognitive function.',
    price: "₹229",
    rating: 4.4,
    reviews: 65,
    categories: ['brain', 'stress'],
    featured: false,
    stock: 20
  },
  {
    id: '6',
    name: 'Shatavari',
    scientificName: 'Asparagus racemosus',
    image: { uri: 'https://m.media-amazon.com/images/I/71Cn8MkzpwL._SY879_.jpg' },
    benefits: ["Women's health", 'Hormonal balance', 'Digestive aid'],
    description: "Known as the 'Queen of Herbs' in Ayurveda, particularly beneficial for women's health.",
    price: "₹279",
    rating: 4.7,
    reviews: 88,
    categories: ['digestive'],
    featured: false,
    stock: 18
  }
];

// Categories for herbs
const CATEGORIES = [
  { id: '1', name: 'All', icon: 'apps-outline' },
  { id: '2', name: 'Immune', icon: 'shield-outline', filter: 'immune' },
  { id: '3', name: 'Digestive', icon: 'fitness-outline', filter: 'digestive' },
  { id: '4', name: 'Skin', icon: 'color-palette-outline', filter: 'skin' },
  { id: '5', name: 'Stress', icon: 'leaf-outline', filter: 'stress' },
  { id: '6', name: 'Brain', icon: 'brain-outline', filter: 'brain' }
];

export default function HerbsScreen() {
  const { isDarkMode } = useTheme();
  const [activeCategory, setActiveCategory] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHerbs, setFilteredHerbs] = useState(HERBS_DATA);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<{[key: string]: boolean}>({});

  const fadeAnim = useState(new Animated.Value(0))[0];
  const router = useRouter();
  
  // Get herb context functions
  const { addToSavedHerbs, removeFromSavedHerbs, isInSavedHerbs } = useSavedHerbs();

  // Plant modal state (rename variables for consistency but keep function names for now)
  const [herbDetailModalVisible, setHerbDetailModalVisible] = useState(false);
  const [selectedHerb, setSelectedHerb] = useState(null);

  // Initialize favorites from saved herbs
  useEffect(() => {
    const initFavorites = {};
    HERBS_DATA.forEach(herb => {
      initFavorites[herb.id] = isInSavedHerbs(herb.id);
    });
    setFavorites(initFavorites);
  }, []);

  // Apply filtering based on selected category and search
  useEffect(() => {
    setLoading(true);
    
    // Small delay to show loading indicator
    setTimeout(() => {
      let result = HERBS_DATA;
      
      // Filter by category
      if (activeCategory !== '1') { // '1' is 'All'
        const selectedCategory = CATEGORIES.find(cat => cat.id === activeCategory);
        if (selectedCategory?.filter) {
          result = result.filter(herb => 
            herb.categories && herb.categories.includes(selectedCategory.filter)
          );
        }
      }
      
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        result = result.filter(herb => 
          herb.name.toLowerCase().includes(query) || 
          herb.scientificName.toLowerCase().includes(query) || 
          herb.description.toLowerCase().includes(query)
        );
      }
      
      setFilteredHerbs(result);
      setLoading(false);
      
      // Animate the fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    }, 300);
  }, [activeCategory, searchQuery]);
  
  // Herb selection handler
  const handleHerbSelect = (herb) => {
    setSelectedHerb(herb);
    setHerbDetailModalVisible(true);
  };

  // Toggle favorite status and update herb context
  const toggleFavorite = (herbId) => {
    const herb = HERBS_DATA.find(h => h.id === herbId);
    if (!herb) return;
    
    const newFavoriteStatus = !favorites[herbId];
    
    setFavorites(prev => ({
      ...prev,
      [herbId]: newFavoriteStatus
    }));
    
    if (newFavoriteStatus) {
      addToSavedHerbs(herb);
    } else {
      removeFromSavedHerbs(herbId);
    }
  };

  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('1');
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <Header />
      
      <View style={styles.contentContainer}>
        {/* Search Bar */}
        <SearchBar 
          isDarkMode={isDarkMode} 
          onChangeText={handleSearch}
          value={searchQuery}
        />
        
        {/* Title Section */}
        <HerbScreenTitle isDarkMode={isDarkMode} />
        
        {/* Categories */}
        <CategoriesList 
          categories={CATEGORIES}
          activeCategory={activeCategory}
          isDarkMode={isDarkMode}
          onSelectCategory={handleCategorySelect}
        />
        
        {/* Loading, Empty results or Herb list */}
        {loading ? (
          <LoadingIndicator isDarkMode={isDarkMode} />
        ) : filteredHerbs.length === 0 ? (
          <EmptyResults isDarkMode={isDarkMode} onReset={resetFilters} />
        ) : (
          <FlatList
            data={filteredHerbs}
            renderItem={({ item }) => (
              <HerbCard
                herb={item}
                isDarkMode={isDarkMode}
                isFavorite={!!favorites[item.id]}
                onPress={handleHerbSelect}
                onToggleFavorite={toggleFavorite}
                fadeAnim={fadeAnim}
              />
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.herbsList}
          />
        )}
      </View>
      
      {/* Herb Detail Modal */}
      <HerbDetailModal
        visible={herbDetailModalVisible}
        herb={selectedHerb}
        onClose={() => setHerbDetailModalVisible(false)}
        isDarkMode={isDarkMode}
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
  contentContainer: {
    flex: 1,
    paddingTop: 100, // Space for header
    paddingBottom: 70, // Space for bottom nav
  },
  herbsList: {
    padding: 16,
    paddingTop: 0,
  },
});