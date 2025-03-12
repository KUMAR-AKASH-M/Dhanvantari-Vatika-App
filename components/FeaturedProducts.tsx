import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Product {
  name: string;
  price: string;
  image: any;
  rating: number;
  reviews: number;
}

interface FeaturedProductsProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  onSeeAllPress: () => void;
  isDarkMode: boolean; // Add isDarkMode prop
}

const FeaturedProducts = ({ products, onProductPress, onSeeAllPress, isDarkMode }: FeaturedProductsProps) => {
  return (
    <View style={[styles.section, isDarkMode && styles.darkSection]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Featured Products</Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={[styles.seeAll, isDarkMode && styles.darkText]}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.productCard, isDarkMode && styles.darkCard]}
            onPress={() => onProductPress(product)}
          >
            <View style={styles.productImageContainer}>
              <Image source={product.image} style={styles.productImage} />
              <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons name="heart-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.productInfo}>
              <Text style={[styles.productName, isDarkMode && styles.darkText]}>{product.name}</Text>
              <Text style={[styles.productPrice, isDarkMode && styles.darkText]}>{product.price}</Text>
              <View style={styles.ratingContainer}>
                <Text style={[styles.ratingValue, isDarkMode && styles.darkText]}>{product.rating}</Text>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star} 
                    name={star <= Math.floor(product.rating) ? "star" : "star-outline"} 
                    size={14} 
                    color="#ffc107" 
                  />
                ))}
                <Text style={[styles.ratingText, isDarkMode && styles.darkText]}>({product.reviews})</Text>
              </View>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={[styles.addToCartText, isDarkMode && styles.darkText]}>Add to Cart</Text>
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
  },
  productImage: {
    width: "100%",
    height: "100%",
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
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  addToCartText: {
    color: '#3e7d32',
    fontWeight: '600',
    fontSize: 13,
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
});

export default FeaturedProducts;