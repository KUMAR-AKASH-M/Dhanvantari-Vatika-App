import React, { useState, useEffect } from "react";
import { 
  View, 
  StyleSheet, 
  Dimensions,
  Animated,
  Linking,
  Alert,
  Platform,
  ToastAndroid
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../context/ThemeContext";
import { useWishlist } from "../../context/WishlistContext";

import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import HeroBanner from "../../components/HeroBanner";
import CategorySection from "../../components/CategorySection";
import FeaturedProducts from "../../components/FeaturedProducts";
import HealingPlants from "../../components/HealingPlants";
import DailyTips from "../../components/DailyTips";
import AyurvedaWisdom from "../../components/AyurvedaWisdom";
import Footer from "../../components/Footer";
import BottomNavigation from "../../components/BottomNavigation";
import CategoryModal from "../../components/CategoryModal";
import CategoriesAllModal from "../../components/CategoriesAllModal";
import ProductModal from "../../components/ProductModal";
import ProductsAllModal from "../../components/ProductsAllModal";
import CartModal from "../../components/CartModal";
import HerbDetailModal from "../../components/HerbDetailModal";
import HerbsAllModal from "../../components/HerbsAllModal";
import SearchResultsCard, { SearchResultItem } from "../../components/SearchResultsCard";

const { width } = Dimensions.get("window");

// Static image imports
const IMAGES = {
  banner: { uri: 'https://api.wellnessmahotsav.com/public/img/blog/blog-1715321363323.jpeg' },
  herbs: {
    tulsi: { uri: 'https://nurserylive.com/cdn/shop/products/nurserylive-seeds-krishna-tulsi-tulsi-black-0-5-kg-seeds-112929_600x600.png?v=1679750449' },
    ashwagandha: { uri: 'https://m.media-amazon.com/images/I/41U1Uz5Q9HL.jpg' },
    neem: { uri: 'https://dwibhashi.co.in/cdn/shop/articles/neem-oil_b9b833ce-e7e6-45c1-9d79-385ffc6da7e9.jpg?v=1738676177' },
    amla: { uri: 'https://m.media-amazon.com/images/I/61gRfOuOWxL.jpg' },
  },
  products: {
    product1: { uri: 'https://m.media-amazon.com/images/I/41U1Uz5Q9HL.jpg' },
    product2: { uri: 'https://images-prod.healthline.com/hlcmsresource/images/AN_images/triphala-ayurvedic-fruits-1296x728.jpg' },
    product3: { uri: 'https://nurserylive.com/cdn/shop/products/nurserylive-seeds-krishna-tulsi-tulsi-black-0-5-kg-seeds-112929_600x600.png?v=1679750449' },
    product4: { uri: 'https://dwibhashi.co.in/cdn/shop/articles/neem-oil_b9b833ce-e7e6-45c1-9d79-385ffc6da7e9.jpg?v=1738676177' },
  },
  categories: {
    ayurveda: { uri: 'https://nationaleczema.org/wp-content/uploads/2020/05/shutterstock_661873999.jpg' },
    yoga: { uri: 'https://hips.hearstapps.com/hmg-prod/images/concentrated-peaceful-woman-with-hair-bun-in-tight-royalty-free-image-1672963298.jpg?crop=0.917xw:0.916xh;0.0476xw,0.0383xh&resize=980:*' },
    naturopathy: { uri: 'https://jindalnaturecure.in/wp-content/uploads/2021/03/jni-naturopathy-allopathy.jpg' },
    unani: { uri: 'https://articles-1mg.gumlet.io/articles/wp-content/uploads/2018/03/shutterstock_647691157.jpg?compress=true&quality=80&w=640&dpr=1.3' },
    siddha: { uri: 'https://virutchamclinic.com/wp-content/uploads/2017/06/siddha-870x450.jpg' },
    homoeopathy: { uri: 'https://etimg.etb2bimg.com/photo/101841354.cms' },
  }
};

export default function Index() {
  // Data definitions - MOVED TO THE TOP
  const categories = [
    {name: "Ayurveda", icon: "leaf", image: IMAGES.categories.ayurveda, featured: true},
    {name: "Yoga", icon: "fitness", image: IMAGES.categories.yoga, featured: true},
    {name: "Naturopathy", icon: "leaf-outline", image: IMAGES.categories.naturopathy, featured: false},
    {name: "Unani", icon: "flask", image: IMAGES.categories.unani, featured: false},
    {name: "Siddha", icon: "medkit", image: IMAGES.categories.siddha, featured: true},
    {name: "Homoeopathy", icon: "medkit-outline", image: IMAGES.categories.homoeopathy, featured: false}
  ];

  const productData = [
    {
      name: "Basic Ayurvedic Kit",
      price: "₹599",
      image: IMAGES.products.product1,
      rating: 4.8,
      reviews: 156,
      category: "kits",
      featured: true,
      description: "Start your Ayurvedic garden journey with essential herbs for wellness.",
      kitContents: [
        "Seeds – Tulsi, Ashwagandha, Brahmi, Neem, Aloe Vera",
        "Organic Fertilizer – Cow dung-based manure",
        "Soil Mix – Enriched potting mix for better growth",
        "Biodegradable Pots – Eco-friendly grow bags",
        "Planting Guide – Detailed instructions with QR code"
      ]
    },
    {
      name: "Premium Ayurvedic Kit",
      price: "₹999",
      image: IMAGES.products.product2,
      rating: 4.9,
      reviews: 98,
      category: "kits",
      featured: true,
      description: "Complete Ayurvedic garden experience with advanced features and tools.",
      kitContents: [
        "All Basic Kit Contents",
        "Organic Pesticide – Neem oil spray",
        "Drip Irrigation Kit – Small watering setup",
        "Ayurvedic Recipes – Wellness guide book",
        "Handmade Ayurvedic Soap – Natural skincare",
        "Wooden Gardening Tools – Eco-friendly set"
      ]
    },
    {
      name: "Immunity Herb Kit",
      price: "₹449",
      image: IMAGES.products.product3,
      rating: 4.7,
      reviews: 214,
      category: "specialized",
      featured: true,
      description: "Focused collection of immunity-boosting Ayurvedic herbs.",
      kitContents: [
        "Seeds – Tulsi, Giloy, Amla",
        "Organic Fertilizer – Special blend",
        "Soil Mix – Premium potting mix",
        "Biodegradable Pots – 3 coconut husk planters",
        "Immunity Tea Blend – Sample packet"
      ]
    },
    {
      name: "Skin Care Herb Kit",
      price: "₹499",
      image: IMAGES.products.product4,
      rating: 4.6,
      reviews: 120,
      category: "specialized",
      featured: true,
      description: "Grow herbs traditionally used for natural skin care remedies.",
      kitContents: [
        "Seeds – Neem, Aloe Vera, Calendula",
        "Organic Fertilizer – Skin herb special blend",
        "Soil Mix – Balanced potting mix",
        "Biodegradable Pots – 3 grow bags",
        "DIY Skincare Guide – With recipe cards"
      ]
    }
  ];

  // Define herb data with richer information to match HerbDetailModal requirements
  const herbData = [
    {
      id: '1',
      name: "Tulsi",
      scientificName: "Ocimum sanctum", 
      description: "Reduces stress & anxiety", 
      image: IMAGES.herbs.tulsi, 
      category: "adaptogen",
      benefits: [
        'Boosts immunity',
        'Reduces stress and anxiety',
        'Helps with respiratory disorders'
      ]
    },
    {
      id: '2',
      name: "Ashwagandha",
      scientificName: "Withania somnifera", 
      description: "Boosts immunity & energy", 
      image: IMAGES.herbs.ashwagandha, 
      category: "adaptogen",
      benefits: [
        'Reduces stress & anxiety',
        'Improves energy',
        'Enhances concentration'
      ]
    },
    {
      id: '3',
      name: "Neem",
      scientificName: "Azadirachta indica", 
      description: "Natural antiseptic & detoxifier", 
      image: IMAGES.herbs.neem, 
      category: "skincare",
      benefits: [
        'Blood purifier',
        'Treats skin disorders',
        'Natural antibacterial'
      ]
    },
    {
      id: '4',
      name: "Amla",
      scientificName: "Phyllanthus emblica", 
      description: "Rich in Vitamin C, antioxidant", 
      image: IMAGES.herbs.amla, 
      category: "immune",
      benefits: [
        'Rich in Vitamin C',
        'Improves digestion',
        'Enhances hair health'
      ]
    }
  ];

  // For scroll animation
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 50);
  const headerTranslateY = diffClamp.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50]
  });
  
  // Get theme from context instead of local state
  const { isDarkMode } = useTheme();
  
  // Use wishlist context
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allModalVisible, setAllModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsAllModalVisible, setProductsAllModalVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [herbDetailModalVisible, setHerbDetailModalVisible] = useState(false);
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [herbsAllModalVisible, setHerbsAllModalVisible] = useState(false);

  // Apply search functionality without affecting main content
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // If search is empty, hide results
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    setShowSearchResults(true);
    const query = searchQuery.toLowerCase().trim();
    
    // Collect search results from all sources
    const results: SearchResultItem[] = [];
    
    // Add matching products to search results
    const matchingProducts = productData.filter(product => 
      product.name.toLowerCase().includes(query) || 
      (product.category && product.category.toLowerCase().includes(query))
    );
    
    matchingProducts.forEach(product => {
      results.push({
        id: product.name,
        name: product.name,
        image: product.image,
        type: 'product',
        description: product.category,
        price: product.price,
        category: product.category,
        data: product
      });
    });
    
    // Add matching herbs to search results
    const matchingHerbs = herbData.filter(herb => 
      herb.name.toLowerCase().includes(query) || 
      herb.scientificName.toLowerCase().includes(query) || 
      (herb.description && herb.description.toLowerCase().includes(query))
    );
    
    matchingHerbs.forEach(herb => {
      results.push({
        id: herb.id,
        name: herb.name,
        image: herb.image,
        type: 'herb',
        scientificName: herb.scientificName,
        description: herb.description,
        category: herb.category,
        data: herb
      });
    });
    
    // Add matching categories
    const matchingCategories = categories.filter(category => 
      category.name.toLowerCase().includes(query)
    );
    
    matchingCategories.forEach(category => {
      results.push({
        id: category.name,
        name: category.name,
        image: category.image,
        type: 'category',
        description: `${category.name} category`,
        data: category
      });
    });
    
    // Only update search results, don't filter main content
    setSearchResults(results);
  }, [searchQuery]);

  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text);
  };
  
  // Handle search result selection
  const handleSearchResultPress = (item: SearchResultItem) => {
    setShowSearchResults(false);
    
    switch (item.type) {
      case 'product':
        handleProductPress(item.data);
        break;
      case 'herb':
        handleHerbPress(item.data);
        break;
      case 'category':
        handleCategoryPress(item.data);
        break;
      default:
        // Handle other types if needed
        break;
    }
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Category handlers
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };
  
  const handleSeeAllPress = () => {
    setAllModalVisible(true);
  };

  // Product handlers
  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setProductModalVisible(true);
  };
  
  const handleSeeAllProducts = () => {
    setProductsAllModalVisible(true);
  };
  
  // Herb handlers
  const handleHerbPress = (herb) => {
    // Ensure the herb has an ID (required by HerbDetailModal)
    const herbWithId = herb.id ? herb : {
      ...herb,
      id: `herb-${Date.now()}` // Generate an ID if one doesn't exist
    };
    
    setSelectedHerb(herbWithId);
    setHerbDetailModalVisible(true);
  };
  
  const handleViewAllHerbs = () => {
    setHerbsAllModalVisible(true);
  };
  
  // Link handler
  const handleExplorePress = () => {
    const url = "https://ayush.gov.in";

    Linking.openURL(url).catch(err => {
      console.error('Error opening URL:', err);
      
      if (Platform.OS === 'android') {
        ToastAndroid.show('Could not open link. Please try again later.', ToastAndroid.SHORT);
      } else {
        Alert.alert(
          "Could not open link", 
          "Please check your internet connection and try again."
        );
      }
    });
  };
  
  // Cart handlers
  const handleAddToCart = (product) => {
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.name === product.name);
    
    if (existingProductIndex >= 0) {
      // Product already in cart, update quantity
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += product.quantity || 1;
      setCart(updatedCart);
    } else {
      // Add new product to cart
      setCart([...cart, { ...product, quantity: product.quantity || 1 }]);
    }
    
    console.log(`Added ${product.name} to cart`);
  };
  
  const handleCartPress = () => {
    setCartModalVisible(true);
  };
  
  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is zero or negative
      handleRemoveFromCart(item);
      return;
    }
    
    const updatedCart = cart.map(cartItem => 
      cartItem.name === item.name 
        ? { ...cartItem, quantity: newQuantity } 
        : cartItem
    );
    
    setCart(updatedCart);
  };
  
  const handleRemoveFromCart = (item) => {
    const updatedCart = cart.filter(cartItem => cartItem.name !== item.name);
    setCart(updatedCart);
  };
  
  const handleCheckout = () => {
    // In a real app, this would navigate to checkout screen
    alert('Proceeding to checkout...');
    setCartModalVisible(false);
  };

  // Updated favorite handler that uses wishlist context
  const handleToggleFavorite = (product) => {
    const productId = product.name;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        ...product,
        id: productId,
        category: product.category || 'General'
      });
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <Header 
        onCartPress={handleCartPress}
        cartItemsCount={cart.length}
      />
      
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.searchBarContainer}>
          <SearchBar 
            isDarkMode={isDarkMode} 
            onChangeText={handleSearch}
            value={searchQuery}
          />
        </View>
        
        <HeroBanner 
          imageSource={IMAGES.banner}
          title="Discover Ayurveda's Treasures"
          subtitle="Natural remedies for holistic wellness"
          buttonText="Explore Now"
          onPress={handleExplorePress}
          isDarkMode={isDarkMode}
        />
        
        <CategorySection 
          categories={categories}
          onCategoryPress={handleCategoryPress}
          onSeeAllPress={handleSeeAllPress}
          isDarkMode={isDarkMode}
        />
        
        <FeaturedProducts 
          products={productData}  // Always use full product data, not filtered
          onProductPress={handleProductPress}
          onSeeAllPress={handleSeeAllProducts}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          isDarkMode={isDarkMode}
        />
        
        <HealingPlants 
          plants={herbData}  // Always use full herb data, not filtered
          onPlantPress={handleHerbPress}
          onViewAllPress={handleViewAllHerbs}
          isDarkMode={isDarkMode}
        />
        
        <DailyTips 
          tips={[
            {title: "Morning Rituals", content: "Start your day with a glass of warm water with lemon to cleanse your system"},
            {title: "Mindful Eating", content: "Chew your food thoroughly and eat without distractions for better digestion"},
            {title: "Evening Routine", content: "Apply warm sesame oil on your feet before bed for better sleep quality"}
          ]}
          onTipPress={() => {}}
          onSeeMorePress={() => {}}
          isDarkMode={isDarkMode}
        />
        
        <AyurvedaWisdom 
          quote="The natural healing force within each one of us is the greatest force in getting well."
          author="- Hippocrates"
          isDarkMode={isDarkMode}
        />
        
        <Footer 
          logoUri="../assets/images/icon.png"
          copyright="Dhanvantari Vatika © 2025"
          tagline="Ancient remedies for modern wellness"
          isDarkMode={isDarkMode}
        />
      </Animated.ScrollView>
      
      {/* SearchResultsCard positioned outside the ScrollView */}
      <View style={styles.searchResultsContainer}>
        <SearchResultsCard
          results={searchResults}
          isDarkMode={isDarkMode}
          onResultPress={handleSearchResultPress}
          onClearSearch={handleClearSearch}
          visible={showSearchResults && searchResults.length > 0}
        />
      </View>
      
      <BottomNavigation 
        items={[
          {name: "Home", icon: "home", active: true},
          {name: "Herbs", icon: "leaf-outline", active: false},
          {name: "Learn", icon: "book-outline", active: false},
          {name: "Profile", icon: "person-outline", active: false}
        ]}
        onItemPress={() => {}}
        isDarkMode={isDarkMode}
      />
      
      {/* Category Modals */}
      <CategoryModal 
        visible={modalVisible}
        category={selectedCategory}
        onClose={() => setModalVisible(false)}
        isDarkMode={isDarkMode}
      />
      
      <CategoriesAllModal
        visible={allModalVisible}
        categories={categories}
        onClose={() => setAllModalVisible(false)}
        onCategoryPress={(category) => {
          setAllModalVisible(false);
          setTimeout(() => {
            setSelectedCategory(category);
            setModalVisible(true);
          }, 300);
        }}
        isDarkMode={isDarkMode}
      />
      
      {/* Product Modals */}
      <ProductModal 
        visible={productModalVisible}
        product={selectedProduct}
        onClose={() => setProductModalVisible(false)}
        onAddToCart={handleAddToCart}
        isDarkMode={isDarkMode}
      />
      
      <ProductsAllModal
        visible={productsAllModalVisible}
        products={productData}
        onClose={() => setProductsAllModalVisible(false)}
        onProductPress={handleProductPress}
        onAddToCart={handleAddToCart}
        isDarkMode={isDarkMode}
      />

      {/* Cart Modal */}
      <CartModal
        visible={cartModalVisible}
        cartItems={cart}
        onClose={() => setCartModalVisible(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        isDarkMode={isDarkMode}
      />

      {/* Herb Detail Modal */}
      <HerbDetailModal
        visible={herbDetailModalVisible}
        herb={selectedHerb}
        onClose={() => setHerbDetailModalVisible(false)}
        isDarkMode={isDarkMode}
      />
      
      <HerbsAllModal
        visible={herbsAllModalVisible}
        herbs={herbData}
        onClose={() => setHerbsAllModalVisible(false)}
        onHerbPress={handleHerbPress}
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
  scrollContent: {
    paddingTop: 100, // Space for the fixed header
    paddingBottom: 70, // Space for bottom navigation
  },
  searchBarContainer: {
    marginBottom: 15,
    zIndex: 10,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 175, // Positioned below header + search bar
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
    paddingHorizontal: 20,
  }
});
