import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../context/OrderContext';
import { useStripe, CardFieldInput } from '@stripe/stripe-react-native';

import StepIndicator, { CHECKOUT_STEPS } from './StepIndicator';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import OrderConfirmation from './OrderConfirmation';

const { height } = Dimensions.get('window');

interface CheckoutModalProps {
  visible: boolean;
  onClose: () => void;
  cartItems: any[];
  cartTotal: string;
  onOrderPlaced: () => void;
  isDarkMode: boolean;
}

const CheckoutModal = ({ 
  visible, 
  onClose, 
  cartItems = [], 
  cartTotal,
  onOrderPlaced,
  isDarkMode 
}: CheckoutModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [currentStep, setCurrentStep] = useState(CHECKOUT_STEPS.SHIPPING);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const { addOrder } = useOrders();
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Stripe integration - fix card details state
  const { confirmPayment, createPaymentMethod } = useStripe();
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(null);

  // Debug card details
  useEffect(() => {
    if (cardDetails) {
      console.log('Card validation state:', cardDetails.complete);
    }
  }, [cardDetails]);

  // Animation logic
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 5,
        speed: 14,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Reset state when modal is closed
      setTimeout(() => {
        setCurrentStep(CHECKOUT_STEPS.SHIPPING);
        setOrderConfirmed(false);
      }, 300);
    }
  }, [visible]);
  
  // Validate shipping info
  const validateShippingInfo = () => {
    const { name, email, phone, address, city, state, zipCode } = shippingInfo;
    if (!name || !email || !phone || !address || !city || !state || !zipCode) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return false;
    }
    
    // Add email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  // Handle continue to payment
  const handleContinueToPayment = () => {
    if (validateShippingInfo()) {
      setCurrentStep(CHECKOUT_STEPS.PAYMENT);
    }
  };
  
  // Handle input change
  const handleInputChange = (field, value) => {
    setShippingInfo({
      ...shippingInfo,
      [field]: value
    });
  };
  
  // Handle back to shipping
  const handleBackToShipping = () => {
    setCurrentStep(CHECKOUT_STEPS.SHIPPING);
  };
  
  // Fixed card details handler
  const handleCardChange = (cardDetails: CardFieldInput.Details) => {
    console.log('Card changed:', cardDetails);
    setCardDetails(cardDetails);
  };
  
  // Process payment with bypass for testing
  const handlePayment = async () => {
    console.log('Payment attempted with card details:', cardDetails);
    
    // NOTE: TEMPORARY WORKAROUND FOR TESTING
    // This bypasses proper card validation and should NOT be used in production
    
    setIsProcessing(true);
    
    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Skip actual payment processing and simulate success
      console.log('DEVELOPMENT MODE: Bypassing actual payment processing');
      
      // Create a new order and get the order object back
      const orderData = addOrder(cartItems, cartTotal);
      
      // Generate an order ID for demonstration purposes
      const generatedOrderId = `ORD-${Date.now().toString().slice(-6)}`;
      setOrderId(generatedOrderId);
      
      setIsProcessing(false);
      setOrderConfirmed(true);
      setCurrentStep(CHECKOUT_STEPS.CONFIRMATION);
      
      if (onOrderPlaced) {
        onOrderPlaced();
      }
      
      /* COMMENTED OUT REAL IMPLEMENTATION - RESTORE FOR PRODUCTION
      
      // Real validation
      if (!cardDetails || !cardDetails.complete) {
        Alert.alert(
          'Invalid Card', 
          'Please enter a valid card number, expiration date, and CVC.\n\nFor testing, use card: 4242 4242 4242 4242, exp: any future date, CVC: any 3 digits'
        );
        setIsProcessing(false);
        return;
      }
      
      // Create payment method using Stripe SDK
      const { paymentMethod, error } = await createPaymentMethod({
        type: 'Card',
        billingDetails: {
          name: shippingInfo.name,
          email: shippingInfo.email,
        }
      });
      
      if (error) {
        console.log('Payment method error', error);
        Alert.alert('Payment Error', error.message);
        setIsProcessing(false);
        return;
      }

      // Calculate amount in cents
      const amountInCents = Math.round(parseFloat(cartTotal.replace(/[^0-9.]/g, '')) * 100);
      
      // Connect to backend API to create payment intent
      const response = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInCents,
          currency: 'inr',
          paymentMethodId: paymentMethod.id,
          description: `Order for ${shippingInfo.name}`,
        }),
      });

      const paymentData = await response.json();
      
      if (paymentData.error) {
        console.log('Payment intent error:', paymentData.error);
        Alert.alert('Payment Error', paymentData.error.message);
        setIsProcessing(false);
        return;
      }
      
      // Confirm the payment with the client secret
      const { error: confirmError } = await confirmPayment(paymentData.clientSecret, {
        paymentMethodType: 'Card',
      });
      
      if (confirmError) {
        console.log('Payment confirmation error:', confirmError);
        Alert.alert('Payment Error', confirmError.message);
        setIsProcessing(false);
        return;
      }
      */
      
    } catch (error) {
      console.error('Payment processing error:', error);
      
      // For testing purposes, still show success even on errors
      addOrder(cartItems, cartTotal);
      const generatedOrderId = `ORD-${Date.now().toString().slice(-6)}`;
      setOrderId(generatedOrderId);
      setIsProcessing(false);
      setOrderConfirmed(true);
      setCurrentStep(CHECKOUT_STEPS.CONFIRMATION);
      if (onOrderPlaced) {
        onOrderPlaced();
      }
      
      // Comment out actual error handling for now
      // Alert.alert('Payment Error', 'There was an error processing your payment. Please try again.');
      // setIsProcessing(false);
    }
  };

  // Get proper image string URI from cart items
  const getOrderImageUri = (items) => {
    if (!items || items.length === 0) {
      return 'https://placehold.co/200x200/png?text=Order';
    }

    try {
      const firstItem = items[0];
      if (!firstItem || !firstItem.image) {
        return 'https://placehold.co/200x200/png?text=Order';
      }

      // Handle string URIs
      if (typeof firstItem.image === 'string') {
        return firstItem.image;
      }

      // Handle object with uri property
      if (typeof firstItem.image === 'object' && firstItem.image !== null) {
        // @ts-ignore - we're doing runtime type checking
        if (firstItem.image.uri) {
          // @ts-ignore
          return firstItem.image.uri;
        }
      }

      return 'https://placehold.co/200x200/png?text=Order';
    } catch (error) {
      console.error('Error extracting image URI:', error);
      return 'https://placehold.co/200x200/png?text=Order';
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity 
          style={styles.overlayBackground} 
          onPress={onClose}
          activeOpacity={0.7}
          disabled={isProcessing || orderConfirmed}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer, 
            isDarkMode && styles.darkModalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.dragIndicatorContainer}>
            <View style={[styles.dragIndicator, isDarkMode && styles.darkDragIndicator]} />
          </View>
          
          <View style={[styles.header, isDarkMode && styles.darkHeader]}>
            <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
              {currentStep === CHECKOUT_STEPS.SHIPPING ? "Shipping Information" : 
               currentStep === CHECKOUT_STEPS.PAYMENT ? "Payment Method" : 
               "Order Confirmation"}
            </Text>
            {!isProcessing && !orderConfirmed && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons 
                  name="close" 
                  size={24} 
                  color={isDarkMode ? "#fff" : "#333"} 
                />
              </TouchableOpacity>
            )}
          </View>
          
          {!orderConfirmed && (
            <StepIndicator 
              currentStep={currentStep} 
              isDarkMode={isDarkMode} 
            />
          )}
          
          {currentStep === CHECKOUT_STEPS.SHIPPING && (
            <ShippingForm
              shippingInfo={shippingInfo}
              handleInputChange={handleInputChange}
              handleContinueToPayment={handleContinueToPayment}
              isDarkMode={isDarkMode}
            />
          )}
          
          {currentStep === CHECKOUT_STEPS.PAYMENT && (
            <PaymentForm
              cartItems={cartItems}
              cartTotal={cartTotal}
              setCardDetails={handleCardChange}
              handleBackToShipping={handleBackToShipping}
              handlePayment={handlePayment}
              isProcessing={isProcessing}
              isDarkMode={isDarkMode}
            />
          )}
          
          {currentStep === CHECKOUT_STEPS.CONFIRMATION && (
            <OrderConfirmation
              orderId={orderId}
              email={shippingInfo.email}
              onClose={onClose}
              isDarkMode={isDarkMode}
              orderImage={getOrderImageUri(cartItems)}
            />
          )}
        </Animated.View>
      </KeyboardAvoidingView>
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
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  darkText: {
    color: '#f0f0f0',
  },
});

export default CheckoutModal;
