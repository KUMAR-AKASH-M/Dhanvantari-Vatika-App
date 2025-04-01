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

  // Article content based on article ID
  const getArticleContent = () => {
    switch(article.id) {
      case '1':
        return `
    **Understanding Your Dosha Type**
    
    In Ayurveda, your unique physical and mental constitution is known as your dosha. There are three doshas—Vata, Pitta, and Kapha—each representing different elements and characteristics that exist within all of us.
    
    **Vata Dosha (Air & Space)**
    
    Vata individuals tend to be thin, light, and quick in their thoughts and actions. When in balance, they are creative, energetic, and flexible. When out of balance, they may experience anxiety, insomnia, or digestive issues.
    
    *Characteristics:*
    • Light, thin body frame
    • Quick mind and movements
    • Creative and adaptable
    • Dry skin and hair
    • Tendency to feel cold
    
    *Balance Tips:*
    • Establish regular routines
    • Stay warm and grounded
    • Eat warm, cooked foods
    • Practice gentle yoga and meditation
    
    **Pitta Dosha (Fire & Water)**
    
    Pitta types have a medium build with good muscle development. They are naturally intelligent, focused, and confident. When imbalanced, they may become irritable, overly critical, or experience inflammation.
    
    *Characteristics:*
    • Medium frame with moderate musculature
    • Sharp intellect and good concentration
    • Strong digestion
    • Warm body temperature
    • Tendency toward leadership
    
    *Balance Tips:*
    • Avoid excessive heat and sun exposure
    • Consume cooling foods like vegetables and sweet fruits
    • Practice mindfulness to manage stress
    • Avoid skipping meals
    
    **Kapha Dosha (Earth & Water)**
    
    Kapha individuals have a solid, heavy build with excellent endurance. They are calm, loving, and stable by nature. When out of balance, they may gain weight easily or experience sluggishness.
    
    *Characteristics:*
    • Larger frame with well-developed physique
    • Calm and steady emotional nature
    • Strong immunity
    • Smooth, oily skin
    • Slow digestion
    
    *Balance Tips:*
    • Stay active with regular exercise
    • Incorporate variety and stimulation in daily life
    • Consume warm, light, and spicy foods
    • Rise early in the morning
    
    **Mixed Doshas**
    
    Many people have a combination of two dominant doshas, while some are tri-doshic with relatively equal amounts of all three. Understanding your unique combination can help you maintain balance through personalized lifestyle and dietary choices.
    
    **Determining Your Dosha**
    
    To truly understand your dosha, consider consulting with an Ayurvedic practitioner who can conduct a comprehensive assessment. However, various online quizzes and self-assessment tools can give you initial insights into your constitution.
    
    Remember that your dosha is not just about physical characteristics—it encompasses your mental tendencies, emotional patterns, and spiritual inclinations as well.
        `;
      case '2':
        return `
    **The Power of Triphala in Daily Life**
    
    Triphala, meaning "three fruits" in Sanskrit, is one of Ayurveda's most revered herbal formulations. For thousands of years, this potent blend has been used as a rejuvenating tonic, digestive aid, and gentle detoxifier.
    
    **What is Triphala?**
    
    Triphala is a balanced combination of three medicinal plants native to India:
    
    1. **Amalaki (Emblica officinalis)** - Rich in vitamin C and antioxidants, Amalaki nourishes the body's tissues and supports immunity. It balances the Pitta dosha.
    
    2. **Bibhitaki (Terminalia bellirica)** - Known for its detoxifying properties, Bibhitaki helps remove excess mucus and balances the Kapha dosha.
    
    3. **Haritaki (Terminalia chebula)** - Often called the "king of medicines" in Tibet, Haritaki gently cleanses the digestive tract and primarily balances the Vata dosha.
    
    Together, these three fruits create a synergistic formula that balances all three doshas—Vata, Pitta, and Kapha.
    
    **Health Benefits of Triphala**
    
    *Digestive Health*
    
    Triphala is perhaps best known for supporting digestive wellness. It gently cleanses the digestive tract, improves absorption of nutrients, and promotes regular elimination without causing dependency. Unlike harsh laxatives, Triphala strengthens digestive function over time.
    
    *Detoxification*
    
    As a mild detoxifier, Triphala helps remove ama (toxic residue) from the body. It supports the liver's natural detoxification processes and helps clear channels throughout the body.
    
    *Antioxidant Protection*
    
    Rich in polyphenols and flavonoids, Triphala combats oxidative stress and free radical damage. Research suggests it may help protect cells from premature aging and support longevity.
    
    *Immune Support*
    
    The high vitamin C content and immune-modulating compounds in Triphala help strengthen immunity and increase resistance to infections.
    
    *Oral Health*
    
    Traditional Ayurvedic practice includes using Triphala as a mouth rinse to support gum health, reduce inflammation, and protect against dental issues.
    
    **Incorporating Triphala Into Your Daily Routine**
    
    *Traditional Method*
    
    Take 1/2 to 1 teaspoon of Triphala powder mixed with warm water before bed or first thing in the morning on an empty stomach.
    
    *Convenient Options*
    
    Triphala is also available in tablet and capsule forms for those who find the taste challenging.
    
    *Triphala Tea*
    
    Steep 1/2 teaspoon of Triphala powder in hot water for 5-10 minutes, add honey if desired.
    
    *Seasonal Adjustments*
    
    In summer, mix Triphala with cool water and a touch of raw honey.
    In winter, take with warm water or as a tea with warming spices like ginger.
    
    **Precautions**
    
    While Triphala is generally safe for most people, consult with a healthcare provider before use if you:
    • Are pregnant or nursing
    • Take blood thinners
    • Have a bleeding disorder
    • Are preparing for surgery
    
    Start with a small dose and gradually increase to assess your tolerance. As a natural, gentle supporter of overall health and wellness, Triphala truly embodies the holistic wisdom of Ayurveda.
        `;
      case '3':
        return `
    **Ayurvedic Diet Principles for Modern Life**
    
    In today's fast-paced world of convenience foods and conflicting nutrition advice, Ayurveda offers timeless dietary wisdom that can be adapted to modern living. These principles focus not just on what you eat, but how and when you eat—creating harmony between body, mind, and environment.
    
    **Core Ayurvedic Dietary Principles**
    
    **1. Eat According to Your Dosha**
    
    Your dominant dosha (Vata, Pitta, or Kapha) influences which foods will benefit or aggravate your system:
    
    *Vata Types:* Favor warm, cooked, moist foods with healthy oils and warming spices. Limit raw foods, especially in winter.
    
    *Pitta Types:* Choose cooling, moderately heavy foods like sweet fruits, vegetables, and grains. Reduce hot spices, alcohol, and acidic foods.
    
    *Kapha Types:* Opt for light, warm, and dry foods with pungent spices. Minimize heavy, oily, cold foods and excessive dairy.
    
    **2. Honor the Six Tastes**
    
    Ayurveda recognizes six tastes that should be included in each meal for satisfaction and nutritional balance:
    
    • *Sweet* (grains, dairy, sweet fruits)
    • *Sour* (yogurt, citrus, fermented foods)
    • *Salty* (sea salt, seaweed)
    • *Pungent* (spices, ginger, garlic)
    • *Bitter* (leafy greens, turmeric, coffee)
    • *Astringent* (beans, lentils, pomegranate)
    
    Including all six tastes helps reduce cravings and promotes complete nutrition.
    
    **3. Prioritize Digestive Fire (Agni)**
    
    In Ayurveda, good digestion is the foundation of health. To maintain strong digestive fire:
    
    • Begin meals with a small piece of ginger with lemon juice and a pinch of salt
    • Sip warm water, not cold beverages, during meals
    • Eat until you're 75% full, not completely stuffed
    • Allow 3-6 hours between meals for complete digestion
    • Incorporate digestive spices like cumin, coriander, and fennel
    
    **Adapting Ancient Wisdom to Modern Life**
    
    **Mindful Eating in a Distracted World**
    
    • Designate a pleasant eating space away from screens
    • Take a moment of gratitude before meals
    • Chew thoroughly and savor each bite
    • Consider using smaller plates to manage portions naturally
    
    **Seasonal Eating in the Age of Year-Round Availability**
    
    Despite supermarkets offering all foods year-round, our bodies still resonate with seasonal rhythms:
    
    *Spring (Kapha season):* Favor light, pungent, and bitter foods to clear winter stagnation.
    
    *Summer (Pitta season):* Choose cooling, hydrating foods and reduce heating spices.
    
    *Fall/Winter (Vata season):* Emphasize warm, moist, grounding foods and regular mealtimes.
    
    **Practical Modern Adaptations**
    
    *For Busy Professionals:*
    • Prepare simple one-pot meals on weekends
    • Keep digestive spice blends on hand to enhance quick meals
    • Choose wholesome restaurant options when needed
    
    *For Families:*
    • Introduce spices gradually to children
    • Create dosha-balancing meals that can be adjusted for individual needs
    • Make meal preparation and eating a shared, joyful experience
    
    **A Day of Ayurvedic Eating**
    
    *Morning:* Rise early and have a light, warm breakfast like spiced oatmeal or stewed fruits.
    
    *Midday:* Enjoy your largest meal when digestive fire is strongest, between 12-2 PM.
    
    *Evening:* Have a lighter dinner at least 3 hours before bedtime to ensure proper digestion during sleep.
    
    Remember that Ayurveda is not about rigid rules but about finding what creates optimal health and harmony for your unique constitution. By integrating these principles mindfully, you can nourish not just your body, but your entire being.
        `;
      default:
        return `
    This article content is not available yet. Please check back later for updates on this topic.
        `;
    }
  };
  
  // Get content based on article ID
  const content = getArticleContent();

  // Different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return (
          <View style={styles.formattedContent}>
            {renderFormattedContent()}
          </View>
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

  // Improved rendering function for formatted content
  const renderFormattedContent = () => {
    // Get the raw content string
    const contentStr = getArticleContent();
    
    // Split content into paragraphs (chunks separated by empty lines)
    const paragraphs = contentStr.split('\n\n').filter(p => p.trim().length > 0);
    
    // Process each paragraph
    return paragraphs.map((paragraph, index) => {
      paragraph = paragraph.trim();
      
      // MAIN HEADERS (**Header**)
      if (paragraph.startsWith('**') && paragraph.endsWith('**') && 
          !paragraph.slice(2, -2).includes('**')) {
        const headerText = paragraph.slice(2, -2).trim();
        return (
          <Text 
            key={`header-${index}`} 
            style={[styles.heading, isDarkMode && styles.darkText]}
          >
            {headerText}
          </Text>
        );
      }
      
      // SUBHEADERS (*Subheader:*)
      else if (paragraph.startsWith('*') && 
          (paragraph.endsWith('*:') || paragraph.endsWith('*'))) {
        // Remove asterisks and colon
        let subheaderText = paragraph.slice(1);
        if (subheaderText.endsWith('*:')) {
          subheaderText = subheaderText.slice(0, -2) + ':';
        } else if (subheaderText.endsWith('*')) {
          subheaderText = subheaderText.slice(0, -1);
        }
        
        return (
          <Text 
            key={`subhead-${index}`} 
            style={[styles.subheading, isDarkMode && styles.darkText]}
          >
            {subheaderText.trim()}
          </Text>
        );
      }
      
      // BULLET LISTS (paragraphs containing multiple lines with • bullets)
      else if (paragraph.includes('\n•')) {
        const lines = paragraph.split('\n');
        let title = '';
        
        // Check if the first line is a title (no bullet)
        if (!lines[0].trim().startsWith('•')) {
          title = lines[0].trim();
          lines.shift(); // Remove the title from lines
        }
        
        // Process remaining bullet points
        return (
          <View key={`list-${index}`} style={styles.listContainer}>
            {title && (
              <Text style={[styles.listTitle, isDarkMode && styles.darkText]}>
                {title}
              </Text>
            )}
            
            {lines.map((line, lineIndex) => {
              line = line.trim();
              if (!line) return null;
              
              // Handle bullet points
              if (line.startsWith('•')) {
                const bulletText = line.substring(1).trim();
                return (
                  <View key={`bullet-${lineIndex}`} style={styles.bulletItem}>
                    <Text style={[styles.bullet, isDarkMode && styles.darkText]}>•</Text>
                    <Text style={[styles.bulletText, isDarkMode && styles.darkText]}>
                      {bulletText}
                    </Text>
                  </View>
                );
              }
              
              // Non-bullet line in a bullet list section
              return (
                <Text 
                  key={`bullet-text-${lineIndex}`}
                  style={[styles.bulletText, isDarkMode && styles.darkText, {marginLeft: 18}]}
                >
                  {line}
                </Text>
              );
            })}
          </View>
        );
      }
      
      // NUMBERED LISTS (paragraphs with lines starting with 1., 2., etc.)
      else if (paragraph.includes('\n1.') || paragraph.match(/^\d+\.\s/)) {
        const lines = paragraph.split('\n');
        let title = '';
        let items = [];
        
        // Check if first line has a number
        if (!lines[0].match(/^\d+\.\s/)) {
          title = lines[0].trim();
          lines.shift();
        }
        
        // Collect all numbered items
        lines.forEach(line => {
          line = line.trim();
          if (line) {
            items.push(line);
          }
        });
        
        return (
          <View key={`numlist-${index}`} style={styles.listContainer}>
            {title && (
              <Text style={[styles.listTitle, isDarkMode && styles.darkText]}>
                {title}
              </Text>
            )}
            
            {items.map((item, itemIndex) => {
              // Extract number prefix if it exists
              const numMatch = item.match(/^(\d+)\.\s(.*)/);
              
              if (numMatch) {
                const num = numMatch[1];
                const text = numMatch[2];
                
                return (
                  <View key={`num-${itemIndex}`} style={styles.numberedItem}>
                    <Text style={[styles.number, isDarkMode && styles.darkText]}>{num}.</Text>
                    <Text style={[styles.numberedText, isDarkMode && styles.darkText]}>
                      {text}
                    </Text>
                  </View>
                );
              }
              
              // If somehow it got here without a number, display as regular text
              return (
                <Text 
                  key={`num-text-${itemIndex}`}
                  style={[styles.paragraph, isDarkMode && styles.darkText]}
                >
                  {item}
                </Text>
              );
            })}
          </View>
        );
      }
      
      // REGULAR PARAGRAPHS WITH INLINE FORMATTING
      else {
        // Handle paragraphs with bold text at the beginning
        if (paragraph.startsWith('**') && paragraph.includes('**', 2)) {
          const endBoldIndex = paragraph.indexOf('**', 2);
          if (endBoldIndex > 0) {
            const boldPart = paragraph.substring(2, endBoldIndex);
            const remainingText = paragraph.substring(endBoldIndex + 2);
            
            return (
              <Text key={`para-${index}`} style={[styles.paragraph, isDarkMode && styles.darkText]}>
                <Text style={styles.boldText}>{boldPart}</Text>
                {remainingText}
              </Text>
            );
          }
        }
        
        // Default paragraph
        return (
          <Text key={`para-${index}`} style={[styles.paragraph, isDarkMode && styles.darkText]}>
            {paragraph}
          </Text>
        );
      }
    });
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
          
          {/* Main scrollable content */}
          <Animated.ScrollView 
            style={[styles.mainScrollView, { opacity: fadeAnim }]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mainScrollContent}
          >
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
            <Animated.View 
              style={[styles.contentContainer, { transform: [{ scale: scaleAnim }] }]}
            >
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
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 80, // Space for the navigation footer
  },
  contentContainer: {
    padding: 20,
  },
  formattedContent: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 17,
    fontWeight: '600',
    color: '#444',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginVertical: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
  italicText: {
    fontStyle: 'italic',
  },
  listContainer: {
    marginVertical: 8,
  },
  listTitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 6,
    color: '#444',
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 16,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 24,
    marginRight: 8,
    color: '#444',
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  numberedItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 16,
  },
  number: {
    fontSize: 16,
    lineHeight: 24,
    marginRight: 8,
    color: '#444',
    width: 20,
  },
  numberedText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
});

export default ArticleDetailModal;
