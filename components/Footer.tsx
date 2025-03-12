import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface FooterProps {
  logoUri: string;
  copyright: string;
  tagline: string;
  isDarkMode: boolean; // Add this line
}

const Footer = ({ logoUri, copyright, tagline, isDarkMode }: FooterProps) => {
  return (
    <View style={[styles.footer, isDarkMode && styles.darkFooter]}>
      <Image 
        source={require('../assets/images/icon.png')} // Update this line
        style={styles.footerLogo} 
      />
      <Text style={[styles.footerText, isDarkMode && styles.darkText]}>{copyright}</Text>
      <Text style={[styles.footerSubtext, isDarkMode && styles.darkText]}>{tagline}</Text>
    </View>
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
    width: 40,
    height: 40,
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
  },
  darkText: {
    color: "#fff",
  },
});

export default Footer;