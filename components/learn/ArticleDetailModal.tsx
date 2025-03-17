import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  PanResponder,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ArticleType } from './ArticleCard';
import { useSavedArticles } from '../../context/ArticleContext';

const { width, height } = Dimensions.get('window');

interface ArticleDetailModalProps {
  visible: boolean;
  onClose: () => void;
  article: ArticleType | null;
  isDarkMode: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const ArticleDetailModal = ({ 
  visible, 
  onClose, 
  article, 
  isDarkMode,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false
}: ArticleDetailModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [activeTab, setActiveTab] = useState('content');
  
  // Use saved articles context
  const { addToSavedArticles, removeFromSavedArticles, isInSavedArticles } = useSavedArticles();
  
  // Check if article is bookmarked using context
  const articleId = article?.id;
  const isBookmarked = articleId ? isInSavedArticles(articleId) : false;

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

  // Reset states when modal closes/opens
  useEffect(() => {
    if (!visible) {
      setActiveTab('content');
    }
  }, [visible]);

  // Animation logic
  useEffect(() => {
    if (visible) {
      // Animate modal sliding up
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 5,
        speed: 14,
      }).start();
      
      // Animate content fading in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        delay: 200,
      }).start();
      
      // Animate content scaling up
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
        delay: 100,
      }).start();
    } else {
      // Animate modal sliding down
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Reset other animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible]);
  
  // Bookmark toggle with actual saving functionality
  const toggleBookmark = () => {
    if (!article) return;
    
    if (isBookmarked) {
      removeFromSavedArticles(articleId);
    } else {
      addToSavedArticles({
        ...article,
        savedDate: new Date().toLocaleDateString()
      });
    }
  };
  
  // Share functionality
  const handleShare = async () => {
    if (!article) return;
    
    try {
      await Share.share({
        title: article.title,
        message: `Check out this interesting article on ${article.title}!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!article) return null;

  // Example article content - in a real app, this would come from your data source
  const content = `
    Ayurveda is one of the world's oldest holistic healing systems. Developed more than 3,000 years ago in India, it's based on the belief that health and wellness depend on a delicate balance between the mind, body, and spirit.
    
    The primary focus of Ayurveda is to promote good health, rather than fight disease. But treatments may be recommended for specific health problems.
    
    According to Ayurvedic theory, everything in the universe – living or not – is connected. Good health is achieved when your mind, body, and spirit are in harmony with the universe. A disruption of this harmony can lead to poor health and sickness.
    
    For followers of Ayurveda, anything that affects your physical, spiritual, or emotional well-being can cause you to be out of balance with the universe. How your body works to keep you healthy and your unique physical and psychological characteristics combine to form your body's constitution, or prakriti.
    
    Your prakriti is believed to stay the same for your entire life. However, how you digest food and eliminate waste can influence it.
  `;
  
  // Different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return (
          <>
            <Text style={[styles.articleContent, isDarkMode && styles.darkText]}>
              {content}
            </Text>
          </>
        );
      case 'related':
        return (
          <View style={styles.relatedContainer}>
            <Text style={[styles.tabIntro, isDarkMode && styles.darkText]}>
              Articles you might also be interested in:
            </Text>
            
            <View style={[styles.relatedCard, isDarkMode && styles.darkRelatedCard]}>
              <Image 
                source={{ uri: 'https://images-prod.healthline.com/hlcmsresource/images/AN_images/triphala-ayurvedic-fruits-1296x728.jpg' }} 
                style={styles.relatedImage}
              />
              <View style={styles.relatedContent}>
                <Text style={[styles.relatedTitle, isDarkMode && styles.darkText]} numberOfLines={2}>
                  Benefits of Daily Ayurvedic Practices
                </Text>
                <Text style={[styles.relatedMeta, isDarkMode && styles.darkMutedText]}>
                  5 min read • 1 week ago
                </Text>
              </View>
            </View>
            
            <View style={[styles.relatedCard, isDarkMode && styles.darkRelatedCard]}>
              <Image 
                source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbnZ2x56R92vw0_JfFDXMCbXKhfaSSAHKdEeQvM2vAMW7xph4EaYAHjNF3eneVBXXxR1c&usqp=CAU' }} 
                style={styles.relatedImage}
              />
              <View style={styles.relatedContent}>
                <Text style={[styles.relatedTitle, isDarkMode && styles.darkText]} numberOfLines={2}>
                  Seasonal Ayurvedic Diet Guidelines
                </Text>
                <Text style={[styles.relatedMeta, isDarkMode && styles.darkMutedText]}>
                  8 min read • 3 weeks ago
                </Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

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
          
          {/* Header with close button */}
          <View style={[styles.header, isDarkMode && styles.darkHeader]}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons 
                name="chevron-down" 
                size={28} 
                color={isDarkMode ? "#fff" : "#333"} 
              />
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={toggleBookmark} style={styles.headerButton}>
                <Ionicons 
                  name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                  size={22} 
                  color={isBookmarked ? "#f5bc42" : (isDarkMode ? "#fff" : "#333")} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
                <Ionicons 
                  name="share-outline" 
                  size={22} 
                  color={isDarkMode ? "#fff" : "#333"} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Hero section with image */}
          <View style={styles.heroContainer}>
            <Image source={article.image} style={styles.heroImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.heroGradient}
            />
            <Animated.View 
              style={[
                styles.heroOverlay, 
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
              ]}
            >
              <Text style={styles.heroTitle}>{article.title}</Text>
              <View style={styles.heroTagContainer}>
                <Text style={styles.heroTagText}>{article.publishedDate} • {article.readTime}</Text>
              </View>
            </Animated.View>
          </View>
          
          {/* Tab navigation */}
          <View style={[styles.tabContainer, isDarkMode && styles.darkTabContainer]}>
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'content' && styles.activeTab,
                activeTab === 'content' && isDarkMode && styles.darkActiveTab
              ]}
              onPress={() => setActiveTab('content')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'content' && styles.activeTabText,
                  isDarkMode && styles.darkTabText
                ]}
              >
                Content
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'related' && styles.activeTab,
                activeTab === 'related' && isDarkMode && styles.darkActiveTab
              ]}
              onPress={() => setActiveTab('related')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'related' && styles.activeTabText,
                  isDarkMode && styles.darkTabText
                ]}
              >
                Related
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Content */}
          <Animated.ScrollView 
            style={[styles.contentContainer, { opacity: fadeAnim }]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Text style={[styles.contentTitle, isDarkMode && styles.darkText]}>
                {article.title}
              </Text>
              
              {renderTabContent()}
              
              <View style={styles.tagsContainer}>
                <Text style={[styles.tagLabel, isDarkMode && styles.darkText]}>
                  Related Topics:
                </Text>
                <View style={styles.tags}>
                  <TouchableOpacity style={[styles.tag, isDarkMode && styles.darkTag]}>
                    <Text style={[styles.tagText, isDarkMode && styles.darkTagText]}>Ayurveda</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tag, isDarkMode && styles.darkTag]}>
                    <Text style={[styles.tagText, isDarkMode && styles.darkTagText]}>Wellness</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tag, isDarkMode && styles.darkTag]}>
                    <Text style={[styles.tagText, isDarkMode && styles.darkTagText]}>Health</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </Animated.ScrollView>
          
          {/* Navigation buttons at the bottom */}
          <View style={[styles.navigationFooter, isDarkMode && styles.darkNavigationFooter]}>
            <TouchableOpacity 
              style={[
                styles.navButton, 
                isDarkMode && styles.darkNavButton,
                !hasPrevious && styles.disabledButton
              ]}
              onPress={hasPrevious ? onPrevious : undefined}
              disabled={!hasPrevious}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={hasPrevious ? (isDarkMode ? '#fff' : '#333') : (isDarkMode ? '#555' : '#ccc')} 
              />
              <Text 
                style={[
                  styles.navButtonText, 
                  isDarkMode && styles.darkNavButtonText,
                  !hasPrevious && styles.disabledButtonText
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.navButton, 
                isDarkMode && styles.darkNavButton,
                !hasNext && styles.disabledButton
              ]}
              onPress={hasNext ? onNext : undefined}
              disabled={!hasNext}
            >
              <Text 
                style={[
                  styles.navButtonText, 
                  isDarkMode && styles.darkNavButtonText,
                  !hasNext && styles.disabledButtonText
                ]}
              >
                Next
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={hasNext ? (isDarkMode ? '#fff' : '#333') : (isDarkMode ? '#555' : '#ccc')} 
              />
            </TouchableOpacity>
          </View>
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
    height: '90%',
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
    height: 56,
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
  closeButton: {
    padding: 5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 10,
  },
  heroContainer: {
    position: 'relative',
    height: 220,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 8,
  },
  heroTagContainer: {
    backgroundColor: 'rgba(62,125,50,0.8)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  heroTagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  darkTabContainer: {
    backgroundColor: '#1A1A1A',
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3e7d32',
  },
  darkActiveTab: {
    borderBottomColor: '#8bc34a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  activeTabText: {
    color: '#3e7d32',
    fontWeight: '700',
  },
  darkTabText: {
    color: '#aaa',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80, // Space for the navigation footer
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  articleContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 20,
  },
  tagsContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  tagLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0f2e9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  darkTag: {
    backgroundColor: '#2c4c40',
  },
  tagText: {
    color: '#3e7d32',
    fontSize: 13,
    fontWeight: '500',
  },
  darkTagText: {
    color: '#8fbf7f',
  },
  navigationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  darkNavigationFooter: {
    backgroundColor: '#1e1e1e',
    borderTopColor: '#333',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  darkNavButton: {
    // No specific styling needed beyond text color
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3e7d32',
    marginHorizontal: 5,
  },
  darkNavButtonText: {
    color: '#6baf5e',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#999',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
  // Related tab styles
  relatedContainer: {
    marginTop: 5,
  },
  tabIntro: {
    fontSize: 15,
    color: '#555',
    marginBottom: 15,
  },
  relatedCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    height: 90,
  },
  darkRelatedCard: {
    backgroundColor: '#2a2a2a',
  },
  relatedImage: {
    width: 90,
    height: '100%',
    resizeMode: 'cover',
  },
  relatedContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  relatedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  relatedMeta: {
    fontSize: 12,
    color: '#777',
  },
});

export default ArticleDetailModal;
