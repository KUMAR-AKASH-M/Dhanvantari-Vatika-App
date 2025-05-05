import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Updated Plant interface to match HerbDetailModal expectations
interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  benefits: string[];
  howToUse?: string[];
  growingTips?: string[];
  position: { x: number; z: number };
  color: string;
  size: number;
  image?: any;
}

interface FallbackGardenViewProps {
  plants: Plant[];
  onPlantSelected: (plant: Plant) => void;
  isDarkMode: boolean;
}

const FallbackGardenView = ({ plants, onPlantSelected, isDarkMode }: FallbackGardenViewProps) => {
  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.headerContainer}>
        <Ionicons name="leaf-outline" size={24} color={isDarkMode ? "#4CAF50" : "#2E7D32"} />
        <Text style={[styles.header, isDarkMode && styles.darkText]}>
          Ayurvedic Garden
        </Text>
      </View>
      
      <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
        Explore medicinal plants in our 2D garden view
      </Text>
      
      <ScrollView style={styles.scrollView}>
        {plants.map((plant) => (
          <TouchableOpacity
            key={plant.id}
            style={[styles.plantCard, isDarkMode && styles.darkPlantCard]}
            onPress={() => onPlantSelected(plant)}
          >
            {plant.image ? (
              <Image 
                source={plant.image} 
                style={styles.plantImage} 
                resizeMode="contain"
              />
            ) : (
              <View style={[styles.plantIcon, { backgroundColor: plant.color }]}>
                <Ionicons name="leaf" size={24} color="#fff" />
              </View>
            )}
            <View style={styles.plantInfo}>
              <Text style={[styles.plantName, isDarkMode && styles.darkText]}>
                {plant.name}
              </Text>
              <Text style={[styles.scientificName, isDarkMode && styles.darkSubtext]}>
                {plant.scientificName}
              </Text>
              <Text style={[styles.description, isDarkMode && styles.darkSubtext]}>
                {plant.description}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={isDarkMode ? "#777" : "#aaa"} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, isDarkMode && styles.darkSubtext]}>
          3D view is not available on this device. Enjoy the 2D experience!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 15,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  plantCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkPlantCard: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  plantIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  plantInfo: {
    flex: 1,
    marginLeft: 15,
  },
  plantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 15,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  darkText: {
    color: '#e0e0e0',
  },
  darkSubtext: {
    color: '#aaa',
  },
});

export default FallbackGardenView;
