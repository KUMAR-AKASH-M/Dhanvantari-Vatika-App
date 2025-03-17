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

// Rename interface for consistency
interface HerbType {
  id: string;
  name: string;
  description: string;
  image: any;
  scientificName?: string;
  benefits?: string[];
  howToUse?: string[];
  growingTips?: string[];
  category?: string;
}

interface HerbsAllModalProps {
  visible: boolean;
  herbs: HerbType[];
  onClose: () => void;
  onHerbPress: (herb: HerbType) => void;
  isDarkMode: boolean;
}

const { height, width } = Dimensions.get('window');

const HerbsAllModal = ({ 
  visible, 
  herbs, 
  onClose, 
  onHerbPress, 
  isDarkMode 
}: HerbsAllModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredHerbs, setFilteredHerbs] = useState(herbs);
  
  // Apply search and filter
  useEffect(() => {
    let result = herbs;
    
    // Apply search
    if (searchQuery) {
      result = result.filter(herb => 
        herb.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (herb.scientificName && herb.scientificName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        herb.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filter
    if (activeFilter !== 'all') {
      result = result.filter(herb => herb.category === activeFilter);
    }
    
    setFilteredHerbs(result);
  }, [searchQuery, activeFilter, herbs]);

  // Add pan responder for swipe-to-close functionality
  const panResponder = useRef(
    PanResponder.create({
      // ...existing code...
    })
  ).current;
  
  // Animation logic
  useEffect(() => {
    // ...existing code...
  }, [visible]);

  // Reset search and filter when modal opens
  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      setActiveFilter('all');
    }
  }, [visible]);

  // Render a herb card
  const renderHerbCard = ({ item }: { item: HerbType }) => (
    <TouchableOpacity
      style={[styles.herbCard, isDarkMode && styles.darkCard]}
      onPress={() => {
        onHerbPress(item);
        onClose();
      }}
      activeOpacity={0.8}
    >
      <Image source={item.image} style={styles.herbImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.herbGradient}
      />
      <View style={styles.herbContent}>
        <Text style={styles.herbName}>{item.name}</Text>
        <Text style={styles.herbDescription} numberOfLines={2}>{item.description}</Text>
      </View>
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
          {/* Drag indicator */}
          <View style={styles.dragIndicatorContainer} {...panResponder.panHandlers}>
            <View style={[styles.dragIndicator, isDarkMode && styles.darkDragIndicator]} />
          </View>
          
          {/* Header */}
          <View style={[styles.header, isDarkMode && styles.darkHeader]}>
            <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
              Medicinal Herbs
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
              placeholder="Search herbs..."
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
          
          {/* Filter options */}
          <View style={[styles.filterContainer, isDarkMode && styles.darkFilterContainer]}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScrollView}
            >
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  activeFilter === 'all' && styles.activeFilterChip,
                  activeFilter === 'all' && isDarkMode && styles.darkActiveFilterChip,
                ]}
                onPress={() => setActiveFilter('all')}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    activeFilter === 'all' && styles.activeFilterChipText,
                    isDarkMode && styles.darkChipText
                  ]}
                >
                  All Herbs
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  activeFilter === 'adaptogen' && styles.activeFilterChip,
                  activeFilter === 'adaptogen' && isDarkMode && styles.darkActiveFilterChip,
                ]}
                onPress={() => setActiveFilter('adaptogen')}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    activeFilter === 'adaptogen' && styles.activeFilterChipText,
                    isDarkMode && styles.darkChipText
                  ]}
                >
                  Adaptogens
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  activeFilter === 'immune' && styles.activeFilterChip,
                  activeFilter === 'immune' && isDarkMode && styles.darkActiveFilterChip,
                ]}
                onPress={() => setActiveFilter('immune')}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    activeFilter === 'immune' && styles.activeFilterChipText,
                    isDarkMode && styles.darkChipText
                  ]}
                >
                  Immunity
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  activeFilter === 'skincare' && styles.activeFilterChip,
                  activeFilter === 'skincare' && isDarkMode && styles.darkActiveFilterChip,
                ]}
                onPress={() => setActiveFilter('skincare')}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    activeFilter === 'skincare' && styles.activeFilterChipText,
                    isDarkMode && styles.darkChipText
                  ]}
                >
                  Skincare
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          {/* Herbs grid */}
          <Animated.View style={[styles.herbsContainer, { opacity: fadeAnim }]}>
            {filteredHerbs.length > 0 ? (
              <FlatList
                data={filteredHerbs}
                renderItem={renderHerbCard}
                keyExtractor={(item, index) => `herb-${index}`}
                numColumns={2}
                contentContainerStyle={styles.herbsGrid}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Ionicons 
                  name="leaf" 
                  size={50} 
                  color={isDarkMode ? "#555" : "#ccc"} 
                />
                <Text style={[styles.noResultsText, isDarkMode && styles.darkText]}>
                  No herbs found
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
  // ...existing code...
  plantsContainer: { // Rename property
    flex: 1,
  },
  herbsContainer: {
    flex: 1,
  },
  plantsGrid: { // Rename property
    padding: 10,
  },
  herbsGrid: {
    padding: 10,
  },
  plantCard: { // Rename property
    flex: 1,
    margin: 8,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  herbCard: {
    flex: 1,
    margin: 8,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  // ...existing code...
  plantGradient: { // Rename property
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  herbGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  plantContent: { // Rename property
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  herbContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  plantName: { // Rename property
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  herbName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  plantDescription: { // Rename property
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  herbDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  // ...existing code...
  plantImage: { // Rename property
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  herbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // ...rest of styles...
});

export default HerbsAllModal;