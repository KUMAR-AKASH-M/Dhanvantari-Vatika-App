import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface SearchResultItem {
  id: string;
  name: string;
  image: any;
  type: 'herb' | 'product' | 'remedy' | 'article' | 'category';
  description?: string;
  scientificName?: string;
  price?: string;
  category?: string;
  data: any; // The original data object
}

interface SearchResultsCardProps {
  results: SearchResultItem[];
  isDarkMode: boolean;
  onResultPress: (item: SearchResultItem) => void;
  onClearSearch: () => void;
  visible: boolean;
}

const SearchResultsCard = ({ 
  results, 
  isDarkMode, 
  onResultPress,
  onClearSearch,
  visible
}: SearchResultsCardProps) => {
  if (!visible || results.length === 0) return null;
  
  const getIconName = (type: string) => {
    switch (type) {
      case 'herb': return 'leaf-outline';
      case 'product': return 'cart-outline';
      case 'remedy': return 'flask-outline';
      case 'article': return 'newspaper-outline';
      case 'category': return 'grid-outline';
      default: return 'search-outline';
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'herb': return 'Herb';
      case 'product': return 'Product';
      case 'remedy': return 'Remedy';
      case 'article': return 'Article';
      case 'category': return 'Category';
      default: return 'Item';
    }
  };

  return (
    <View style={[
      styles.container, 
      isDarkMode ? styles.darkContainer : styles.lightContainer
    ]}>
      <View style={[
        styles.header, 
        isDarkMode ? styles.darkHeader : styles.lightHeader
      ]}>
        <Text style={[styles.resultsTitle, isDarkMode && styles.darkText]}>
          {`Search Results (${results.length.toString()})`}
        </Text>
        <TouchableOpacity onPress={onClearSearch} style={styles.closeButton}>
          <Ionicons 
            name="close" 
            size={20} 
            color={isDarkMode ? "#ccc" : "#666"} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {results.map((item) => (
          <TouchableOpacity
            key={`${item.type}-${item.id}`}
            style={[
              styles.resultItem,
              isDarkMode ? styles.darkResultItem : styles.lightResultItem
            ]}
            onPress={() => onResultPress(item)}
          >
            {item.image && (
              <Image 
                source={item.image} 
                style={styles.itemImage} 
                resizeMode="cover"
              />
            )}
            <View style={styles.itemContent}>
              <Text 
                style={[styles.itemName, isDarkMode && styles.darkText]}
                numberOfLines={1}
              >
                {(item.name || '').toString()}
              </Text>
              <Text 
                style={[styles.itemDescription, isDarkMode && styles.darkMutedText]}
                numberOfLines={1}
              >
                {(item.description || item.scientificName || item.category || getTypeLabel(item.type) || '').toString()}
              </Text>
            </View>
            <View style={[
              styles.itemType,
              isDarkMode ? styles.darkItemType : styles.lightItemType
            ]}>
              <Ionicons 
                name={getIconName(item.type)} 
                size={18} 
                color={isDarkMode ? "#aaa" : "#3e7d32"} 
              />
              <Text style={[styles.itemTypeText, isDarkMode && styles.darkMutedText]}>
                {getTypeLabel(item.type).toString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 350,
    borderRadius: 8,
    zIndex: 999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Remove position: 'absolute' and top position since we're handling that in the parent
  },
  lightContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  darkContainer: {
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  lightHeader: {
    borderBottomColor: '#eee',
  },
  darkHeader: {
    borderBottomColor: '#333',
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: 300,
  },
  scrollContent: {
    paddingVertical: 4,
  },
  resultItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  lightResultItem: {
    borderBottomColor: '#f0f0f0',
  },
  darkResultItem: {
    borderBottomColor: '#333',
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
  },
  itemType: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 8,
    paddingLeft: 8,
    borderLeftWidth: 1,
  },
  lightItemType: {
    borderLeftColor: '#eee',
  },
  darkItemType: {
    borderLeftColor: '#333',
  },
  itemTypeText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
});

export default SearchResultsCard;
