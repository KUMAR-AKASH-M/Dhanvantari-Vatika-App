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
  PanResponder,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ArticleType } from './ArticleCard';
import ArticleCard from './ArticleCard';

const { height, width } = Dimensions.get('window');

interface ArticlesAllModalProps {
  visible: boolean;
  articles: ArticleType[];
  onClose: () => void;
  onArticlePress: (article: ArticleType) => void;
  isDarkMode: boolean;
}

const ArticlesAllModal = ({ 
  visible, 
  articles, 
  onClose, 
  onArticlePress, 
  isDarkMode 
}: ArticlesAllModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState(articles);
  
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
    let result = articles;
    
    // Apply search
    if (searchQuery) {
      result = result.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filter (if we had categories for articles)
    if (activeFilter === 'latest') {
      // Assume latest is based on publishedDate
      result = [...result].sort((a, b) => {
        // Simple string comparison will work if dates are in a consistent format
        return a.publishedDate.localeCompare(b.publishedDate);
      });
    } else if (activeFilter === 'popular') {
      // For this example, we'll just use the order as is
      // In a real app, this would sort by popularity metrics
    }
    
    setFilteredArticles(result);
  }, [searchQuery, activeFilter, articles]);
  
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
          {/* Drag indicator */}
          <View style={styles.dragIndicatorContainer} {...panResponder.panHandlers}>
            <View style={[styles.dragIndicator, isDarkMode && styles.darkDragIndicator]} />
          </View>
          
          {/* Header */}
          <View style={[styles.header, isDarkMode && styles.darkHeader]}>
            <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
              All Articles
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
              placeholder="Search articles..."
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
                  All Articles
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  isDarkMode && styles.darkFilterChip,
                  activeFilter === 'latest' && styles.activeFilterChip,
                  activeFilter === 'latest' && isDarkMode && styles.darkActiveFilterChip,
                ]}
                onPress={() => setActiveFilter('latest')}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    isDarkMode && styles.darkChipText,
                    activeFilter === 'latest' && styles.activeFilterChipText,
                  ]}
                >
                  Latest
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  isDarkMode && styles.darkFilterChip,
                  activeFilter === 'popular' && styles.activeFilterChip,
                  activeFilter === 'popular' && isDarkMode && styles.darkActiveFilterChip,
                ]}
                onPress={() => setActiveFilter('popular')}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    isDarkMode && styles.darkChipText,
                    activeFilter === 'popular' && styles.activeFilterChipText,
                  ]}
                >
                  Popular
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  isDarkMode && styles.darkFilterChip,
                  activeFilter === 'bookmarked' && styles.activeFilterChip,
                  activeFilter === 'bookmarked' && isDarkMode && styles.darkActiveFilterChip,
                ]}
                onPress={() => setActiveFilter('bookmarked')}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    isDarkMode && styles.darkChipText,
                    activeFilter === 'bookmarked' && styles.activeFilterChipText,
                  ]}
                >
                  Bookmarked
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          {/* Articles list */}
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {filteredArticles.length > 0 ? (
              <FlatList
                data={filteredArticles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ArticleCard
                    article={item}
                    isDarkMode={isDarkMode}
                    isModal={true}
                    onPress={() => {
                      onArticlePress(item);
                      onClose();
                    }}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.articlesContainer}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Ionicons 
                  name="search-outline" 
                  size={50} 
                  color={isDarkMode ? "#555" : "#ccc"} 
                />
                <Text style={[styles.noResultsText, isDarkMode && styles.darkText]}>
                  No articles found
                </Text>
                <Text style={[styles.noResultsSubText, isDarkMode && styles.darkSubtext]}>
                  Try a different search term or filter
                </Text>
              </View>
            )}
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
  darkFilterChip: {
    backgroundColor: '#2a2a2a',
  },
  content: {
    flex: 1,
  },
  articlesContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  noResultsContainer: {
    flex: 1,
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
});

export default ArticlesAllModal;
