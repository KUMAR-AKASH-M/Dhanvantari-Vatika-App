import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Define proper Plant interface
interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  benefits: string[];
  position?: { x: number; z: number };
  color: string;
  size: number;
  image?: any; // Added image property
}

interface PlantInfoModalProps {
  visible: boolean;
  plant: Plant | null;
  onClose: () => void;
  isDarkMode: boolean;
}

const PlantInfoModal = ({ visible, plant, onClose, isDarkMode }: PlantInfoModalProps) => {
  // Return null if plant is null or visible is false
  if (!plant || !visible) return null;
  
  const gradientColors = isDarkMode 
    ? ['#0d3320', '#0f241a'] 
    : ['#4caf50', '#2e7d32'];
    
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[
        styles.modalContainer, 
        isDarkMode ? styles.darkModalContainer : null
      ]}>
        <View style={[
          styles.modalContent, 
          isDarkMode ? styles.darkModalContent : null
        ]}>
          <LinearGradient 
            colors={gradientColors}
            style={styles.header}
          >
            <Text style={styles.plantName}>{plant.name || 'Unknown Plant'}</Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
          
          <ScrollView style={styles.scrollContent}>
            {plant.image && (
              <View style={styles.imageContainer}>
                <Image 
                  source={plant.image} 
                  style={styles.plantImage}
                  resizeMode="contain"
                />
              </View>
            )}
            
            <Text style={[
              styles.scientificName, 
              isDarkMode ? styles.darkText : null
            ]}>
              {plant.scientificName || 'Scientific name not available'}
            </Text>
            
            <Text style={[
              styles.description, 
              isDarkMode ? styles.darkText : null
            ]}>
              {plant.description || 'No description available'}
            </Text>
            
            <Text style={[
              styles.benefitsTitle, 
              isDarkMode ? styles.darkText : null
            ]}>
              Key Benefits:
            </Text>
            
            {plant.benefits && plant.benefits.length > 0 ? 
              plant.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons 
                    name="leaf" 
                    size={16} 
                    color={isDarkMode ? "#4CAF50" : "#2E7D32"} 
                  />
                  <Text style={[
                    styles.benefitText, 
                    isDarkMode ? styles.darkText : null
                  ]}>
                    {benefit}
                  </Text>
                </View>
              ))
              :
              <Text style={[styles.benefitText, isDarkMode ? styles.darkText : null]}>
                No benefits information available
              </Text>
            }
            
            {plant.position && (
              <View style={styles.growingInfo}>
                <Text style={[
                  styles.plantingTitle,
                  isDarkMode ? styles.darkText : null
                ]}>
                  Position in Garden
                </Text>
                
                <View style={[
                  styles.positionInfo,
                  isDarkMode && styles.darkPositionInfo
                ]}>
                  <Text style={[
                    styles.positionText,
                    isDarkMode ? styles.darkText : null
                  ]}>
                    X: {plant.position.x}, Z: {plant.position.z}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.findButton}
                  onPress={onClose}
                >
                  <Ionicons name="navigate" size={18} color="#fff" />
                  <Text style={styles.findButtonText}>Return to Garden</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  darkModalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
  },
  darkModalContent: {
    backgroundColor: '#1e1e1e',
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plantName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  scrollContent: {
    padding: 20,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 10,
  },
  benefitText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 10,
  },
  plantingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  darkText: {
    color: '#e0e0e0',
  },
  growingInfo: {
    marginTop: 10,
    marginBottom: 20,
  },
  positionInfo: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
  },
  darkPositionInfo: {
    backgroundColor: '#2a2a2a',
  },
  positionText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  findButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  findButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  plantImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});

export default PlantInfoModal;
