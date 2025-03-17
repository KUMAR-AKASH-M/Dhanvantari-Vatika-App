import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Image,
  PanResponder
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../context/OrderContext';
import CheckoutModal from './checkout/CheckoutModal';

interface CartItem {
  name: string;
  price: string;
  image: any;
  quantity: number;
}

interface CartModalProps {
  visible: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (item: CartItem, newQuantity: number) => void;
  onRemoveItem: (item: CartItem) => void;
  onCheckout: () => void;
  isDarkMode: boolean;
}

const { height } = Dimensions.get('window');

const CartModal = ({ 
  visible, 
  cartItems, 
  onClose, 
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isDarkMode 
}: CartModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Use orders context
  const { addOrder } = useOrders();

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Remove currency symbol and convert to number
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + price * item.quantity;
    }, 0);
  };

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
          speed: 14,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          delay: 200,
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

  // State for checkout modal
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

  // Render cart item
  const renderCartItem = (item: CartItem, index: number) => {
    return (
      <View 
        key={`${item.name}-${index}`} 
        style={[styles.cartItem, isDarkMode && styles.darkCartItem]}
      >
        <Image source={item.image} style={styles.itemImage} />
        
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, isDarkMode && styles.darkText]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.itemPrice, isDarkMode && styles.darkPrimaryText]}>
            {item.price}
          </Text>
        </View>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.quantityButton, isDarkMode && styles.darkQuantityButton]}
            onPress={() => onUpdateQuantity(item, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Ionicons 
              name="remove" 
              size={18} 
              color={item.quantity > 1 ? (isDarkMode ? "#fff" : "#333") : "#ccc"} 
            />
          </TouchableOpacity>
          
          <Text style={[styles.quantityText, isDarkMode && styles.darkText]}>
            {item.quantity}
          </Text>
          
          <TouchableOpacity 
            style={[styles.quantityButton, isDarkMode && styles.darkQuantityButton]}
            onPress={() => onUpdateQuantity(item, item.quantity + 1)}
          >
            <Ionicons name="add" size={18} color={isDarkMode ? "#fff" : "#333"} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => onRemoveItem(item)}
          >
            <Ionicons name="trash-outline" size={18} color="#e53935" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Calculate total for order
    const totalAmount = (calculateTotal() + 50).toFixed(2);
    const formattedTotal = `₹${totalAmount}`;
    
    // Add to orders via context
    const newOrder = addOrder(cartItems, formattedTotal);
    
    // Execute original onCheckout callback
    if (onCheckout) {
      onCheckout();
    }
    
    // Show confirmation and close modal
    alert(`Order placed successfully!\nOrder #: ${newOrder.orderNumber}`);
    onClose();
  };

  const handleCheckoutPress = () => {
    setCheckoutModalVisible(true);
  };
  
  const handleOrderPlaced = () => {
    // Clear cart after successful order
    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <>
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
                Your Cart
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons 
                  name="close" 
                  size={24} 
                  color={isDarkMode ? "#fff" : "#333"} 
                />
              </TouchableOpacity>
            </View>

            {/* Cart content */}
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              {cartItems.length > 0 ? (
                <>
                  <ScrollView style={styles.itemsContainer}>
                    {cartItems.map((item, index) => renderCartItem(item, index))}
                  </ScrollView>
                  
                  <View style={[styles.cartSummary, isDarkMode && styles.darkCartSummary]}>
                    <View style={styles.summaryRow}>
                      <Text style={[styles.summaryLabel, isDarkMode && styles.darkText]}>
                        Subtotal
                      </Text>
                      <Text style={[styles.summaryValue, isDarkMode && styles.darkText]}>
                        ₹{calculateTotal().toFixed(2)}
                      </Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                      <Text style={[styles.summaryLabel, isDarkMode && styles.darkText]}>
                        Shipping
                      </Text>
                      <Text style={[styles.summaryValue, isDarkMode && styles.darkText]}>
                        ₹50.00
                      </Text>
                    </View>
                    
                    <View style={styles.summaryDivider} />
                    
                    <View style={styles.summaryRow}>
                      <Text style={[styles.totalLabel, isDarkMode && styles.darkText]}>
                        Total
                      </Text>
                      <Text style={[styles.totalValue, isDarkMode && styles.darkPrimaryText]}>
                        ₹{(calculateTotal() + 50).toFixed(2)}
                      </Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.checkoutButton}
                      onPress={handleCheckoutPress}
                    >
                      <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                      <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.checkoutIcon} />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.emptyCartContainer}>
                  <Ionicons 
                    name="cart-outline" 
                    size={80} 
                    color={isDarkMode ? "#555" : "#ccc"} 
                  />
                  <Text style={[styles.emptyCartText, isDarkMode && styles.darkText]}>
                    Your cart is empty
                  </Text>
                  <Text style={[styles.emptyCartSubText, isDarkMode && styles.darkSubtext]}>
                    Add some products to your cart to see them here
                  </Text>
                  <TouchableOpacity 
                    style={styles.shopButton}
                    onPress={onClose}
                  >
                    <Text style={styles.shopButtonText}>
                      Continue Shopping
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </Animated.View>
        </View>
      </Modal>
      
      {/* Checkout Modal */}
      <CheckoutModal 
        visible={checkoutModalVisible}
        onClose={() => setCheckoutModalVisible(false)}
        cartItems={cartItems}
        cartTotal={`₹${(calculateTotal() + 50).toFixed(2)}`}
        onOrderPlaced={handleOrderPlaced}
        isDarkMode={isDarkMode}
      />
    </>
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
    height: '80%',
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
  content: {
    flex: 1,
  },
  itemsContainer: {
    flex: 1,
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkCartItem: {
    backgroundColor: '#2a2a2a',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3e7d32',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkQuantityButton: {
    backgroundColor: '#333',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 10,
    color: '#333',
  },
  removeButton: {
    marginLeft: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartSummary: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  darkCartSummary: {
    backgroundColor: '#1a1a1a',
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3e7d32',
  },
  checkoutButton: {
    backgroundColor: '#3e7d32',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkoutIcon: {
    marginLeft: 8,
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyCartSubText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#3e7d32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkSubtext: {
    color: '#aaa',
  },
  darkPrimaryText: {
    color: '#8bc34a',
  },
});

export default CartModal;
