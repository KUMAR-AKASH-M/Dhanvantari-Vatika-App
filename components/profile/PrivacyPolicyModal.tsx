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

const PrivacyPolicyModal = ({ visible, toggleModal, slideAnimation, isDarkMode }) => {
  if (!visible) return null;

  const privacyPolicySections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as your name, email address, phone number, and home address when you create an account. We also collect information about your interactions with our app and website, including the products you view, purchase history, and usage metrics.'
    },
    {
      title: 'How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you related information including confirmations, receipts, invoices, technical notices, updates, security alerts, and support messages, to respond to your comments, questions, and requests.'
    },
    {
      title: 'Information Sharing',
      content: 'We do not share your personal information with any third parties except in the following circumstances: with your consent, with our service providers who help us operate our business, for legal reasons, or in connection with a merger, sale of company assets, financing, or acquisition.'
    },
    {
      title: 'Your Choices',
      content: 'You may update, correct, or delete your account information at any time by logging into your account or emailing us. You may opt out of receiving promotional communications from us by following the instructions in those messages.'
    },
    {
      title: 'Data Security',
      content: 'We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.'
    },
    {
      title: 'Children\'s Privacy',
      content: 'Our services are not intended for children under 13 years of age, and we do not knowingly collect personal information from children under 13. If we learn we have collected personal information from a child under 13, we will delete that information.'
    },
    {
      title: 'Changes to this Policy',
      content: 'We may update this privacy policy from time to time. If we make material changes, we will notify you through the app or by email. Your continued use of our services after such notice indicates your consent to the updated policy.'
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
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Privacy Policy</Text>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => toggleModal(false)}
        >
          <Ionicons name="close" size={24} color={isDarkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.lastUpdated, isDarkMode && styles.darkMutedText]}>
          Last Updated: June 1, 2023
        </Text>
        
        <Text style={[styles.introduction, isDarkMode && styles.darkText]}>
          Dhanvantari Vatika ("we," "our," or "us") is committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, and share information about you 
          when you use our mobile applications, websites, and other online products and services 
          (collectively, the "Services").
        </Text>

        {privacyPolicySections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
              {section.title}
            </Text>
            <Text style={[styles.sectionContent, isDarkMode && styles.darkMutedText]}>
              {section.content}
            </Text>
          </View>
        ))}
        
        <View style={styles.contactSection}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Contact Us
          </Text>
          <Text style={[styles.sectionContent, isDarkMode && styles.darkMutedText]}>
            If you have any questions about this Privacy Policy or our privacy practices, 
            please contact us at:
          </Text>
          <Text style={[styles.contactInfo, isDarkMode && styles.darkText]}>
            privacy@dhanvantarivatika.com
          </Text>
          <Text style={[styles.contactInfo, isDarkMode && styles.darkText]}>
            Dhanvantari Vatika Pvt. Ltd.
          </Text>
          <Text style={[styles.contactInfo, isDarkMode && styles.darkText]}>
            123 Herbal Lane, Mumbai, Maharashtra, India
          </Text>
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
    padding: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  introduction: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  contactSection: {
    marginTop: 8,
    marginBottom: 32,
  },
  contactInfo: {
    fontSize: 15,
    marginTop: 6,
    fontWeight: '500',
  }
});

export default PrivacyPolicyModal;
