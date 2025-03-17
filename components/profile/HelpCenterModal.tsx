import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HelpCenterModal = ({ visible, toggleModal, slideAnimation, isDarkMode }) => {
  if (!visible) return null;

  const helpSections = [
    {
      title: 'Account & Profile',
      icon: 'person-circle-outline',
      items: [
        'How to create an account',
        'Updating profile information',
        'Change your password',
        'Account security settings'
      ]
    },
    {
      title: 'Orders & Payments',
      icon: 'cart-outline',
      items: [
        'Placing an order',
        'Tracking your order',
        'Payment methods',
        'Returns and refunds'
      ]
    },
    {
      title: 'Products & Remedies',
      icon: 'leaf-outline',
      items: [
        'Finding the right herb',
        'Understanding remedy descriptions',
        'Herb dosage guidelines',
        'Product quality standards'
      ]
    },
    {
      title: 'App Features',
      icon: 'phone-portrait-outline',
      items: [
        'How to use the herb scanner',
        'Saving favorites',
        'Reading recommendations',
        'Changing app settings'
      ]
    }
  ];

  return (
    <Animated.View 
      style={[
        styles.modalContainer, 
        { transform: [{ translateY: slideAnimation }] },
        isDarkMode && styles.darkModalContainer
      ]}
    >
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Help Center</Text>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => toggleModal(false)}
        >
          <Ionicons name="close" size={24} color={isDarkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {helpSections.map((section, index) => (
          <View key={index} style={[styles.section, isDarkMode && styles.darkSection]}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon} size={22} color={isDarkMode ? "#8bc34a" : "#3e7d32"} />
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{section.title}</Text>
            </View>
            
            {section.items.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.helpItem}>
                <Text style={[styles.helpText, isDarkMode && styles.darkText]}>{item}</Text>
                <Ionicons name="chevron-forward" size={18} color={isDarkMode ? "#999" : "#666"} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
        
        <View style={styles.contactFooter}>
          <Text style={[styles.footerText, isDarkMode && styles.darkMutedText]}>
            Can't find what you're looking for?
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '85%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  darkModalContainer: {
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkHeader: {
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  darkSection: {
    backgroundColor: '#2a2a2a',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  helpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  helpText: {
    fontSize: 15,
  },
  contactFooter: {
    alignItems: 'center',
    marginVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  contactButton: {
    backgroundColor: '#3e7d32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default HelpCenterModal;
