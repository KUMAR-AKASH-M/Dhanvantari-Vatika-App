import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  PanResponder
} from 'react-native';

const { height } = Dimensions.get('window');

interface SlideUpModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDarkMode: boolean;
}

const SlideUpModal = ({ visible, onClose, title, children, isDarkMode }: SlideUpModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  
  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);
  
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeModal();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
    })
  ).current;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={closeModal}
    >
      <View style={[styles.modalOverlay, isDarkMode && styles.darkModalOverlay]}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          activeOpacity={1} 
          onPress={closeModal}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            isDarkMode && styles.darkModalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View 
            {...panResponder.panHandlers}
            style={[styles.modalHeader, isDarkMode && styles.darkModalHeader]}
          >
            <View style={[styles.modalHandle, isDarkMode && styles.darkModalHandle]} />
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
              {title}
            </Text>
          </View>
          
          <View style={styles.modalContentContainer}>
            {children}
          </View>
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
  darkModalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.9, // Increased from 70% to 90% of screen height
    paddingBottom: 20,
  },
  darkModalContainer: {
    backgroundColor: '#1e1e1e',
  },
  modalHeader: {
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkModalHeader: {
    borderBottomColor: '#333',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  darkModalHandle: {
    backgroundColor: '#777',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  darkText: {
    color: '#f0f0f0',
  },
  modalContentContainer: {
    flex: 1,
    padding: 15,
  },
});

export default SlideUpModal;
