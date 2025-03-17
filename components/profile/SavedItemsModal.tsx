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

// Fallback data in case no saved items are passed
const DEFAULT_SAVED_ITEMS = [];

const SavedItemsModal = ({ 
  visible, 
  toggleModal, 
  slideAnimation, 
  isDarkMode, 
  savedItems = DEFAULT_SAVED_ITEMS,
  onAddToCart,
  onRemoveItem
}) => {
  // Debug log to check received items
  console.log('SavedItemsModal received items:', savedItems);

  const renderSavedItem = ({ item }) => (
    <View style={[styles.savedItem, isDarkMode && styles.darkSavedItem]}>
      {/* Improved image handling to work with both string URIs and URI objects */}
      <Image 
        source={
          typeof item.image === 'string' 
            ? { uri: item.image } 
            : (item.image?.uri ? item.image : { uri: 'https://placehold.co/60x60/png?text=Item' })
        } 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, isDarkMode && styles.darkText]}>
          {item.name}
        </Text>
        <Text style={[styles.itemCategory, isDarkMode && styles.darkMutedText]}>
          {item.category || 'Uncategorized'}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[styles.itemPrice, isDarkMode && styles.darkText]}>
            {item.price || ''}
          </Text>
          {item.discount ? (
            <Text style={styles.itemDiscount}>
              {item.discount}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={() => onAddToCart(item)}
        >
          <Text style={styles.addToCartText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.removeButton, isDarkMode && styles.darkRemoveButton]}
          onPress={() => onRemoveItem(item.id)}
        >
          <Ionicons name="close" size={16} color={isDarkMode ? "#aaa" : "#777"} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const noItemsView = (
    <View style={styles.noItemsContainer}>
      <Ionicons 
        name="heart-outline" 
        size={60} 
        color={isDarkMode ? "#555" : "#ccc"} 
      />
      <Text style={[styles.noItemsText, isDarkMode && styles.darkText]}>
        No saved items
      </Text>
      <Text style={[styles.noItemsSubText, isDarkMode && styles.darkMutedText]}>
        Items you save will appear here
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
              Saved Items ({savedItems.length})
            </Text>
            <TouchableOpacity onPress={() => toggleModal(false)}>
              <Ionicons name="close" size={24} color={isDarkMode ? "#fff" : "#333"} />
            </TouchableOpacity>
          </View>

          <View style={styles.savedItemsList}>
            {savedItems.length === 0 ? (
              noItemsView
            ) : (
              <FlatList
                data={savedItems}
                renderItem={renderSavedItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.savedItemsListContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          {savedItems.length > 0 && (
            <TouchableOpacity 
              style={[styles.viewAllButton, isDarkMode && styles.darkViewAllButton]}
              onPress={() => toggleModal(false)}
            >
              <Text style={styles.viewAllText}>Add All to Cart</Text>
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
    minHeight: '80%',  // Added minimum height
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
  savedItemsList: {
    flex: 1,
    minHeight: 300, // Added minimum height for content area
  },
  savedItemsListContent: {
    paddingBottom: 24, // Increased bottom padding
    paddingTop: 8,     // Added top padding
  },
  savedItem: {
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
  darkSavedItem: {
    backgroundColor: '#333',
    borderBottomColor: '#444',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  itemDiscount: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
  },
  addToCartButton: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  addToCartText: {
    color: '#3e7d32',
    fontSize: 12,
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
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  removeButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  darkRemoveButton: {
    backgroundColor: '#444',
  },
});

export default SavedItemsModal;
