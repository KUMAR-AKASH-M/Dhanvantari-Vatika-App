import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Image,
  Modal,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

// Fallback data in case no orders are passed
const DEFAULT_ORDERS = [];

const OrdersModal = ({ visible, toggleModal, slideAnimation, isDarkMode, orders = DEFAULT_ORDERS }) => {
  const renderOrderItem = ({ item }) => (
    <View style={[styles.orderItem, isDarkMode && styles.darkOrderItem]}>
      <Image source={{ uri: item.image }} style={styles.orderImage} />
      <View style={styles.orderDetails}>
        <Text style={[styles.orderNumber, isDarkMode && styles.darkText]}>
          {item.orderNumber}
        </Text>
        <Text style={[styles.orderDate, isDarkMode && styles.darkMutedText]}>
          {item.date} • {item.items} item{item.items > 1 ? 's' : ''}
        </Text>
        <Text style={[styles.orderTotal, isDarkMode && styles.darkText]}>
          {item.total}
        </Text>
      </View>
      <View style={styles.orderStatus}>
        <Text style={[styles.statusText, { color: item.statusColor }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  const noOrdersView = (
    <View style={styles.noItemsContainer}>
      <Ionicons 
        name="cart-outline" 
        size={60} 
        color={isDarkMode ? "#555" : "#ccc"} 
      />
      <Text style={[styles.noItemsText, isDarkMode && styles.darkText]}>
        No orders yet
      </Text>
      <Text style={[styles.noItemsSubText, isDarkMode && styles.darkMutedText]}>
        Your orders will appear here when you make a purchase
      </Text>
    </View>
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => toggleModal(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => toggleModal(false)}
        />
        <Animated.View 
          style={[
            styles.modalContainer, 
            isDarkMode && styles.darkModalContainer,
            { transform: [{ translateY: slideAnimation }] }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
              My Orders ({orders.length})
            </Text>
            <TouchableOpacity onPress={() => toggleModal(false)}>
              <Ionicons name="close" size={24} color={isDarkMode ? "#fff" : "#333"} />
            </TouchableOpacity>
          </View>

          <View style={styles.ordersList}>
            {orders.length === 0 ? (
              noOrdersView
            ) : (
              <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.ordersListContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          {orders.length > 0 && (
            <TouchableOpacity 
              style={[styles.viewAllButton, isDarkMode && styles.darkViewAllButton]}
              onPress={() => toggleModal(false)}
            >
              <Text style={styles.viewAllText}>View All Orders</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    maxHeight: '90%', // Increased from 75% to 90%
    minHeight: '80%', // Added minimum height
  },
  darkModalContainer: {
    backgroundColor: '#2a2a2a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
  ordersList: {
    flex: 1,
    minHeight: 300, // Added minimum height for content area
  },
  ordersListContent: {
    paddingBottom: 24, // Increased bottom padding
    paddingTop: 8,     // Added top padding
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  darkOrderItem: {
    backgroundColor: '#333',
    borderBottomColor: '#444',
  },
  orderImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  orderDetails: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderStatus: {
    marginLeft: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  viewAllButton: {
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  darkViewAllButton: {
    backgroundColor: 'rgba(62, 125, 50, 0.2)',
  },
  viewAllText: {
    color: '#3e7d32',
    fontSize: 15,
    fontWeight: '500',
  },
  noItemsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noItemsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
  },
  noItemsSubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  }
});

export default OrdersModal;
