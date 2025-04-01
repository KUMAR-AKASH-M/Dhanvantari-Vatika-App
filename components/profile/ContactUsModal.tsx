import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  TextInput,
  Alert,
  Linking,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ContactUsModal = ({ visible, toggleModal, slideAnimation, isDarkMode }) => {
  if (!visible) return null;
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Missing Information', 'Please fill in both subject and message fields.');
      return;
    }
    
    // Here you would typically send the data to your backend
    Alert.alert(
      'Message Sent',
      'Thank you! We will respond to your inquiry within 24-48 hours.',
      [{ text: 'OK', onPress: () => toggleModal(false) }]
    );
  };

  const contactMethods = [
    {
      icon: 'mail-outline',
      label: 'Email Us',
      value: 'support@dhanvantarivatika.com',
      action: () => Linking.openURL('mailto:support@dhanvantarivatika.com')
    },
    {
      icon: 'call-outline',
      label: 'Call Us',
      value: '+91 800 555 7890',
      action: () => Linking.openURL('tel:+918005557890')
    },
    {
      icon: 'chatbubble-ellipses-outline',
      label: 'Live Chat',
      value: 'Available 9AM - 6PM',
      action: () => Alert.alert('Live Chat', 'Starting live chat session...')
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
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Contact Us</Text>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => toggleModal(false)}
        >
          <Ionicons name="close" size={24} color={isDarkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 80 }]} 
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Get in Touch</Text>
          
          <View style={styles.contactMethods}>
            {contactMethods.map((method, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.contactMethod, isDarkMode && styles.darkContactMethod]}
                onPress={method.action}
              >
                <Ionicons name={method.icon} size={24} color={isDarkMode ? "#8bc34a" : "#3e7d32"} />
                <View style={styles.contactMethodText}>
                  <Text style={[styles.contactMethodLabel, isDarkMode && styles.darkText]}>{method.label}</Text>
                  <Text style={[styles.contactMethodValue, isDarkMode && styles.darkMutedText]}>{method.value}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={isDarkMode ? "#888" : "#666"} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText, styles.formTitle]}>
            Send us a Message
          </Text>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, isDarkMode && styles.darkText]}>Subject</Text>
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="What is this regarding?"
                placeholderTextColor={isDarkMode ? "#888" : "#999"}
                value={subject}
                onChangeText={setSubject}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, isDarkMode && styles.darkText]}>Message</Text>
              <TextInput
                style={[styles.messageInput, isDarkMode && styles.darkInput]}
                placeholder="How can we help you?"
                placeholderTextColor={isDarkMode ? "#888" : "#999"}
                multiline
                numberOfLines={6}
                value={message}
                onChangeText={setMessage}
                textAlignVertical="top"
              />
            </View>
            
            <TouchableOpacity style={[styles.submitButton, { marginBottom: 20 }]} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // Added padding to ensure content is above the navigation bar
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  formTitle: {
    marginTop: 24,
  },
  contactMethods: {
    marginBottom: 16,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  darkContactMethod: {
    backgroundColor: '#2a2a2a',
  },
  contactMethodText: {
    flex: 1,
    marginLeft: 12,
  },
  contactMethodLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactMethodValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  form: {
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  darkInput: {
    backgroundColor: '#2a2a2a',
    color: '#f0f0f0',
  },
  messageInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3e7d32',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20, // Added extra margin at the bottom
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  }
});

export default ContactUsModal;
