import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  Modal,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { height } = Dimensions.get('window');

const EditProfileModal = ({ 
  visible, 
  toggleModal, 
  slideAnimation, 
  isDarkMode,
  userData,
  profileImage,
  onSaveChanges
}) => {
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [phone, setPhone] = useState(userData.phone);
  const [address, setAddress] = useState(userData.address);
  const [image, setImage] = useState(profileImage.uri);

  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        "Permission Denied",
        "We need access to your photos to set a profile picture.",
        [{ text: "OK" }]
      );
      return;
    }

    // Launch the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    onSaveChanges({
      name,
      email,
      phone,
      address,
      profileImage: { uri: image }
    });
    toggleModal(false);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={() => toggleModal(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.dismissArea} 
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
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={() => toggleModal(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Profile Picture Selection */}
              <View style={styles.profileImageContainer}>
                <Image 
                  source={{ uri: image }} 
                  style={styles.profileImagePreview} 
                />
                <TouchableOpacity 
                  style={styles.changePhotoButton}
                  onPress={pickImage}
                >
                  <Ionicons name="camera" size={18} color="#fff" style={styles.cameraIcon} />
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.inputLabel, isDarkMode && styles.darkText]}>Name</Text>
              <TextInput 
                style={[styles.textInput, isDarkMode && styles.darkTextInput]}
                value={name}
                onChangeText={setName}
                placeholder="Your Name"
                placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
              />
              
              <Text style={[styles.inputLabel, isDarkMode && styles.darkText]}>Email</Text>
              <TextInput 
                style={[styles.textInput, isDarkMode && styles.darkTextInput]}
                value={email}
                onChangeText={setEmail}
                placeholder="Your Email"
                placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                keyboardType="email-address"
              />
              
              <Text style={[styles.inputLabel, isDarkMode && styles.darkText]}>Phone</Text>
              <TextInput 
                style={[styles.textInput, isDarkMode && styles.darkTextInput]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Your Phone"
                placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                keyboardType="phone-pad"
              />
              
              <Text style={[styles.inputLabel, isDarkMode && styles.darkText]}>Address</Text>
              <TextInput 
                style={[styles.textInput, styles.textAreaInput, isDarkMode && styles.darkTextInput]}
                value={address}
                onChangeText={setAddress}
                placeholder="Your Address"
                placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
                multiline
                numberOfLines={3}
              />
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => toggleModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dismissArea: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.95, // Increased from 0.85 to 0.95
    minHeight: height * 0.8, // Added minimum height for better UX
  },
  darkModalContainer: {
    backgroundColor: '#2a2a2a',
  },
  keyboardView: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
    flex: 1, // Add flex 1 to ensure content takes available space
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkTextInput: {
    backgroundColor: '#3a3a3a',
    color: '#fff',
    borderColor: '#555',
  },
  textAreaInput: {
    height: 100, // Increased height for address field
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 1.5,
    backgroundColor: '#3e7d32',
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  darkText: {
    color: '#f0f0f0',
  },
  // New styles for profile image
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#3e7d32',
  },
  changePhotoButton: {
    backgroundColor: '#3e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  cameraIcon: {
    marginRight: 6,
  },
  changePhotoText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default EditProfileModal;
