import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../context/WishlistContext';

interface Product {
  name: string;
  price: string;
  image: any;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isSale?: boolean;
}

interface FeaturedProductsProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  onSeeAllPress: () => void;
  onAddToCart?: (product: Product) => void;
  isDarkMode: boolean;
}

const FeaturedProducts = ({ 
  products, 
  onProductPress, 
  onSeeAllPress, 
  onAddToCart,
  isDarkMode 
}: FeaturedProductsProps) => {
  // Use wishlist context instead of local state
  const { savedItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Handle favorite toggle with enhanced product data
  const handleFavoriteToggle = (product: Product) => {
    const productId = product.name; // Using name as ID since your products don't have explicit IDs
    
    if (isInWishlist(productId)) {
      console.log('Removing from wishlist:', productId);
      removeFromWishlist(productId);
    } else {
      // Add all necessary fields for SavedItemsModal
      console.log('Adding to wishlist:', productId);
      addToWishlist({
        ...product,
        id: productId,
        category: product.category || 'General',
        price: product.price || '₹0',
        discount: product.discount || '',
        stock: 'In Stock'
      });
      console.log('Current wishlist items:', savedItems.length);
    }
  };

  return (
    <View style={[styles.section, isDarkMode && styles.darkSection]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Featured Products</Text>
        <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7}>
          <Text style={[styles.seeAll, isDarkMode && styles.darkPrimaryText]}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((product, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.productCard, isDarkMode && styles.darkCard]}
            onPress={() => onProductPress(product)}
            activeOpacity={0.9}
          >
            {/* Image and badges container */}
            <View style={styles.productImageContainer}>
              <Image source={product.image} style={styles.productImage} />
              
              {/* Favorite button with animation */}
              <TouchableOpacity 
                style={[
                  styles.favoriteButton,
                  isInWishlist(product.name) && styles.activeFavoriteButton
                ]}
                onPress={() => handleFavoriteToggle(product)}
                activeOpacity={0.9}
              >
                <Ionicons 
                  name={isInWishlist(product.name) ? "heart" : "heart-outline"} 
                  size={18} 
                  color={isInWishlist(product.name) ? "#fff" : "#fff"} 
                />
              </TouchableOpacity>
              
              {/* Badges for New or Sale */}
              {product.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.badgeText}>NEW</Text>
                </View>
              )}
              
              {product.isSale && (
                <View style={styles.saleBadge}>
                  <Text style={styles.badgeText}>SALE</Text>
                </View>
              )}
            </View>
            
            {/* Product info */}
            <View style={styles.productInfo}>
              <Text 
                style={[styles.productName, isDarkMode && styles.darkText]} 
                numberOfLines={1}
              >
                {product.name}
              </Text>
              
              <Text 
                style={[styles.productPrice, isDarkMode && styles.darkPrimaryText]}
              >
                {product.price}
              </Text>
              
              <View style={styles.ratingContainer}>
                <Text style={[styles.ratingValue, isDarkMode && { color: '#ffc107' }]}>
                  {product.rating}
                </Text>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star} 
                    name={star <= Math.floor(product.rating) ? "star" : "star-outline"} 
                    size={14} 
                    color="#ffc107" 
                  />
                ))}
                <Text style={[styles.ratingText, isDarkMode && styles.darkSubtext]}>
                  ({product.reviews})
                </Text>
              </View>
              
              {/* Add to cart button */}
              <TouchableOpacity 
                style={[styles.addToCartButton, isDarkMode && styles.darkAddToCartButton]}
                onPress={() => onAddToCart?.(product)}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="cart-outline" 
                  size={14} 
                  color={isDarkMode ? "#fff" : "#3e7d32"} 
                  style={styles.cartIcon} 
                />
                <Text style={[styles.addToCartText, isDarkMode && styles.darkAddToCartText]}>
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    color: "#3e7d32",
    fontSize: 14,
    fontWeight: "500",
  },
  scrollContent: {
    paddingVertical: 5,
    paddingRight: 20,
  },
  productCard: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 3,
  },
  productImageContainer: {
    position: 'relative',
    height: 150,
    backgroundColor: '#f8f8f8',
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  favoriteButton: {
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
  activeFavoriteButton: {
    backgroundColor: '#e91e63',
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saleBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#3e7d32",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffa000',
    marginRight: 5,
  },
  ratingText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 4,
  },
  addToCartButton: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  darkAddToCartButton: {
    backgroundColor: '#1e3320',
  },
  cartIcon: {
    marginRight: 6,
  },
  addToCartText: {
    color: '#3e7d32',
    fontWeight: '600',
    fontSize: 13,
  },
  darkAddToCartText: {
    color: '#8bc34a',
  },
  darkSection: {
    backgroundColor: "#121212",
  },
  darkCard: {
    backgroundColor: "#333",
  },
  darkText: {
    color: "#fff",
  },
  darkSubtext: {
    color: "#aaa",
  },
  darkPrimaryText: {
    color: "#8bc34a",
  },
});

export default FeaturedProducts;