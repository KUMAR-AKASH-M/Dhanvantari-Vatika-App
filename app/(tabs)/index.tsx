import React, { useState } from "react";
import { 
  Text, 
  View, 
  ScrollView, 
  StyleSheet, 
  Dimensions,
  Animated
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
  // For scroll animation
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 50);
  const headerTranslateY = diffClamp.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50]
  });

  // Add theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme change handler
  const handleThemeChange = (isDark: boolean) => {
    setIsDarkMode(isDark);
    // Apply theme changes to the app (you can expand this logic)
    // For example, change background colors, text colors, etc.
    console.log("Theme changed to:", isDark ? "dark" : "light");
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <Header 
        isDarkMode={isDarkMode}
        onThemeChange={handleThemeChange}
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
        <SearchBar isDarkMode={isDarkMode} />
        
        <HeroBanner 
          imageSource={IMAGES.banner}
          title="Discover Ayurveda's Treasures"
          subtitle="Natural remedies for holistic wellness"
          buttonText="Explore Now"
          onPress={() => {}}
          isDarkMode={isDarkMode}
        />
        
        <CategorySection 
          categories={[
            {name: "Ayurveda", icon: "leaf", image: IMAGES.categories.ayurveda},
            {name: "Yoga", icon: "fitness", image: IMAGES.categories.yoga},
            {name: "Naturopathy", icon: "leaf-outline", image: IMAGES.categories.naturopathy},
            {name: "Unani", icon: "flask", image: IMAGES.categories.unani},
            {name: "Siddha", icon: "medkit", image: IMAGES.categories.siddha},
            {name: "Homoeopathy", icon: "medkit-outline", image: IMAGES.categories.homoeopathy}
          ]}
          onCategoryPress={() => {}}
          onSeeAllPress={() => {}}
          isDarkMode={isDarkMode}
        />
        
        <FeaturedProducts 
          products={[
            {name: "Ashwagandha Kit", price: "₹599", image: IMAGES.products.product1, rating: 4.8, reviews: 156},
            {name: "Triphala Kit", price: "₹449", image: IMAGES.products.product2, rating: 4.5, reviews: 98},
            {name: "Tulsi Kit", price: "₹349", image: IMAGES.products.product3, rating: 4.7, reviews: 214},
            {name: "Neem Kit", price: "₹499", image: IMAGES.products.product4, rating: 4.6, reviews: 120}
          ]}
          onProductPress={() => {}}
          onSeeAllPress={() => {}}
          isDarkMode={isDarkMode}
        />
        
        <HealingPlants 
          plants={[
            {name: "Tulsi", description: "Reduces stress & anxiety", image: IMAGES.herbs.tulsi},
            {name: "Ashwagandha", description: "Boosts immunity & energy", image: IMAGES.herbs.ashwagandha},
            {name: "Neem", description: "Natural antiseptic & detoxifier", image: IMAGES.herbs.neem},
            {name: "Amla", description: "Rich in Vitamin C, antioxidant", image: IMAGES.herbs.amla}
          ]}
          onPlantPress={() => {}}
          onViewAllPress={() => {}}
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
          copyright="Dhanvantari Vatika © 2023"
          tagline="Ancient remedies for modern wellness"
          isDarkMode={isDarkMode}
        />
      </Animated.ScrollView>
      
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
});
