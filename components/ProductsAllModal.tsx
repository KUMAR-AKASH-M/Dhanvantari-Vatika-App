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
  TextInput,
  PanResponder,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../context/WishlistContext';

interface Product {
  name: string;
  price: string;
  image: any;
  rating: number;
  reviews: number;
  category?: string;
  featured?: boolean;
}

interface ProductsAllModalProps {
  visible: boolean;
  products: Product[];
  onClose: () => void;
  onProductPress: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  isDarkMode: boolean;
}

const { height, width } = Dimensions.get('window');

const ProductsAllModal = ({ 
  visible, 
  products, 
  onClose, 
  onProductPress, 
  onAddToCart,
  isDarkMode 
}: ProductsAllModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortBy, setSortBy] = useState('popular');
  
  // Use wishlist context
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Handle wishlist toggling
  const handleWishlistToggle = (product) => {
    const productId = product.name;
    
    if (isInWishlist(productId)) {
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

  // Apply search and filter
  useEffect(() => {
    let result = products;
    
    // Apply search
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filter
    if (activeFilter === 'featured') {
      result = result.filter(product => product.featured);
    } else if (activeFilter !== 'all') {
      result = result.filter(product => product.category === activeFilter);
    }
    
    // Apply sort
    switch (sortBy) {
      case 'priceAsc':
        result = [...result].sort((a, b) => 
          parseFloat(a.price.replace(/[^0-9.]/g, '')) - 
          parseFloat(b.price.replace(/[^0-9.]/g, ''))
        );
        break;
      case 'priceDesc':
        result = [...result].sort((a, b) => 
          parseFloat(b.price.replace(/[^0-9.]/g, '')) - 
          parseFloat(a.price.replace(/[^0-9.]/g, ''))
        );
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        result = [...result].sort((a, b) => b.reviews - a.reviews);
        break;
    }
    
    setFilteredProducts(result);
  }, [searchQuery, activeFilter, sortBy, products]);

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
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 5,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
      fadeAnim.setValue(0);
    }
  }, [visible]);

  // Reset search and filter when modal opens
  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      setActiveFilter('all');
      setSortBy('popular');
    }
  }, [visible]);

  // Render a product card
  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, isDarkMode && styles.darkCard]}
      onPress={() => {
        onProductPress(item);
        onClose();
      }}
      activeOpacity={0.9}
    >
      <View style={styles.productImageContainer}>
        <Image source={item.image} style={styles.productImage} />
        
        {/* Add wishlist button */}
        <TouchableOpacity 
          style={[
            styles.wishlistButton,
            isInWishlist(item.name) && styles.activeWishlistButton
          ]}
          onPress={() => handleWishlistToggle(item)}
        >
          <Ionicons 
            name={isInWishlist(item.name) ? "heart" : "heart-outline"} 
            size={18} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.productInfo}>
        <Text 
          style={[styles.productName, isDarkMode && styles.darkText]} 
          numberOfLines={1}
        >
          {item.name}
        </Text>
        
        <Text 
          style={[styles.productPrice, isDarkMode && styles.darkPrimaryText]}
        >
          {item.price}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#ffc107" />
          <Text style={[styles.ratingText, isDarkMode && styles.darkSubtext]}>
            {item.rating} ({item.reviews})
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => onAddToCart?.(item)}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
          
          {/* Header */}
          <View style={[styles.header, isDarkMode && styles.darkHeader]}>
            <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
              All Products
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons 
                name="close" 
                size={24} 
                color={isDarkMode ? "#fff" : "#333"} 
              />
            </TouchableOpacity>
          </View>
          
          {/* Search bar */}
          <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
            <Ionicons 
              name="search" 
              size={20} 
              color={isDarkMode ? "#aaa" : "#666"} 
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
              placeholder="Search products..."
              placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearch}>
                <Ionicons 
                  name="close-circle" 
                  size={18} 
                  color={isDarkMode ? "#aaa" : "#999"} 
                />
              </TouchableOpacity>
            ) : null}
          </View>
          
          {/* Filter and sort options */}
          <View style={[styles.optionsContainer, isDarkMode && styles.darkOptionsContainer]}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filtersScrollView}
            >
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  isDarkMode && styles.darkFilterChip,
                  activeFilter === 'all' && styles.activeFilterChip,
                  activeFilter === 'all' && isDarkMode && styles.darkActiveFilterChip,
                ]}
                onPress={() => setActiveFilter('all')}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    isDarkMode && styles.darkChipText,
                    activeFilter === 'all' && styles.activeFilterChipText,
                  ]}
                >
                  All Products
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  isDarkMode && styles.darkFilterChip,
                  activeFilter === 'featured' && styles.activeFilterChip,
                  activeFilter === 'featured' && isDarkMode && styles.darkActiveFilterChip,
                ]}
                onPress={() => setActiveFilter('featured')}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    isDarkMode && styles.darkChipText,
                    activeFilter === 'featured' && styles.activeFilterChipText,
                  ]}
                >
                  Featured
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  isDarkMode && styles.darkFilterChip,
                  activeFilter === 'herbs' && styles.activeFilterChip,
                  activeFilter === 'herbs' && isDarkMode && styles.darkActiveFilterChip,
                ]}
                onPress={() => setActiveFilter('herbs')}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    isDarkMode && styles.darkChipText,
                    activeFilter === 'herbs' && styles.activeFilterChipText,
                  ]}
                >
                  Herbs
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  isDarkMode && styles.darkFilterChip,
                  activeFilter === 'kits' && styles.activeFilterChip,
                  activeFilter === 'kits' && isDarkMode && styles.darkActiveFilterChip,
                ]}
                onPress={() => setActiveFilter('kits')}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    isDarkMode && styles.darkChipText,
                    activeFilter === 'kits' && styles.activeFilterChipText,
                  ]}
                >
                  Kits
                </Text>
              </TouchableOpacity>
            </ScrollView>
            
            <View style={styles.sortContainer}>
              <TouchableOpacity 
                style={[
                  styles.sortButton,
                  isDarkMode && styles.darkSortButton
                ]}
                onPress={() => {
                  // Show sort options in a real app
                  const nextSort = 
                    sortBy === 'popular' ? 'priceAsc' :
                    sortBy === 'priceAsc' ? 'priceDesc' :
                    sortBy === 'priceDesc' ? 'rating' : 'popular';
                  setSortBy(nextSort);
                }}
              >
                <Ionicons name="funnel-outline" size={18} color={isDarkMode ? "#fff" : "#333"} />
                <Text style={[styles.sortText, isDarkMode && styles.darkText]}>
                  {sortBy === 'popular' ? 'Popular' : 
                   sortBy === 'priceAsc' ? 'Price ↑' :
                   sortBy === 'priceDesc' ? 'Price ↓' : 'Rating'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Products grid */}
          <Animated.View style={[styles.productsContainer, { opacity: fadeAnim }]}>
            {filteredProducts.length > 0 ? (
              <FlatList
                data={filteredProducts}
                renderItem={renderProductCard}
                keyExtractor={(item, index) => `product-${index}`}
                numColumns={2}
                contentContainerStyle={styles.productGrid}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Ionicons 
                  name="search-outline" 
                  size={50} 
                  color={isDarkMode ? "#555" : "#ccc"} 
                />
                <Text style={[styles.noResultsText, isDarkMode && styles.darkText]}>
                  No products found
                </Text>
                <Text style={[styles.noResultsSubText, isDarkMode && styles.darkSubtext]}>
                  Try a different search term or filter
                </Text>
              </View>
            )}
          </Animated.View>
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
    height: '92%',
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
    height: 60,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  darkSearchContainer: {
    backgroundColor: '#2a2a2a',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    height: '100%',
  },
  darkSearchInput: {
    color: '#fff',
  },
  clearSearch: {
    padding: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  darkOptionsContainer: {
    backgroundColor: '#1A1A1A',
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  filtersScrollView: {
    flex: 1,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  darkFilterChip: {
    backgroundColor: '#2a2a2a',
  },
  activeFilterChip: {
    backgroundColor: '#3e7d32',
  },
  darkActiveFilterChip: {
    backgroundColor: '#4b9245',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  darkChipText: {
    color: '#ccc',
  },
  sortContainer: {
    marginLeft: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  darkSortButton: {
    backgroundColor: '#333',
  },
  sortText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  productsContainer: {
    flex: 1,
  },
  productGrid: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  darkCard: {
    backgroundColor: '#333',
  },
  productImageContainer: {
    position: 'relative',
    height: 150,
    backgroundColor: '#f5f5f5',
  },
  wishlistButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  activeWishlistButton: {
    backgroundColor: '#e91e63',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productInfo: {
    padding: 12,
    position: 'relative',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3e7d32',
    marginBottom: 5,
  },
  darkPrimaryText: {
    color: '#8bc34a',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#777',
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3e7d32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#777',
    marginTop: 6,
    textAlign: 'center',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkSubtext: {
    color: '#aaa',
  },
});

export default ProductsAllModal;
