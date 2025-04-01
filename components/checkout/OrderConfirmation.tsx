import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OrderConfirmationProps {
  orderId: string;
  email: string;
  onClose: () => void;
  isDarkMode: boolean;
  orderImage?: string | object | null; // Updated type to handle different image formats
}

const OrderConfirmation = ({ 
  orderId, 
  email, 
  onClose,
  isDarkMode,
  orderImage = 'https://placehold.co/200x200/png?text=Order'
}: OrderConfirmationProps) => {
  
  // Function to safely get image URI
  const getImageSource = () => {
    try {
      // Handle different image source formats
      if (!orderImage) {
        return { uri: 'https://placehold.co/200x200/png?text=Order' };
      }
      
      // If orderImage is already a string URI
      if (typeof orderImage === 'string') {
        return { uri: orderImage };
      }
      
      // If it's an object with uri property
      if (typeof orderImage === 'object' && orderImage !== null) {
        // @ts-ignore - we're doing runtime type checking
        if (orderImage.uri) {
          // @ts-ignore
          return { uri: orderImage.uri };
        }
      }
      
      // Default fallback
      return { uri: 'https://placehold.co/200x200/png?text=Order' };
    } catch (error) {
      console.error('Error parsing image source:', error);
      return { uri: 'https://placehold.co/200x200/png?text=Order' };
    }
  };

  return (
    <View style={styles.confirmationContainer}>
      <View style={styles.successIconContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#4caf50" />
      </View>
      
      {/* Order image with safe source handling */}
      <View style={styles.orderImageContainer}>
        <Image 
          source={getImageSource()}
          style={styles.orderImage} 
          resizeMode="cover"
        />
      </View>
      
      <Text style={[styles.confirmationTitle, isDarkMode && styles.darkText]}>
        Order Confirmed!
      </Text>
      
      <Text style={[styles.confirmationOrderNumber, isDarkMode && styles.darkText]}>
        Order Number: {orderId}
      </Text>
      
      <Text style={[styles.confirmationText, isDarkMode && styles.darkMutedText]}>
        Thank you for your purchase. We have sent a confirmation email to {email}
      </Text>
      
      <Text style={[styles.confirmationText, isDarkMode && styles.darkMutedText]}>
        Your items will be shipped within 2-3 business days.
      </Text>
      
      <TouchableOpacity 
        style={styles.continueShoppingButton}
        onPress={onClose}
      >
        <Text style={styles.continueShoppingText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  confirmationOrderNumber: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  continueShoppingButton: {
    backgroundColor: '#3e7d32',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 30,
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
  orderImageContainer: {
    marginVertical: 16,
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderImage: {
    width: '100%',
    height: '100%',
  },
});

export default OrderConfirmation;
