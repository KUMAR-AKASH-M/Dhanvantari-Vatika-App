import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';
import GardenView from '../../components/garden/GardenView';
import HerbDetailModal from '../../components/HerbDetailModal'; // Changed import
import FallbackGardenView from '../../components/garden/FallbackGardenView';
import { Ionicons } from '@expo/vector-icons';

// Plant/tree data with positions in the garden - modified to match HerbDetailModal expectations
const GARDEN_PLANTS = [
  {
    id: '1',
    name: 'Tulsi',
    scientificName: 'Ocimum sanctum',
    description: 'Sacred plant in Indian tradition with numerous health benefits.',
    benefits: [
      'Boosts immunity',
      'Reduces stress and anxiety',
      'Helps with respiratory disorders'
    ],
    howToUse: [
      'Make tulsi tea by steeping fresh or dried leaves in hot water for 5-7 minutes',
      'Add fresh tulsi leaves to salads or sandwiches',
      'Mix dried tulsi powder with honey for immunity boost',
      'Chew 5-6 fresh tulsi leaves daily on an empty stomach'
    ],
    growingTips: [
      'Plant in well-drained soil with plenty of sunlight',
      'Water regularly but avoid overwatering',
      'Pinch off flower buds to encourage leaf growth',
      'Protect from frost as tulsi is sensitive to cold'
    ],
    position: { x: 3, z: 4 },
    color: '#4CAF50',
    size: 2.0,
    image: require('../../assets/images/plants/tulsi.png'),
  },
  {
    id: '2',
    name: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    description: 'Adaptogenic herb that helps the body manage stress.',
    benefits: [
      'Reduces stress & anxiety',
      'Improves energy',
      'Enhances concentration'
    ],
    howToUse: [
      'Take 300-500mg of ashwagandha root extract twice daily with meals',
      'Mix ashwagandha powder with warm milk and honey before bedtime',
      'Add to smoothies or protein shakes for energy',
      'Apply ashwagandha oil topically for soothing sore muscles'
    ],
    growingTips: [
      'Grows best in dry, sandy soil with good drainage',
      'Needs full sun exposure and warm temperatures',
      'Water sparingly - tolerates drought conditions well',
      'Takes 150-180 days from planting to harvest'
    ],
    position: { x: -3, z: 4 },
    color: '#8BC34A',
    size: 4.0,
    image: require('../../assets/images/plants/ashwagandha.png'),
  },
  {
    id: '3',
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    description: 'Natural antiseptic & detoxifier with various medicinal properties.',
    benefits: [
      'Blood purifier',
      'Treats skin disorders',
      'Natural antibacterial'
    ],
    howToUse: [
      'Use neem oil diluted with carrier oil for skin conditions',
      'Take neem leaf capsules as directed for internal detoxification',
      'Make neem tea from dried leaves for blood purification',
      'Use neem-infused water for plants as a natural pesticide'
    ],
    growingTips: [
      'Requires tropical or subtropical climate to thrive',
      'Can grow in poor soil conditions but prefers well-drained soil',
      'Water deeply but infrequently',
      'Takes 3-5 years to mature and produce seeds'
    ],
    position: { x: 5, z: -2 },
    color: '#689F38',
    size: 4.5,
    image: require('../../assets/images/plants/neem.png'),
  },
  {
    id: '4',
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    description: 'Succulent plant species known for its medicinal properties.',
    benefits: [
      'Soothes skin irritation',
      'Supports digestive health',
      'Rich in antioxidants'
    ],
    howToUse: [
      'Apply fresh gel directly to skin for burns or irritation',
      'Mix aloe vera gel with water as a refreshing drink',
      'Use as a natural face mask for hydration',
      'Consume small amounts of aloe juice for digestive support'
    ],
    growingTips: [
      'Plant in well-draining, sandy soil',
      'Place in bright, indirect sunlight',
      'Allow soil to dry completely between waterings',
      'Protect from frost and cold temperatures'
    ],
    position: { x: -4, z: -3 },
    color: '#81C784',
    size: 1.0,
    image: require('../../assets/images/plants/aloevera.png'),
  },
  {
    id: '5',
    name: 'Amla',
    scientificName: 'Phyllanthus emblica',
    description: 'One of the richest sources of Vitamin C with powerful antioxidant properties.',
    benefits: [
      'Improves immunity',
      'Enhances digestion',
      'Promotes hair growth'
    ],
    howToUse: [
      'Consume fresh amla fruits or juice on an empty stomach',
      'Take dried amla powder with honey for immunity support',
      'Apply amla oil to hair roots for strengthening',
      'Mix amla powder with water for a revitalizing face pack'
    ],
    growingTips: [
      'Plant in full sun with moderate water',
      'Prefers well-drained, loamy soil',
      'Space trees at least 10 meters apart for proper growth',
      'Fertilize with organic compost during growing season'
    ],
    position: { x: 0, z: 0 },
    color: '#7CB342',
    size: 6.0,
    image: require('../../assets/images/plants/amla.png'),
  },
  {
    id: '6',
    name: 'Brahmi',
    scientificName: 'Bacopa monnieri',
    description: 'Traditional brain tonic that enhances memory and cognitive function.',
    benefits: [
      'Memory enhancement',
      'Cognitive function',
      'Reduces anxiety',
      'Improves focus'
    ],
    howToUse: [
      'Take 300-500mg of Brahmi extract twice daily',
      'Add fresh Brahmi leaves to salads or sandwiches',
      'Prepare Brahmi tea by steeping leaves in hot water',
      'Apply Brahmi oil to scalp to promote hair growth'
    ],
    growingTips: [
      'Grows well in moist, swampy areas or in water gardens',
      'Prefers full sun to partial shade',
      'Keep soil consistently moist or grow in standing water',
      'Easy to propagate from cuttings or division'
    ],
    position: { x: 7, z: 5 },
    color: '#A5D6A7',
    size: 1.5,
    image: require('../../assets/images/plants/brahmi.png'),
  },
  {
    id: '7',
    name: 'Shatavari',
    scientificName: 'Asparagus racemosus',
    description: "Known as the 'Queen of Herbs' in Ayurveda, particularly beneficial for women's health.",
    benefits: [
      'Supports female reproductive health',
      'Improves lactation',
      'Boosts immunity',
      'Aids digestion'
    ],
    howToUse: [
      'Take 1-2 teaspoons of Shatavari powder with warm milk and honey',
      'Use Shatavari ghee for cooking',
      'Drink Shatavari tea by steeping the root in hot water',
      'Take as a supplement following recommended dosage'
    ],
    growingTips: [
      'Prefers well-drained, sandy soil with good organic matter',
      'Requires full sun to partial shade',
      'Water moderately, allowing soil to dry between waterings',
      'Takes 1-2 years to establish before harvesting roots'
    ],
    position: { x: -7, z: -6 },
    color: '#C5E1A5',
    size: 3.0,
    image: require('../../assets/images/plants/shatavari.png'),
  },
  {
    id: '8',
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    description: 'Powerful anti-inflammatory herb with bright yellow color, used in cooking and medicine.',
    benefits: [
      'Reduces inflammation',
      'Powerful antioxidant',
      'Supports joint health',
      'Improves digestion'
    ],
    howToUse: [
      'Add fresh or dried turmeric to curries and other dishes',
      'Prepare golden milk by mixing turmeric powder with warm milk and honey',
      'Mix with honey for a soothing throat remedy',
      'Apply paste externally for skin conditions'
    ],
    growingTips: [
      'Plant rhizomes in spring after danger of frost has passed',
      'Prefers rich, well-draining soil',
      'Needs plenty of water during growing season',
      'Harvest 8-10 months after planting when leaves turn yellow'
    ],
    position: { x: 8, z: -5 },
    color: '#FFD54F',
    size: 2.0,
    image: require('../../assets/images/plants/turmeric.png'),
  },
  {
    id: '9',
    name: 'Ginger',
    scientificName: 'Zingiber officinale',
    description: 'Pungent aromatic rhizome used widely in cooking and traditional medicine systems.',
    benefits: [
      'Relieves nausea',
      'Reduces muscle pain',
      'Anti-inflammatory properties',
      'Aids digestion'
    ],
    howToUse: [
      'Make ginger tea by steeping fresh ginger in hot water',
      'Add fresh or dried ginger to cooking for flavor and health benefits',
      'Chew a small piece of fresh ginger to relieve nausea',
      'Apply ginger oil diluted with carrier oil for muscle pain'
    ],
    growingTips: [
      'Plant pieces of rhizome with growth buds in spring',
      'Prefers partial shade, rich soil, and humid conditions',
      'Water regularly but avoid waterlogging',
      'Harvest 8-10 months after planting'
    ],
    position: { x: -8, z: 2 },
    color: '#FFE082',
    size: 1.8,
    image: require('../../assets/images/plants/ginger.png'),
  },
  {
    id: '10',
    name: 'Licorice',
    scientificName: 'Glycyrrhiza glabra',
    description: 'Sweet-tasting root used in traditional medicine for its anti-inflammatory properties.',
    benefits: [
      'Soothes digestive issues',
      'Relieves respiratory problems',
      'Anti-inflammatory effects',
      'Supports adrenal function'
    ],
    howToUse: [
      'Prepare licorice tea by steeping the root in hot water',
      'Use licorice extract as directed',
      'Chew on licorice root sticks for oral health',
      'Add to herbal formulations for flavor and therapeutic effects'
    ],
    growingTips: [
      'Needs well-draining, fertile soil rich in nitrogen',
      'Prefers full sun exposure',
      'Establish plants from root cuttings or divisions',
      'Takes 3-4 years before roots are ready for harvest'
    ],
    position: { x: 3, z: -7 },
    color: '#D7CCC8',
    size: 2.2,
    image: require('../../assets/images/plants/licorice.png'),
  }
];

const VirtualGarden = () => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHerb, setSelectedHerb] = useState(null); // Changed variable name
  const [showHerbDetail, setShowHerbDetail] = useState(false); // Changed variable name
  const [use3DFallback, setUse3DFallback] = useState(false);
  const [controlMode, setControlMode] = useState('joystick'); // 'joystick' or 'buttons'
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Handle scene loaded
  const handleSceneLoaded = () => {
    console.log('Scene loaded successfully');
    setIsLoading(false);
    setLoadingError(null);
  };

  // Handle scene error with more detailed error message
  const handleSceneError = (error) => {
    console.error('Scene error:', error);
    setLoadingError(error.message || 'Failed to load garden view');
    setUse3DFallback(true);
    setIsLoading(false);
  };

  // Auto-fallback after timeout if garden doesn't load
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('Garden view timed out, switching to fallback view');
        setLoadingError('Loading timed out. Switching to 2D view.');
        setUse3DFallback(true);
        setIsLoading(false);
      }
    }, 5000); // 5 seconds timeout (reduced from 8)

    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Handle plant selection - renamed to herb for consistency
  const handleHerbSelected = (plant) => {
    setSelectedHerb(plant);
    setShowHerbDetail(true);
  };

  // Toggle control mode
  const toggleControlMode = () => {
    setControlMode(prev => prev === 'joystick' ? 'buttons' : 'joystick');
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Header title="Virtual Garden" />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? "#fff" : "#000"} />
          <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
            Loading Garden...
          </Text>
        </View>
      )}

      {loadingError && !isLoading && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{loadingError}</Text>
        </View>
      )}

      {use3DFallback ? (
        <FallbackGardenView
          plants={GARDEN_PLANTS}
          onPlantSelected={handleHerbSelected} // Function name kept for compatibility
          isDarkMode={isDarkMode}
        />
      ) : (
        <GardenView 
          plants={GARDEN_PLANTS} 
          onPlantSelected={handleHerbSelected} // Function name kept for compatibility
          onSceneLoaded={handleSceneLoaded}
          onSceneError={handleSceneError}
          isDarkMode={isDarkMode}
          controlMode={controlMode}
        />
      )}

      {/* Changed to HerbDetailModal */}
      <HerbDetailModal
        visible={showHerbDetail}
        herb={selectedHerb}
        onClose={() => setShowHerbDetail(false)}
        isDarkMode={isDarkMode}
      />

      <TouchableOpacity 
        style={[
          styles.controlModeButton, 
          isDarkMode && styles.darkControlModeButton
        ]}
        onPress={toggleControlMode}
      >
        <Ionicons 
          name={controlMode === 'joystick' ? "game-controller-outline" : "apps-outline"} 
          size={24} 
          color={isDarkMode ? "#fff" : "#333"} 
        />
        <Text style={[styles.controlModeText, isDarkMode && styles.darkText]}>
          {controlMode === 'joystick' ? "Joystick" : "Buttons"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
  },
  darkText: {
    color: '#ffffff',
  },
  controlModeButton: {
    position: 'absolute',
    bottom: 90,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 30,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkControlModeButton: {
    backgroundColor: 'rgba(50,50,50,0.7)',
  },
  controlModeText: {
    marginLeft: 5,
    color: '#333',
    fontWeight: 'bold',
  },
  errorBanner: {
    padding: 10,
    backgroundColor: 'rgba(200, 0, 0, 0.8)',
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default VirtualGarden;
