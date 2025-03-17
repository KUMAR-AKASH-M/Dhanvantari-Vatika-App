import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Share,
  PanResponder,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useWishlist } from '../context/WishlistContext';

interface ProductModalProps {
  visible: boolean;
  product: {
    name: string;
    price: string;
    image: any;
    rating: number;
    reviews: number;
    description?: string;
  } | null;
  onClose: () => void;
  onAddToCart: (product: any) => void;
  isDarkMode: boolean;
}

const { height, width } = Dimensions.get('window');

const ProductModal = ({ visible, product, onClose, onAddToCart, isDarkMode }: ProductModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Use wishlist context
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // State for active tab and quantity
  const [activeTab, setActiveTab] = useState('overview');
  const [quantity, setQuantity] = useState(1);
  
  // Check if item is in wishlist
  const productId = product?.name;
  const isFavorite = productId ? isInWishlist(productId) : false;
  
  // Reset states when modal closes/opens
  useEffect(() => {
    if (!visible) {
      setActiveTab('overview');
      setQuantity(1);
    }
  }, [visible]);

  // Add pan responder for swipe-to-close functionality
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          Animated.timing(slideAnim, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
          }).start(onClose);
        } else {
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
      // Animation for sliding up
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 5,
        speed: 14,
      }).start();
      
      // Animation for fading in content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        delay: 200,
      }).start();
      
      // Animation for scaling up content
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
        delay: 100,
      }).start();
    } else {
      // Animation for sliding down
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
  
  // Share functionality
  const handleShare = async () => {
    if (!product) return;
    
    try {
      await Share.share({
        title: product.name,
        message: `Check out this amazing ${product.name} on Dhanvantari Vatika! It costs ${product.price} and has ${product.rating} stars.`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  // Favorite toggle
  const toggleFavorite = () => {
    if (!product) return;
    
    if (isFavorite) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        ...product,
        id: productId,
        category: product.category || 'General',
        price: product.price || '₹0',
        discount: product.discount || '',
        stock: 'In Stock'
      });
    }
  };

  if (!product) return null;

  // Product content
  const getProductContent = () => {
    return {
      description: "This premium Ayurvedic product contains high-quality natural ingredients sourced directly from organic farms. Made following traditional methods with modern quality standards.",
      benefits: [
        "Supports immune system health",
        "Promotes natural energy and vitality",
        "Helps maintain overall wellbeing",
        "Made from 100% natural ingredients"
      ],
      ingredients: [
        "Organic herbs harvested at peak potency",
        "No artificial additives or preservatives",
        "Processed using traditional Ayurvedic methods",
        "Quality tested for purity and efficacy"
      ],
      usage: [
        "Take 1-2 capsules daily with warm water",
        "Best consumed after meals",
        "Store in a cool, dry place",
        "Course duration: 1-3 months for optimal results"
      ],
      details: `The formula has been created based on age-old Ayurvedic principles refined over thousands of years. Each ingredient is carefully selected for its specific properties and how it works in harmony with other components.

Traditional Ayurvedic doctors (Vaidyas) recommend this product as part of a holistic approach to wellness, which includes proper diet, exercise, and mental health practices.

Quality is our highest priority. Each batch undergoes extensive testing for purity and potency before reaching you. The herbs are harvested at their peak potency to ensure maximum benefit.`,
    };
  };

  const content = getProductContent();

  // Render different tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <Text style={[styles.description, isDarkMode && styles.darkText]}>
              {content.description}
            </Text>
            
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Benefits</Text>
              {content.benefits.map((benefit, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={16} 
                    color={isDarkMode ? "#8bc34a" : "#3e7d32"} 
                    style={styles.bulletIcon} 
                  />
                  <Text style={[styles.bulletText, isDarkMode && styles.darkText]}>
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Details</Text>
              <Text style={[styles.detailsText, isDarkMode && styles.darkText]}>
                {content.details}
              </Text>
            </View>
          </>
        );
      case 'ingredients':
        return (
          <View style={styles.ingredientsContainer}>
            <Text style={[styles.tabIntro, isDarkMode && styles.darkText]}>
              This product contains premium quality natural ingredients:
            </Text>
            {content.ingredients.map((ingredient, index) => (
              <View key={index} style={[styles.ingredientCard, isDarkMode && styles.darkIngredientCard]}>
                <View style={styles.ingredientIconContainer}>
                  <Ionicons name="leaf" size={20} color={isDarkMode ? "#8bc34a" : "#3e7d32"} />
                </View>
                <View style={styles.ingredientContent}>
                  <Text style={[styles.ingredientText, isDarkMode && styles.darkText]}>
                    {ingredient}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        );
      case 'usage':
        return (
          <View style={styles.usageContainer}>
            <Text style={[styles.tabIntro, isDarkMode && styles.darkText]}>
              For best results, follow these usage guidelines:
            </Text>
            {content.usage.map((instruction, index) => (
              <View key={index} style={[styles.usageCard, isDarkMode && styles.darkUsageCard]}>
                <View style={styles.usageIconContainer}>
                  <Text style={[styles.usageNumber, isDarkMode && { color: '#8bc34a' }]}>{index + 1}</Text>
                </View>
                <View style={styles.usageContent}>
                  <Text style={[styles.usageText, isDarkMode && styles.darkText]}>
                    {instruction}
                  </Text>
                </View>
              </View>
            ))}
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
          {/* Drag indicator */}
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
              <TouchableOpacity onPress={toggleFavorite} style={styles.headerButton}>
                <Ionicons 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={22} 
                  color={isFavorite ? "#e53935" : (isDarkMode ? "#fff" : "#333")} 
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
          
          {/* Make entire content area scrollable */}
          <ScrollView 
            style={styles.scrollViewContainer} 
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Product Hero Section */}
            <View style={styles.productHeroContainer}>
              <View style={styles.productImageWrapper}>
                <Image source={product.image} style={styles.productImage} />
                {product.rating > 0 && (
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingValue}>{product.rating}</Text>
                    <Ionicons name="star" size={12} color="#fff" />
                  </View>
                )}
              </View>
            </View>
            
            {/* Product Info */}
            <View style={[styles.productInfo, isDarkMode && styles.darkProductInfo]}>
              <Animated.View style={{ opacity: fadeAnim }}>
                <Text style={[styles.productName, isDarkMode && styles.darkText]}>{product.name}</Text>
                <Text style={[styles.productPrice, isDarkMode && { color: '#8bc34a' }]}>{product.price}</Text>
                
                <View style={styles.reviewsContainer}>
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons 
                        key={star} 
                        name={star <= Math.floor(product.rating) ? "star" : "star-outline"} 
                        size={16} 
                        color="#ffc107" 
                        style={styles.starIcon}
                      />
                    ))}
                  </View>
                  <Text style={[styles.reviewsText, isDarkMode && styles.darkSubText]}>
                    ({product.reviews} reviews)
                  </Text>
                </View>
              </Animated.View>
            </View>
            
            {/* Tab navigation */}
            <View style={[styles.tabContainer, isDarkMode && styles.darkTabContainer]}>
              <TouchableOpacity 
                style={[
                  styles.tab, 
                  activeTab === 'overview' && styles.activeTab,
                  activeTab === 'overview' && isDarkMode && styles.darkActiveTab
                ]}
                onPress={() => setActiveTab('overview')}
              >
                <Text 
                  style={[
                    styles.tabText, 
                    activeTab === 'overview' && styles.activeTabText,
                    isDarkMode && styles.darkTabText
                  ]}
                >
                  Overview
                </Text>
              </TouchableOpacity>
              
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
                  activeTab === 'usage' && styles.activeTab,
                  activeTab === 'usage' && isDarkMode && styles.darkActiveTab
                ]}
                onPress={() => setActiveTab('usage')}
              >
                <Text 
                  style={[
                    styles.tabText, 
                    activeTab === 'usage' && styles.activeTabText,
                    isDarkMode && styles.darkTabText
                  ]}
                >
                  Usage
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Tab content */}
            <Animated.View 
              style={[styles.tabContentContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
            >
              {renderTabContent()}
            </Animated.View>
            
            {/* Add spacer at bottom for the fixed action bar */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
          
          {/* Bottom action bar - fixed */}
          <View style={[styles.bottomBar, isDarkMode && styles.darkBottomBar]}>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={[styles.quantityButton, isDarkMode && styles.darkQuantityButton]}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Ionicons 
                  name="remove" 
                  size={20} 
                  color={quantity > 1 ? (isDarkMode ? "#fff" : "#333") : "#ccc"} 
                />
              </TouchableOpacity>
              
              <Text style={[styles.quantityText, isDarkMode && styles.darkText]}>
                {quantity}
              </Text>
              
              <TouchableOpacity 
                style={[styles.quantityButton, isDarkMode && styles.darkQuantityButton]}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={isDarkMode ? "#fff" : "#333"} />
              </TouchableOpacity>
            </View>
            
            {/* Single Add to Cart button (removed wishlist button) */}
            <TouchableOpacity 
              style={styles.addToCartButton}
              onPress={() => {
                if (product) {
                  onAddToCart({...product, quantity});
                  onClose();
                }
              }}
            >
              <Ionicons name="cart-outline" size={20} color="#fff" style={styles.cartIcon} />
              <Text style={styles.addToCartText}>Add to Cart</Text>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
  productHeroContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  productImageWrapper: {
    position: 'relative',
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0, 
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#ff9800',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 3,
  },
  productInfo: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  darkProductInfo: {
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3e7d32',
    marginBottom: 10,
  },
  reviewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  starIcon: {
    marginRight: 2,
  },
  reviewsText: {
    fontSize: 14,
    color: '#777',
  },
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
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#555',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bulletIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
    color: '#555',
  },
  ingredientsContainer: {
    marginBottom: 20,
  },
  tabIntro: {
    fontSize: 15,
    color: '#555',
    marginBottom: 15,
    lineHeight: 22,
  },
  ingredientCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  darkIngredientCard: {
    backgroundColor: '#2a2a2a',
  },
  ingredientIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  ingredientContent: {
    flex: 1,
  },
  ingredientText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#444',
  },
  usageContainer: {
    marginBottom: 20,
  },
  usageCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  darkUsageCard: {
    backgroundColor: '#2a2a2a',
  },
  usageIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  usageNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3e7d32',
  },
  usageContent: {
    flex: 1,
  },
  usageText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#444',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  darkBottomBar: {
    backgroundColor: '#1A1A1A',
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkQuantityButton: {
    backgroundColor: '#333',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 15,
    color: '#333',
  },
  addToCartButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#3e7d32',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  cartIcon: {
    marginLeft: 4,
    marginRight: 8,
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkSubText: {
    color: '#aaa',
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  tabContentContainer: {
    padding: 20,
  },
  bottomSpacer: {
    height: 90, // Add space at bottom for fixed action bar
  },
  detailsText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
});

export default ProductModal;
