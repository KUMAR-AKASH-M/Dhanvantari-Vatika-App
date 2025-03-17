import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useSavedHerbs } from "../../context/HerbContext";

type HerbCardProps = {
  herb: any;
  isDarkMode: boolean;
  isFavorite: boolean;
  onPress: (herb: any) => void;
  onToggleFavorite: (herbId: string) => void;
  fadeAnim: Animated.Value;
};

const HerbCard: React.FC<HerbCardProps> = ({ 
  herb, 
  isDarkMode, 
  isFavorite,
  onPress, 
  onToggleFavorite,
  fadeAnim
}) => {
  // Access the saved herbs context
  const { isInSavedHerbs } = useSavedHerbs();
  
  // Check if herb is in saved herbs from context
  const isHerbSaved = isInSavedHerbs(herb.id);
  
  // Sync UI state with context state
  useEffect(() => {
    // If the UI state doesn't match the context state, update it
    if (isFavorite !== isHerbSaved) {
      onToggleFavorite(herb.id);
    }
  }, [isHerbSaved]);
  
  // Handle favorite toggle using the parent's handler
  const handleToggleFavorite = (herbId: string) => {
    onToggleFavorite(herbId);
  };
  
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity 
        style={[styles.herbCard, isDarkMode && styles.darkHerbCard]}
        onPress={() => onPress(herb)}
        activeOpacity={0.9}
      >
        {/* Favorite Button */}
        <TouchableOpacity 
          style={[styles.favoriteButton, isFavorite && styles.activeFavoriteButton]} 
          onPress={() => handleToggleFavorite(herb.id)}
          activeOpacity={0.9}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={18} 
            color="#fff" 
          />
        </TouchableOpacity>

        <Image source={herb.image} style={styles.herbImage} />
        <View style={styles.herbContent}>
          <View style={styles.herbHeader}>
            <Text style={[styles.herbName, isDarkMode && styles.darkText]} numberOfLines={1}>
              {herb.name}
            </Text>
          </View>
          
          <Text style={[styles.scientificName, isDarkMode && styles.darkMutedText]}>
            {herb.scientificName}
          </Text>
          
          <View style={styles.classificationContainer}>
            <Ionicons name="leaf" size={14} color={isDarkMode ? "#8bc34a" : "#3e7d32"} />
            <Text style={[styles.classificationText, isDarkMode && styles.darkMutedText]}>
              {herb.classification || 'Medicinal Herb'}
            </Text>
          </View>
          
          <View style={styles.benefitsContainer}>
            {herb.benefits.slice(0, 2).map((benefit, index) => (
              <View key={index} style={[styles.benefitTag, isDarkMode && styles.darkBenefitTag]}>
                <Text style={[styles.benefitText, isDarkMode && styles.darkBenefitText]}>
                  {benefit}
                </Text>
              </View>
            ))}
            {herb.benefits.length > 2 && (
              <View style={[styles.benefitTag, isDarkMode && styles.darkBenefitTag]}>
                <Text style={[styles.benefitText, isDarkMode && styles.darkBenefitText]}>
                  +{herb.benefits.length - 2}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.tapIndicator}>
            <Ionicons 
              name="information-circle-outline" 
              size={12} 
              color={isDarkMode ? "#8bc34a" : "#3e7d32"} 
            />
            <Text style={[styles.tapIndicatorText, isDarkMode && styles.darkMutedText]}>
              Tap to learn more
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  herbCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  darkHerbCard: {
    backgroundColor: '#2a2a2a',
    borderColor: 'rgba(255,255,255,0.05)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  activeFavoriteButton: {
    backgroundColor: '#e91e63',
  },
  herbImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  herbContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  herbHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  herbName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  scientificName: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 5,
  },
  classificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  classificationText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  benefitTag: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  darkBenefitTag: {
    backgroundColor: 'rgba(62, 125, 50, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(139, 195, 74, 0.3)',
  },
  benefitText: {
    color: '#3e7d32',
    fontSize: 10,
    fontWeight: '500',
  },
  darkBenefitText: {
    color: '#8bc34a',
  },
  tapIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    opacity: 0.7,
  },
  tapIndicatorText: {
    fontSize: 11,
    color: '#777',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
});

export default HerbCard;
