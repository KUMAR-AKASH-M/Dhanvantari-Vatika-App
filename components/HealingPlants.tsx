import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get("window");

// Update interface to match herb structure
interface Herb {
  id: string;
  name: string;
  description: string;
  image: any;
  scientificName: string;
  benefits?: string[];
  howToUse?: string[];
  growingTips?: string[];
  category?: string;
}

interface HealingPlantsProps {
  plants: Herb[];
  onPlantPress: (herb: Herb) => void;
  onViewAllPress: () => void;
  isDarkMode: boolean;
  navigateToHerbs?: boolean;
}

// Rename component to MedicinalHerbs for consistency, but keep export as HealingPlants
const HealingPlants = ({ 
  plants, 
  onPlantPress, 
  onViewAllPress, 
  isDarkMode,
  navigateToHerbs = true 
}: HealingPlantsProps) => {
  const router = useRouter();
  
  const handleViewAllPress = () => {
    if (navigateToHerbs) {
      // Navigate to the herbs tab
      router.push('/herbs');
    } else {
      // Use the provided callback function for other cases
      onViewAllPress();
    }
  };

  return (
    <View style={[styles.section, isDarkMode && styles.darkSection]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Medicinal Herbs</Text>
        <TouchableOpacity onPress={handleViewAllPress}>
          <Text style={[styles.seeAll, isDarkMode && styles.darkText]}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.herbsGrid}>
        {plants.map((herb, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.herbCard, isDarkMode && styles.darkCard]}
            onPress={() => onPlantPress(herb)}
            activeOpacity={0.8}
          >
            <Image source={herb.image} style={styles.herbImage} />
            <LinearGradient
              colors={['transparent', isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)']}
              style={styles.herbOverlay}
            >
              <Text style={styles.herbName}>{herb.name}</Text>
              <Text style={styles.herbDescription} numberOfLines={2}>{herb.description}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
  seeAll: {
    color: "#3e7d32",
    fontSize: 14,
    fontWeight: "500",
  },
  herbsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  herbCard: {
    width: width / 2 - 30,
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: 'relative',
  },
  herbImage: {
    width: "100%",
    height: "100%",
  },
  herbOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  herbName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: "bold",
  },
  herbDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 4,
  },
  darkSection: {
    backgroundColor: "#121212",
  },
  darkCard: {
    backgroundColor: "#333",
  },
});

export default HealingPlants;