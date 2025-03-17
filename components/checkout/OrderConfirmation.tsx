import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OrderConfirmationProps {
  orderId: string;
  email: string;
  onClose: () => void;
  isDarkMode: boolean;
}

const OrderConfirmation = ({ 
  orderId, 
  email, 
  onClose,
  isDarkMode 
}: OrderConfirmationProps) => {
  return (
    <View style={styles.confirmationContainer}>
      <View style={styles.successIconContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#4caf50" />
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
});

export default OrderConfirmation;
