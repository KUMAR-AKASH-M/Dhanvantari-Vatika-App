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
  PanResponder
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSavedHerbs } from '../context/HerbContext';

// Update interface name for consistency
interface HerbDetailModalProps {
  visible: boolean;
  herb: {
    id: string;
    name: string;
    description: string;
    image: any;
    scientificName?: string;
    benefits?: string[];
    howToUse?: string[];
    growingTips?: string[];
  } | null;
  onClose: () => void;
  isDarkMode: boolean;
}

const { height, width } = Dimensions.get('window');

const HerbDetailModal = ({ visible, herb, onClose, isDarkMode }: HerbDetailModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // State for active tab and bookmarking
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get herb context functions for bookmarking
  const { addToSavedHerbs, removeFromSavedHerbs, isInSavedHerbs } = useSavedHerbs();
  
  // Check if herb is bookmarked using context
  const isBookmarked = herb ? isInSavedHerbs(herb.id) : false;
  
  // Toggle bookmark function
  const toggleBookmark = () => {
    if (!herb) return;
    
    if (isBookmarked) {
      removeFromSavedHerbs(herb.id);
    } else {
      addToSavedHerbs(herb);
    }
  };
  
  // Reset states when modal closes/opens
  useEffect(() => {
    if (!visible) {
      setActiveTab('overview');
    }
  }, [visible]);

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
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 5,
        speed: 14,
      }).start();
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        delay: 200,
      }).start();
      
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
        delay: 100,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible]);
  
  // Share functionality
  const handleShare = async () => {
    if (!herb) return;
    
    try {
      await Share.share({
        title: `Learn about ${herb.name}`,
        message: `Check out the healing benefits of ${herb.name} in Ayurvedic medicine: ${herb.description}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!herb) return null;

  // Get herb content with defaults if not provided
  const getHerbContent = () => {
    const scientificName = herb.scientificName || getDefaultScientificName(herb.name);
    const benefits = herb.benefits || getDefaultBenefits(herb.name);
    const howToUse = herb.howToUse || getDefaultHowToUse(herb.name);
    const growingTips = herb.growingTips || getDefaultGrowingTips(herb.name);
    
    return {
      scientificName,
      benefits,
      howToUse,
      growingTips,
      description: herb.description,
      fullDescription: getFullDescription(herb.name)
    };
  };
  
  const content = getHerbContent();

  // Render different tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <View style={styles.scientificNameContainer}>
              <Text style={[styles.scientificNameLabel, isDarkMode && styles.darkSubText]}>Scientific Name:</Text>
              <Text style={[styles.scientificName, isDarkMode && styles.darkText]}>{content.scientificName}</Text>
            </View>
            
            <Text style={[styles.description, isDarkMode && styles.darkText]}>
              {content.fullDescription}
            </Text>
            
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Health Benefits</Text>
              {content.benefits.map((benefit, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <Ionicons 
                    name="checkmark-circle" 
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
      case 'usage':
        return (
          <View style={styles.usageContainer}>
            <Text style={[styles.tabIntro, isDarkMode && styles.darkText]}>
              Here's how to use {herb.name} for maximum benefits:
            </Text>
            {content.howToUse.map((instruction, index) => (
              <View key={index} style={[styles.usageCard, isDarkMode && styles.darkUsageCard]}>
                <View style={styles.usageIconContainer}>
                  <Text style={[styles.usageNumber, isDarkMode && { color: '#8bc34a' }]}>{index + 1}</Text>
                </View>
                <View style={styles.usageContent}>
                  <Text style={[styles.usageText, isDarkMode && styles.darkText]}>
                    {instruction}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        );
      case 'growing':
        return (
          <View style={styles.growingContainer}>
            <Text style={[styles.tabIntro, isDarkMode && styles.darkText]}>
              How to grow and care for {herb.name}:
            </Text>
            {content.growingTips.map((tip, index) => (
              <View key={index} style={[styles.growingCard, isDarkMode && styles.darkGrowingCard]}>
                <View style={styles.growingIconContainer}>
                  <Ionicons name="leaf" size={18} color={isDarkMode ? "#8bc34a" : "#3e7d32"} />
                </View>
                <View style={styles.growingContent}>
                  <Text style={[styles.growingText, isDarkMode && styles.darkText]}>
                    {tip}
                  </Text>
                </View>
              </View>
            ))}
            <Image 
              source={herb.image} 
              style={styles.growingImage}
              resizeMode="cover"
            />
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
          {/* Drag indicator */}
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
            <Image source={herb.image} style={styles.heroImage} />
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
              <Text style={styles.heroTitle}>{herb.name}</Text>
              <View style={styles.herbTagContainer}>
                <Ionicons name="leaf" size={14} color="#fff" />
                <Text style={styles.herbTagText}>Medicinal Herb</Text>
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
                activeTab === 'usage' && styles.activeTab,
                activeTab === 'usage' && isDarkMode && styles.darkActiveTab
              ]}
              onPress={() => setActiveTab('usage')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'usage' && styles.activeTabText,
                  isDarkMode && styles.darkTabText
                ]}
              >
                How to Use
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'growing' && styles.activeTab,
                activeTab === 'growing' && isDarkMode && styles.darkActiveTab
              ]}
              onPress={() => setActiveTab('growing')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'growing' && styles.activeTabText,
                  isDarkMode && styles.darkTabText
                ]}
              >
                Growing Tips
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
              {renderTabContent()}
            </Animated.View>
          </Animated.ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Helper functions to provide default content based on herb name
const getDefaultScientificName = (name: string) => {
  switch(name.toLowerCase()) {
    case 'tulsi':
      return 'Ocimum sanctum';
    case 'ashwagandha':
      return 'Withania somnifera';
    case 'neem':
      return 'Azadirachta indica';
    case 'amla':
      return 'Phyllanthus emblica';
    default:
      return 'Herbus medicinalis';
  }
};

const getDefaultBenefits = (name: string) => {
  switch(name.toLowerCase()) {
    case 'tulsi':
      return [
        'Boosts immunity and fights infections',
        'Reduces stress and anxiety',
        'Helps with respiratory disorders',
        'Rich in antioxidants'
      ];
    case 'ashwagandha':
      return [
        'Reduces cortisol levels and stress',
        'Enhances brain function and memory',
        'Improves physical performance',
        'Supports healthy sleep patterns'
      ];
    case 'neem':
      return [
        'Natural antiseptic and antibacterial properties',
        'Purifies blood and detoxifies the body',
        'Treats skin conditions like acne and eczema',
        'Helps maintain blood sugar levels'
      ];
    case 'amla':
      return [
        'Extremely high in Vitamin C content',
        'Supports hair health and prevents premature graying',
        'Improves digestion and metabolism',
        'Enhances eye health'
      ];
    default:
      return [
        'Provides numerous health benefits',
        'Used in traditional medicine for centuries',
        'Contains natural healing compounds',
        'Supports overall wellbeing'
      ];
  }
};

const getDefaultHowToUse = (name: string) => {
  switch(name.toLowerCase()) {
    case 'tulsi':
      return [
        'Make tulsi tea by steeping fresh or dried leaves in hot water for 5-7 minutes',
        'Add fresh tulsi leaves to salads or sandwiches',
        'Mix dried tulsi powder with honey for immunity boost',
        'Chew 5-6 fresh tulsi leaves daily on an empty stomach'
      ];
    case 'ashwagandha':
      return [
        'Take 300-500mg of ashwagandha root extract twice daily with meals',
        'Mix ashwagandha powder with warm milk and honey before bedtime',
        'Add to smoothies or protein shakes for energy',
        'Apply ashwagandha oil topically for soothing sore muscles'
      ];
    case 'neem':
      return [
        'Use neem oil diluted with carrier oil for skin conditions',
        'Take neem leaf capsules as directed for internal detoxification',
        'Make neem tea from dried leaves for blood purification',
        'Use neem-infused water for plants as a natural pesticide'
      ];
    case 'amla':
      return [
        'Consume fresh amla fruits or juice on an empty stomach',
        'Take dried amla powder with honey for immunity support',
        'Apply amla oil to hair roots for strengthening',
        'Mix amla powder with water for a revitalizing face pack'
      ];
    default:
      return [
        'Consult with an Ayurvedic practitioner for personalized usage',
        'Research proper dosage for your specific needs',
        'Start with small amounts to test tolerance',
        'Use consistently for best results'
      ];
  }
};

const getDefaultGrowingTips = (name: string) => {
  switch(name.toLowerCase()) {
    case 'tulsi':
      return [
        'Plant in well-drained soil with plenty of sunlight',
        'Water regularly but avoid overwatering',
        'Pinch off flower buds to encourage leaf growth',
        'Protect from frost as tulsi is sensitive to cold'
      ];
    case 'ashwagandha':
      return [
        'Grows best in dry, sandy soil with good drainage',
        'Needs full sun exposure and warm temperatures',
        'Water sparingly - tolerates drought conditions well',
        'Takes 150-180 days from planting to harvest'
      ];
    case 'neem':
      return [
        'Requires tropical or subtropical climate to thrive',
        'Can grow in poor soil conditions but prefers well-drained soil',
        'Water deeply but infrequently',
        'Takes 3-5 years to mature and produce seeds'
      ];
    case 'amla':
      return [
        'Plant in full sun with moderate water',
        'Prefers well-drained, loamy soil',
        'Space trees at least 10 meters apart for proper growth',
        'Fertilize with organic compost during growing season'
      ];
    default:
      return [
        'Research specific growing conditions for your climate',
        'Ensure proper drainage to prevent root rot',
        'Provide appropriate sunlight exposure',
        'Learn about proper harvesting techniques'
      ];
  }
};

const getFullDescription = (name: string) => {
  switch(name.toLowerCase()) {
    case 'tulsi':
      return "Tulsi (Holy Basil) is one of the most sacred plants in India and is renowned for its powerful healing properties. It is considered a manifestation of the goddess Tulsi in Hindu tradition. With its distinctive clove-like aroma, tulsi has been used for thousands of years in Ayurveda for its diverse healing properties. It's particularly valued for its ability to address physical, mental, emotional and spiritual health.";
    case 'ashwagandha':
      return "Ashwagandha, also known as Indian Ginseng or Winter Cherry, is one of the most important herbs in Ayurvedic medicine. The name 'Ashwagandha' translates to 'smell of horse,' referring to both its unique smell and its ability to increase strength. It's classified as an adaptogen, meaning it helps the body manage stress. For over 3,000 years, it has been used to boost energy, reduce anxiety and stress, and improve concentration.";
    case 'neem':
      return "Neem is often referred to as 'the village pharmacy' in India due to its remarkable versatility in treating various conditions. Every part of the neem tree—leaves, flowers, seeds, fruits, roots, and bark—has distinct therapeutic properties. Its usage dates back over 5,000 years, where it was mentioned in ancient texts for treating almost every known human ailment. Neem contains compounds with antiseptic, antiviral, antipyretic, and anti-inflammatory properties.";
    case 'amla':
      return "Amla, or Indian Gooseberry, is considered one of the most potent sources of Vitamin C in the plant kingdom, containing 20 times more vitamin C than orange juice. In Ayurveda, it's regarded as a divine fruit and is treasured for its ability to balance all three doshas (Vata, Pitta, and Kapha). Amla has been used in traditional Indian medicine for over 3,000 years to promote longevity, enhance digestion, and treat numerous ailments.";
    default:
      return "This healing plant has been valued in traditional medicine systems for centuries. Rich in beneficial compounds, it offers numerous health benefits and has been the subject of both ancient wisdom and modern scientific research. Its properties make it a valuable addition to holistic health practices.";
  }
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
  scientificNameContainer: {
    marginBottom: 16,
    backgroundColor: 'rgba(62,125,50,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scientificNameLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 6,
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
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
  usageContainer: {
    marginBottom: 20,
  },
  tabIntro: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    lineHeight: 24,
  },
  usageCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkUsageCard: {
    backgroundColor: '#2a2a2a',
  },
  usageIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  usageNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3e7d32',
  },
  usageContent: {
    flex: 1,
  },
  usageText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  growingContainer: {
    marginBottom: 20,
  },
  growingCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkGrowingCard: {
    backgroundColor: '#2a2a2a',
  },
  growingIconContainer: {
    marginRight: 14,
    marginTop: 2,
  },
  growingContent: {
    flex: 1,
  },
  growingText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  growingImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 20,
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkSubText: {
    color: '#aaa',
  },
});

export default HerbDetailModal;