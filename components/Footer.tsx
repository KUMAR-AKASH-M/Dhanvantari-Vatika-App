import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

interface FooterProps {
  logoUri: string;
  copyright: string;
  tagline: string;
  isDarkMode: boolean;
}

const Footer = ({ logoUri, copyright, tagline, isDarkMode }: FooterProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const router = useRouter();

  const gardenNames = [
    "Garden 1",
    "Garden 2",
    "Garden 3"
  ];

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleGardenPress = (gardenName: string) => {
    console.log(`Selected garden: ${gardenName}`);
    closeModal();
    
    // Navigate to the VR Garden View screen with the selected garden name using Expo Router
    router.push({ pathname: "/vr-garden-view", params: { gardenName } });
  };

  return (
    <>
      <TouchableOpacity onPress={openModal} activeOpacity={0.8}>
        <View style={[styles.footer, isDarkMode && styles.darkFooter]}>
          <Image 
            source={require('../assets/images/icon.png')}
            style={styles.footerLogo} 
          />
          <Text style={[styles.footerText, isDarkMode && styles.darkText]}>{copyright}</Text>
          <Text style={[styles.footerSubtext, isDarkMode && styles.darkText]}>{tagline}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeModal}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] },
              isDarkMode && styles.darkModalContent
            ]}
          >
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
              Select a Garden
            </Text>
            
            {gardenNames.map((garden, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.gardenItem, isDarkMode && styles.darkGardenItem]}
                onPress={() => handleGardenPress(garden)}
              >
                <Text style={[styles.gardenText, isDarkMode && styles.darkText]}>
                  {garden}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 25,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 10,
  },
  footerLogo: {
    width: 70,
    height: 70,
    marginBottom: 10,
    borderRadius: 20,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#555",
  },
  footerSubtext: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  darkFooter: {
    backgroundColor: "#333",
    borderTopColor: "#444",
  },
  darkText: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  darkModalContent: {
    backgroundColor: '#222',
  },
  modalHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  gardenItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkGardenItem: {
    borderBottomColor: '#444',
  },
  gardenText: {
    fontSize: 16,
  },
  darkText: {
    color: '#fff',
  },
});

export default Footer;