import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  PanResponder,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RecipeType } from './RecipeCard';
import { useSavedRemedies } from '../../context/RemedyContext';

const { width, height } = Dimensions.get('window');

interface RecipeDetailModalProps {
  visible: boolean;
  onClose: () => void;
  recipe: RecipeType | null;
  isDarkMode: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const RecipeDetailModal = ({ 
  visible, 
  onClose, 
  recipe, 
  isDarkMode,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false
}: RecipeDetailModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [activeTab, setActiveTab] = useState('ingredients');
  
  // Use saved remedies context
  const { addToSavedRemedies, removeFromSavedRemedies, isInSavedRemedies } = useSavedRemedies();
  
  // Check if the recipe is bookmarked (saved)
  const recipeId = recipe?.id;
  const isBookmarked = recipeId ? isInSavedRemedies(recipeId) : false;
  
  // Reset states when modal closes/opens
  useEffect(() => {
    if (!visible) {
      setActiveTab('ingredients');
    }
  }, [visible]);

  // Add pan responder for swipe-to-close functionality
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical gestures
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward swipes (positive dy)
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If user swiped down more than 150px, close the modal
        if (gestureState.dy > 150) {
          Animated.timing(slideAnim, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          // Otherwise, snap back to fully open
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
        }
      },
    })
  ).current;

  // Animation logic
  useEffect(() => {
    if (visible) {
      // Animate modal sliding up
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 5,
        speed: 14,
      }).start();
      
      // Animate content fading in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        delay: 200,
      }).start();
      
      // Animate content scaling up
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
        delay: 100,
      }).start();
    } else {
      // Animate modal sliding down
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Reset other animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible]);
  
  // Bookmark toggle with actual saving functionality
  const toggleBookmark = () => {
    if (!recipe) return;
    
    if (isBookmarked) {
      removeFromSavedRemedies(recipeId);
    } else {
      // Format the remedy with the expected structure
      const remedyToSave = {
        ...recipe,
        ingredients: recipe.ingredients.join(', '),
        condition: "Ayurvedic Remedy",
      };
      addToSavedRemedies(remedyToSave);
    }
  };
  
  // Share functionality
  const handleShare = async () => {
    if (!recipe) return;
    
    try {
      await Share.share({
        title: recipe.title,
        message: `Check out this amazing recipe for ${recipe.title}! It takes only ${recipe.prepTime} to prepare.`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!recipe) return null;

  // Sample recipe details - in a real app, these would come from your data source
  const steps = [
    "Bring 2 cups of water to a boil in a small pot.",
    "Add all ingredients except honey and simmer for 5 minutes.",
    "Reduce heat to low and let it steep for another 5 minutes.",
    "Strain the mixture into a cup.",
    "Add honey to taste when the liquid is warm but not hot.",
    "Drink while warm. Can be consumed 1-2 times daily."
  ];

  const benefits = [
    "Boosts immunity",
    "Helps with respiratory health",
    "Anti-inflammatory properties",
    "Improves digestion",
    "Natural source of antioxidants"
  ];
  
  const nutritionInfo = {
    calories: '85 kcal per cup',
    carbs: '10g',
    protein: '2g',
    fat: '3g',
    fiber: '1.5g'
  };

  // Different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'ingredients':
        return (
          <View style={styles.ingredientsContainer}>
            <Text style={[styles.tabIntro, isDarkMode && styles.darkText]}>
              You'll need these fresh ingredients:
            </Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientRow}>
                <View style={[styles.bulletPoint, isDarkMode && styles.darkBullet]} />
                <Text style={[styles.ingredientText, isDarkMode && styles.darkText]}>
                  {ingredient}
                </Text>
              </View>
            ))}
          </View>
        );
      case 'preparation':
        return (
          <View style={styles.preparationContainer}>
            <Text style={[styles.tabIntro, isDarkMode && styles.darkText]}>
              Follow these steps for best results:
            </Text>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <Text style={[styles.stepText, isDarkMode && styles.darkText]}>
                  {step}
                </Text>
              </View>
            ))}
          </View>
        );
      case 'benefits':
        return (
          <View style={styles.benefitsContainer}>
            <Text style={[styles.tabIntro, isDarkMode && styles.darkText]}>
              Health benefits of this recipe:
            </Text>
            
            <View style={styles.benefitsList}>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={18} color={isDarkMode ? "#8bc34a" : "#3e7d32"} />
                  <Text style={[styles.benefitText, isDarkMode && styles.darkText]}>
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={[styles.nutritionCard, isDarkMode && styles.darkNutritionCard]}>
              <Text style={[styles.nutritionTitle, isDarkMode && styles.darkText]}>
                Nutrition Information
              </Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={[styles.nutritionValue, isDarkMode && styles.darkHighlightText]}>
                    {nutritionInfo.calories}
                  </Text>
                  <Text style={[styles.nutritionLabel, isDarkMode && styles.darkMutedText]}>
                    Calories
                  </Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={[styles.nutritionValue, isDarkMode && styles.darkHighlightText]}>
                    {nutritionInfo.carbs}
                  </Text>
                  <Text style={[styles.nutritionLabel, isDarkMode && styles.darkMutedText]}>
                    Carbs
                  </Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={[styles.nutritionValue, isDarkMode && styles.darkHighlightText]}>
                    {nutritionInfo.protein}
                  </Text>
                  <Text style={[styles.nutritionLabel, isDarkMode && styles.darkMutedText]}>
                    Protein
                  </Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={[styles.nutritionValue, isDarkMode && styles.darkHighlightText]}>
                    {nutritionInfo.fat}
                  </Text>
                  <Text style={[styles.nutritionLabel, isDarkMode && styles.darkMutedText]}>
                    Fat
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayBackground} onPress={onClose} activeOpacity={0.7} />
        
        <Animated.View 
          style={[
            styles.modalContainer, 
            isDarkMode && styles.darkModalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Drag indicator for sliding */}
          <View style={styles.dragIndicatorContainer} {...panResponder.panHandlers}>
            <View style={[styles.dragIndicator, isDarkMode && styles.darkDragIndicator]} />
          </View>
          
          {/* Header with close button */}
          <View style={[styles.header, isDarkMode && styles.darkHeader]}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons 
                name="chevron-down" 
                size={28} 
                color={isDarkMode ? "#fff" : "#333"} 
              />
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={toggleBookmark} style={styles.headerButton}>
                <Ionicons 
                  name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                  size={22} 
                  color={isBookmarked ? "#f5bc42" : (isDarkMode ? "#fff" : "#333")} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
                <Ionicons 
                  name="share-outline" 
                  size={22} 
                  color={isDarkMode ? "#fff" : "#333"} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Hero section with image */}
          <View style={styles.heroContainer}>
            <Image source={recipe.image} style={styles.heroImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.heroGradient}
            />
            <Animated.View 
              style={[
                styles.heroOverlay,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
              ]}
            >
              <Text style={styles.heroTitle}>{recipe.title}</Text>
              <View style={styles.heroTagContainer}>
                <Ionicons name="time-outline" size={14} color="#fff" />
                <Text style={styles.heroTagText}>Prep: {recipe.prepTime}</Text>
              </View>
            </Animated.View>
          </View>
          
          {/* Tab navigation */}
          <View style={[styles.tabContainer, isDarkMode && styles.darkTabContainer]}>
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'ingredients' && styles.activeTab,
                activeTab === 'ingredients' && isDarkMode && styles.darkActiveTab
              ]}
              onPress={() => setActiveTab('ingredients')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'ingredients' && styles.activeTabText,
                  isDarkMode && styles.darkTabText
                ]}
              >
                Ingredients
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'preparation' && styles.activeTab,
                activeTab === 'preparation' && isDarkMode && styles.darkActiveTab
              ]}
              onPress={() => setActiveTab('preparation')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'preparation' && styles.activeTabText,
                  isDarkMode && styles.darkTabText
                ]}
              >
                Preparation
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'benefits' && styles.activeTab,
                activeTab === 'benefits' && isDarkMode && styles.darkActiveTab
              ]}
              onPress={() => setActiveTab('benefits')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'benefits' && styles.activeTabText,
                  isDarkMode && styles.darkTabText
                ]}
              >
                Benefits
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Content */}
          <Animated.ScrollView 
            style={[styles.contentContainer, { opacity: fadeAnim }]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              {renderTabContent()}
            </Animated.View>
          </Animated.ScrollView>
          
          {/* Navigation buttons at the bottom */}
          <View style={[styles.navigationFooter, isDarkMode && styles.darkNavigationFooter]}>
            <TouchableOpacity 
              style={[
                styles.navButton, 
                isDarkMode && styles.darkNavButton,
                !hasPrevious && styles.disabledButton
              ]}
              onPress={hasPrevious ? onPrevious : undefined}
              disabled={!hasPrevious}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={hasPrevious ? (isDarkMode ? '#fff' : '#333') : (isDarkMode ? '#555' : '#ccc')} 
              />
              <Text 
                style={[
                  styles.navButtonText, 
                  isDarkMode && styles.darkNavButtonText,
                  !hasPrevious && styles.disabledButtonText
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.navButton, 
                isDarkMode && styles.darkNavButton,
                !hasNext && styles.disabledButton
              ]}
              onPress={hasNext ? onNext : undefined}
              disabled={!hasNext}
            >
              <Text 
                style={[
                  styles.navButtonText, 
                  isDarkMode && styles.darkNavButtonText,
                  !hasNext && styles.disabledButtonText
                ]}
              >
                Next
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={hasNext ? (isDarkMode ? '#fff' : '#333') : (isDarkMode ? '#555' : '#ccc')} 
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContainer: {
    height: '90%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 10,
  },
  darkModalContainer: {
    backgroundColor: '#121212',
  },
  dragIndicatorContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
  },
  darkDragIndicator: {
    backgroundColor: '#555',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
  },
  darkHeader: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: {
    padding: 5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 10,
  },
  heroContainer: {
    position: 'relative',
    height: 220,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 8,
  },
  heroTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(62,125,50,0.8)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  heroTagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80, // Space for the navigation footer
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    // Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkSection: {
    backgroundColor: '#2a2a2a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3e7d32',
    marginRight: 10,
  },
  darkBullet: {
    backgroundColor: '#6baf5e',
  },
  ingredientText: {
    fontSize: 15,
    color: '#444',
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
    lineHeight: 22,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#444',
  },
  navigationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  darkNavigationFooter: {
    backgroundColor: '#1e1e1e',
    borderTopColor: '#333',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  darkNavButton: {
    // No specific styling needed beyond text color
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3e7d32',
    marginHorizontal: 5,
  },
  darkNavButtonText: {
    color: '#6baf5e',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#999',
  },
  darkText: {
    color: '#f0f0f0',
  },

  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  darkTabContainer: {
    backgroundColor: '#1A1A1A',
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3e7d32',
  },
  darkActiveTab: {
    borderBottomColor: '#8bc34a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  activeTabText: {
    color: '#3e7d32',
    fontWeight: '700',
  },
  darkTabText: {
    color: '#aaa',
  },
  
  // Tab content styles
  tabIntro: {
    fontSize: 15,
    color: '#555',
    marginBottom: 15,
    lineHeight: 22,
  },
  ingredientsContainer: {
    marginBottom: 20,
  },
  preparationContainer: {
    marginBottom: 20,
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitsList: {
    marginBottom: 20,
  },
  nutritionCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  darkNutritionCard: {
    backgroundColor: '#2a2a2a',
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '48%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3e7d32',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#777',
  },
  darkHighlightText: {
    color: '#8bc34a',
  },
  darkMutedText: {
    color: '#aaa',
  },
});

export default RecipeDetailModal;
