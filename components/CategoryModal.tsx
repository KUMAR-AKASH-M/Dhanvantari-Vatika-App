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
  Share,
  Platform,
  PanResponder
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface CategoryModalProps {
  visible: boolean;
  category: {
    name: string;
    icon: string;
    image: any;
    description?: string;
  } | null;
  onClose: () => void;
  isDarkMode: boolean;
}

const { height, width } = Dimensions.get('window');

const CategoryModal = ({ visible, category, onClose, isDarkMode }: CategoryModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for bookmarking
  const [isBookmarked, setIsBookmarked] = useState(false);
  
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
      setActiveTab('overview');
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
  
  // Share functionality
  const handleShare = async () => {
    if (!category) return;
    
    try {
      await Share.share({
        title: `Learn about ${category.name}`,
        message: `Check out this amazing information about ${category.name} in traditional medicine! Download Dhanvantari Vatika app to learn more.`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  // Bookmark toggle
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would also save this to user preferences/storage
  };

  // Placeholder content for each category
  const getCategoryContent = (name: string) => {
    switch(name) {
      case 'Ayurveda':
        return {
          title: 'Ayurveda - Science of Life',
          description: 'Ayurveda is one of the world\'s oldest holistic healing systems, developed more than 3,000 years ago in India. The concept of Ayurveda is based on the belief that health and wellness depend on a delicate balance between the mind, body, and spirit.',
          benefits: [
            'Natural healing through herbs and minerals',
            'Personalized approach based on body constitution',
            'Focus on preventative healthcare',
            'Promotes overall wellness and longevity'
          ],
          practices: [
            'Dietary recommendations based on doshas',
            'Herbal supplements and remedies',
            'Panchakarma detoxification',
            'Daily wellness routines (dinacharya)'
          ]
        };
      case 'Yoga':
        return {
          title: 'Yoga - Union of Body & Mind',
          description: 'Yoga is an ancient practice that brings together mind and body. It incorporates breathing exercises, meditation and poses designed to encourage relaxation and reduce stress.',
          benefits: [
            'Increased flexibility and strength',
            'Improved respiration, energy and vitality',
            'Maintaining a balanced metabolism',
            'Mental clarity and stress reduction'
          ],
          practices: [
            'Asanas (physical postures)',
            'Pranayama (breathing techniques)',
            'Meditation and mindfulness',
            'Dharana (concentration)'
          ]
        };
      case 'Naturopathy':
        return {
          title: 'Naturopathy - Healing Power of Nature',
          description: 'Naturopathy is a form of alternative medicine that employs an array of pseudoscientific practices branded as "natural," "non-invasive," and promoting "self-healing."',
          benefits: [
            'Uses natural healing processes',
            'Non-invasive treatments',
            'Focus on whole-person wellness',
            'Preventative health approach'
          ],
          practices: [
            'Nutrition and dietary interventions',
            'Hydrotherapy',
            'Physical therapy',
            'Herbal medicine'
          ]
        };
      case 'Unani':
        return {
          title: 'Unani - Greek-Arabic Medicine',
          description: 'Unani medicine is a traditional medical system that originated in ancient Greece, was developed further in the medieval Islamic world, and is now practiced primarily in India.',
          benefits: [
            'Personalized treatment approach',
            'Natural remedies and herbs',
            'Focus on balance of bodily fluids',
            'Emphasis on preventive care'
          ],
          practices: [
            'Herbal formulations',
            'Dietary regulations',
            'Physical therapies',
            'Regimental therapy'
          ]
        };
      case 'Siddha':
        return {
          title: 'Siddha - Ancient Tamil Medicine',
          description: 'Siddha medicine is one of the oldest medical systems in India, originating in ancient Tamilakam (Tamil Nadu) in South India.',
          benefits: [
            'Holistic approach to wellness',
            'Use of minerals and metals in medicine',
            'Emphasis on spiritual well-being',
            'Focus on longevity and rejuvenation'
          ],
          practices: [
            'Herbal remedies',
            'Mineral-based medicines',
            'Yoga and meditation',
            'Varma therapy (pressure point treatment)'
          ]
        };
      case 'Homoeopathy':
        return {
          title: 'Homoeopathy - Like Cures Like',
          description: 'Homoeopathy is a medical system based on the belief that the body can cure itself, using highly diluted substances to trigger the body\'s natural system of healing.',
          benefits: [
            'Individualized treatment approach',
            'Minimal side effects',
            'Addresses root cause of illness',
            'Holistic view of health'
          ],
          practices: [
            'Highly diluted remedies',
            'Single remedy prescription',
            'Law of similars application',
            'Constitutional treatment'
          ]
        };
      default:
        return {
          title: `${name} - Traditional Medicine`,
          description: `Details about ${name} will be available soon.`,
          benefits: ['Coming soon...'],
          practices: ['Coming soon...']
        };
    }
  };

  if (!category) return null;

  const content = getCategoryContent(category.name);

  // Different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <Text style={[styles.description, isDarkMode && styles.darkText]}>
              {content.description}
            </Text>
            
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Benefits</Text>
              {content.benefits.map((benefit, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <Ionicons 
                    name="leaf" 
                    size={16} 
                    color={isDarkMode ? "#8bc34a" : "#3e7d32"} 
                    style={styles.bulletIcon} 
                  />
                  <Text style={[styles.bulletText, isDarkMode && styles.darkText]}>
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>
          </>
        );
      case 'practices':
        return (
          <View style={styles.practicesContainer}>
            <Text style={[styles.tabIntro, isDarkMode && styles.darkText]}>
              Essential practices in {category.name} that promote wellness and healing:
            </Text>
            {content.practices.map((practice, index) => (
              <View key={index} style={[styles.practiceCard, isDarkMode && styles.darkPracticeCard]}>
                <View style={styles.practiceIconContainer}>
                  <Ionicons name="checkmark-circle" size={22} color={isDarkMode ? "#8bc34a" : "#3e7d32"} />
                </View>
                <View style={styles.practiceContent}>
                  <Text style={[styles.practiceText, isDarkMode && styles.darkText]}>
                    {practice}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        );
      case 'history':
        return (
          <View style={styles.historyContainer}>
            <Text style={[styles.tabIntro, isDarkMode && styles.darkText]}>
              {category.name} has a rich history dating back thousands of years.
            </Text>
            <Image 
              source={category.image} 
              style={styles.historyImage}
              resizeMode="cover"
            />
            <Text style={[styles.historyText, isDarkMode && styles.darkText]}>
              {category.name === "Ayurveda" ? 
                "Ayurveda originated in India more than 5,000 years ago and is one of the world's oldest holistic healing systems. It was developed during the Vedic period and has been passed down through generations both orally and in written texts. The foundational texts of Ayurveda include the Charaka Samhita, which focuses on internal medicine, and the Sushruta Samhita, which focuses on surgery." :
                `The historical tradition of ${category.name} began centuries ago and continues to influence modern wellness practices today. Through careful observation and documentation, practitioners developed effective techniques that have stood the test of time.`
              }
            </Text>
            <Text style={[styles.historyText, isDarkMode && styles.darkText]}>
              Today, practitioners across the world continue to use these time-tested methods, often alongside modern medical practices.
            </Text>
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
            <Image source={category.image} style={styles.heroImage} />
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
              <Text style={styles.heroTitle}>{category.name}</Text>
              <View style={styles.herbTagContainer}>
                <Ionicons name={category.icon} size={14} color="#fff" />
                <Text style={styles.herbTagText}>Traditional Medicine</Text>
              </View>
            </Animated.View>
          </View>
          
          {/* Tab navigation */}
          <View style={[styles.tabContainer, isDarkMode && styles.darkTabContainer]}>
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'overview' && styles.activeTab,
                activeTab === 'overview' && isDarkMode && styles.darkActiveTab
              ]}
              onPress={() => setActiveTab('overview')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'overview' && styles.activeTabText,
                  isDarkMode && styles.darkTabText
                ]}
              >
                Overview
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'practices' && styles.activeTab,
                activeTab === 'practices' && isDarkMode && styles.darkActiveTab
              ]}
              onPress={() => setActiveTab('practices')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'practices' && styles.activeTabText,
                  isDarkMode && styles.darkTabText
                ]}
              >
                Practices
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'history' && styles.activeTab,
                activeTab === 'history' && isDarkMode && styles.darkActiveTab
              ]}
              onPress={() => setActiveTab('history')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'history' && styles.activeTabText,
                  isDarkMode && styles.darkTabText
                ]}
              >
                History
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Content */}
          <Animated.ScrollView 
            style={[styles.contentContainer, { opacity: fadeAnim }]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            // Animation properties for content
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Text style={[styles.contentTitle, isDarkMode && styles.darkText]}>
                {content.title}
              </Text>
              
              {renderTabContent()}
              
              <TouchableOpacity 
                style={[styles.learnMoreButton, isDarkMode && styles.darkLearnMoreButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.learnMoreText}>
                  Explore {category.name} in Detail
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.ScrollView>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 8,
  },
  herbTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(62,125,50,0.8)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  herbTagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
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
    paddingBottom: 40,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bulletIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
    color: '#555',
  },
  learnMoreButton: {
    backgroundColor: '#3e7d32',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
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
  darkLearnMoreButton: {
    backgroundColor: '#4b9245',
  },
  learnMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#f0f0f0',
  },
  // Practice tab styles
  practicesContainer: {
    marginBottom: 20,
  },
  tabIntro: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    lineHeight: 24,
  },
  practiceCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  darkPracticeCard: {
    backgroundColor: '#2a2a2a',
  },
  practiceIconContainer: {
    marginRight: 14,
    marginTop: 2,
  },
  practiceContent: {
    flex: 1,
  },
  practiceText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  // History tab styles
  historyContainer: {
    marginBottom: 20,
  },
  historyImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  historyText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#555',
    marginBottom: 16,
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

export default CategoryModal;
