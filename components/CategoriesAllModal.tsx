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
  PanResponder
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Category {
  name: string;
  icon: string;
  image: any;
  description?: string;
  featured?: boolean;
}

interface CategoriesAllModalProps {
  visible: boolean;
  categories: Category[];
  onClose: () => void;
  onCategoryPress: (category: Category) => void;
  isDarkMode: boolean;
}

const { height, width } = Dimensions.get('window');

const CategoriesAllModal = ({ 
  visible, 
  categories, 
  onClose, 
  onCategoryPress, 
  isDarkMode 
}: CategoriesAllModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  
  // Add pan responder for swipe-to-close functionality
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical gestures
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward swipes (positive dy)
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If user swiped down more than 150px, close the modal
        if (gestureState.dy > 150) {
          Animated.timing(slideAnim, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          // Otherwise, snap back to fully open
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
        }
      },
    })
  ).current;
  
  // Apply search and filter
  useEffect(() => {
    let result = categories;
    
    // Apply search
    if (searchQuery) {
      result = result.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filter
    if (activeFilter === 'featured') {
      result = result.filter(cat => cat.featured);
    }
    
    setFilteredCategories(result);
  }, [searchQuery, activeFilter, categories]);
  
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
    }
  }, [visible]);

  // Card for featured categories (larger)
  const renderFeaturedCard = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.featuredCard, isDarkMode && styles.darkFeaturedCard]}
      onPress={() => {
        onCategoryPress(item);
        onClose();
      }}
      activeOpacity={0.9}
    >
      <Image source={item.image} style={styles.featuredCardImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredCardGradient}
      />
      <View style={styles.featuredCardContent}>
        <Text style={styles.featuredCardTitle}>{item.name}</Text>
        <View style={styles.featuredCardTag}>
          <Ionicons name={item.icon} size={12} color="#fff" />
          <Text style={styles.featuredCardTagText}>Traditional Medicine</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Card for regular grid
  const renderGridCard = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.gridCard, isDarkMode && styles.darkGridCard]}
      onPress={() => {
        onCategoryPress(item);
        onClose();
      }}
      activeOpacity={0.8}
    >
      <View style={styles.gridImageContainer}>
        <Image source={item.image} style={styles.gridCardImage} />
        <View style={styles.gridIconOverlay}>
          <Ionicons name={item.icon} size={18} color="#fff" />
        </View>
      </View>
      <Text style={[styles.gridCardTitle, isDarkMode && styles.darkText]}>
        {item.name}
      </Text>
      <Text style={[styles.gridCardSubtitle, isDarkMode && styles.darkSubtext]}>
        Traditional
      </Text>
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
          {/* Drag indicator for sliding */}
          <View style={styles.dragIndicatorContainer} {...panResponder.panHandlers}>
            <View style={[styles.dragIndicator, isDarkMode && styles.darkDragIndicator]} />
          </View>
          
          {/* Header */}
          <View style={[styles.header, isDarkMode && styles.darkHeader]}>
            <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
              All Categories
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
              placeholder="Search categories..."
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
          
          {/* Filter tabs */}
          <View style={[styles.filterContainer, isDarkMode && styles.darkFilterContainer]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                  All Categories
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
                  activeFilter === 'ancient' && styles.activeFilterChip,
                  activeFilter === 'ancient' && isDarkMode && styles.darkActiveFilterChip,
                ]}
                onPress={() => setActiveFilter('ancient')}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    isDarkMode && styles.darkChipText,
                    activeFilter === 'ancient' && styles.activeFilterChipText,
                  ]}
                >
                  Ancient Systems
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  isDarkMode && styles.darkFilterChip,
                  activeFilter === 'modern' && styles.activeFilterChip,
                  activeFilter === 'modern' && isDarkMode && styles.darkActiveFilterChip,
                ]}
                onPress={() => setActiveFilter('modern')}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    isDarkMode && styles.darkChipText,
                    activeFilter === 'modern' && styles.activeFilterChipText,
                  ]}
                >
                  Modern Systems
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          {/* Content */}
          <Animated.View 
            style={[styles.content, { opacity: fadeAnim }]}
          >
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
              {/* Featured section (if not filtered) */}
              {activeFilter !== 'featured' && filteredCategories.some(cat => cat.featured) && (
                <View style={styles.featuredSection}>
                  <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
                    Featured Categories
                  </Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.featuredCardsContainer}
                  >
                    {filteredCategories
                      .filter(cat => cat.featured)
                      .map((category, index) => (
                        <View key={index} style={{ marginRight: index < filteredCategories.length - 1 ? 15 : 0 }}>
                          {renderFeaturedCard({ item: category })}
                        </View>
                      ))
                    }
                  </ScrollView>
                </View>
              )}
              
              {/* Grid view of categories */}
              <View style={styles.gridSection}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
                  {searchQuery ? 'Search Results' : 
                    activeFilter === 'all' ? 'All Categories' :
                    activeFilter === 'featured' ? 'Featured Categories' :
                    `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Categories`}
                </Text>
                
                {filteredCategories.length > 0 ? (
                  <View style={styles.gridContainer}>
                    {filteredCategories.map((category, index) => (
                      <View key={index} style={styles.gridItem}>
                        {renderGridCard({ item: category })}
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Ionicons 
                      name="search-outline" 
                      size={50} 
                      color={isDarkMode ? "#555" : "#ccc"} 
                    />
                    <Text style={[styles.noResultsText, isDarkMode && styles.darkText]}>
                      No categories found
                    </Text>
                    <Text style={[styles.noResultsSubText, isDarkMode && styles.darkSubtext]}>
                      Try a different search term or filter
                    </Text>
                  </View>
                )}
              </View>
              
              {/* Hint about categories */}
              <View style={[styles.hintCard, isDarkMode && styles.darkHintCard]}>
                <View style={styles.hintIcon}>
                  <Ionicons name="information-circle" size={24} color={isDarkMode ? "#8bc34a" : "#3e7d32"} />
                </View>
                <Text style={[styles.hintText, isDarkMode && styles.darkText]}>
                  Tap on any category to explore detailed information about traditional medicine systems and practices.
                </Text>
              </View>
            </ScrollView>
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
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 10,
  },
  darkModalContainer: {
    backgroundColor: '#121212',
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: '#fff',
  },
  darkFilterContainer: {
    backgroundColor: '#1A1A1A',
    borderBottomColor: 'rgba(255,255,255,0.05)',
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
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  featuredSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
    color: '#333',
  },
  featuredCardsContainer: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    width: 220,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    // Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  darkFeaturedCard: {
    backgroundColor: '#2a2a2a',
  },
  featuredCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredCardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  featuredCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  featuredCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuredCardTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(62,125,50,0.8)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  featuredCardTagText: {
    fontSize: 10,
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  gridSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginTop: 5,
  },
  gridItem: {
    width: '33.33%',
    padding: 5,
  },
  gridCard: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkGridCard: {
    backgroundColor: '#2a2a2a',
  },
  gridImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  gridCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gridIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(62,125,50,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  gridCardSubtitle: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  noResultsContainer: {
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
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    marginHorizontal: 20,
    marginBottom: 30,
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3e7d32',
  },
  darkHintCard: {
    backgroundColor: '#2a2a2a',
    borderLeftColor: '#8bc34a',
  },
  hintIcon: {
    marginRight: 12,
  },
  hintText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
    lineHeight: 18,
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
});

export default CategoriesAllModal;
