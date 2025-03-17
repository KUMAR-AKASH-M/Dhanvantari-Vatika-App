import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Image,
  Modal,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

// Props for the SavedHerbsModal
interface SavedHerbsModalProps {
  visible: boolean;
  toggleModal: (visible: boolean) => void;
  slideAnimation: Animated.Value;
  isDarkMode: boolean;
  savedHerbs: any[];
  onRemoveHerb: (herbId: string) => void;
  onViewHerb?: (herb: any) => void;
}

const SavedHerbsModal = ({ 
  visible, 
  toggleModal, 
  slideAnimation, 
  isDarkMode,
  savedHerbs = [],
  onRemoveHerb,
  onViewHerb
}: SavedHerbsModalProps) => {

  const renderHerbItem = ({ item }) => (
    <View style={[styles.herbItem, isDarkMode && styles.darkHerbItem]}>
      <Image 
        source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
        style={styles.herbImage} 
      />
      <View style={styles.herbDetails}>
        <Text style={[styles.herbName, isDarkMode && styles.darkText]}>
          {item.name}
        </Text>
        <Text style={[styles.scientificName, isDarkMode && styles.darkMutedText]}>
          {item.scientificName}
        </Text>
        <View style={styles.benefitsContainer}>
          {item.benefits && item.benefits.slice(0, 2).map((benefit, index) => (
            <View key={index} style={[styles.benefitTag, isDarkMode && styles.darkBenefitTag]}>
              <Text style={[styles.benefitText, isDarkMode && styles.darkBenefitText]}>
                {benefit}
              </Text>
            </View>
          ))}
          {item.benefits && item.benefits.length > 2 && (
            <View style={[styles.benefitTag, isDarkMode && styles.darkBenefitTag]}>
              <Text style={[styles.benefitText, isDarkMode && styles.darkBenefitText]}>
                +{item.benefits.length - 2}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => onViewHerb && onViewHerb(item)}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => onRemoveHerb(item.id)}
      >
        <Ionicons name="close-circle" size={20} color="#e91e63" />
      </TouchableOpacity>
    </View>
  );

  const noHerbsView = (
    <View style={styles.noItemsContainer}>
      <Ionicons 
        name="leaf-outline" 
        size={60} 
        color={isDarkMode ? "#555" : "#ccc"} 
      />
      <Text style={[styles.noItemsText, isDarkMode && styles.darkText]}>
        No saved herbs
      </Text>
      <Text style={[styles.noItemsSubText, isDarkMode && styles.darkMutedText]}>
        Herbs you save will appear here
      </Text>
    </View>
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => toggleModal(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => toggleModal(false)}
        />
        <Animated.View 
          style={[
            styles.modalContainer, 
            isDarkMode && styles.darkModalContainer,
            { transform: [{ translateY: slideAnimation }] }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
              Saved Herbs ({savedHerbs.length})
            </Text>
            <TouchableOpacity onPress={() => toggleModal(false)}>
              <Ionicons name="close" size={24} color={isDarkMode ? "#fff" : "#333"} />
            </TouchableOpacity>
          </View>

          <View style={styles.herbsList}>
            {savedHerbs.length === 0 ? (
              noHerbsView
            ) : (
              <FlatList
                data={savedHerbs}
                renderItem={renderHerbItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.herbsListContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          {savedHerbs.length > 0 && (
            <TouchableOpacity 
              style={[styles.viewAllButton, isDarkMode && styles.darkViewAllButton]}
              onPress={() => toggleModal(false)}
            >
              <Text style={styles.viewAllText}>Browse More Herbs</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    maxHeight: '90%',
    minHeight: '80%',
  },
  darkModalContainer: {
    backgroundColor: '#2a2a2a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
  herbsList: {
    flex: 1,
    minHeight: 300,
  },
  herbsListContent: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  herbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  darkHerbItem: {
    backgroundColor: '#333',
    borderBottomColor: '#444',
  },
  herbImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  herbDetails: {
    flex: 1,
    paddingRight: 10,
  },
  herbName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 6,
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
  viewButton: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    color: '#3e7d32',
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
  },
  viewAllButton: {
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  darkViewAllButton: {
    backgroundColor: 'rgba(62, 125, 50, 0.2)',
  },
  viewAllText: {
    color: '#3e7d32',
    fontSize: 15,
    fontWeight: '500',
  },
  noItemsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noItemsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
  },
  noItemsSubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  }
});

export default SavedHerbsModal;
