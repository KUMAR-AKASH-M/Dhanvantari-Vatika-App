import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");

interface Plant {
  name: string;
  description: string;
  image: any;
}

interface HealingPlantsProps {
  plants: Plant[];
  onPlantPress: (plant: Plant) => void;
  onViewAllPress: () => void;
  isDarkMode: boolean; // Add theme prop
}

const HealingPlants = ({ plants, onPlantPress, onViewAllPress, isDarkMode }: HealingPlantsProps) => {
  return (
    <View style={[styles.section, isDarkMode && styles.darkSection]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Healing Plants</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={[styles.seeAll, isDarkMode && styles.darkText]}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.plantsGrid}>
        {plants.map((plant, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.plantCard, isDarkMode && styles.darkCard]}
            onPress={() => onPlantPress(plant)}
          >
            <Image source={plant.image} style={styles.plantImage} />
            <LinearGradient
              colors={['transparent', isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)']}
              style={styles.plantOverlay}
            >
              <Text style={styles.plantName}>{plant.name}</Text>
              <Text style={styles.plantDescription}>{plant.description}</Text>
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
  plantsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  plantCard: {
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
  plantImage: {
    width: "100%",
    height: "100%",
  },
  plantOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  plantName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: "bold",
  },
  plantDescription: {
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