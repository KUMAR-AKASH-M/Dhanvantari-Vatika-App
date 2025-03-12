import React, { useState } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  ScrollView,
  Switch
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import Header from "../../components/Header";

const PROFILE_IMAGE = { uri: 'https://randomuser.me/api/portraits/women/65.jpg' };

// Sample profile data
const USER_DATA = {
  name: "Anjali Sharma",
  email: "anjali.sharma@example.com",
  phone: "+91 98765 43210",
  memberSince: "June 2022",
  address: "123 Park Street, Mumbai, Maharashtra",
};

export default function ProfileScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  // Theme change handler
  const handleThemeChange = (isDark: boolean) => {
    setIsDarkMode(isDark);
    console.log("Theme changed to:", isDark ? "dark" : "light");
  };

  // Menu items for profile
  const menuItems = [
    { 
      id: 'orders', 
      title: 'My Orders', 
      icon: 'cart-outline',
      badge: 2
    },
    { 
      id: 'saved', 
      title: 'Saved Items', 
      icon: 'heart-outline',
      badge: 5
    },
    { 
      id: 'appointments', 
      title: 'My Appointments', 
      icon: 'calendar-outline',
      badge: 1
    },
    { 
      id: 'consultations', 
      title: 'Consultations', 
      icon: 'chatbubbles-outline',
      badge: 0
    },
    { 
      id: 'remedies', 
      title: 'Saved Remedies', 
      icon: 'leaf-outline',
      badge: 3
    },
  ];

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <Header 
        isDarkMode={isDarkMode}
        onThemeChange={handleThemeChange}
        title="My Profile"
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, isDarkMode && styles.darkProfileHeader]}>
          <Image source={PROFILE_IMAGE} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, isDarkMode && styles.darkText]}>
              {USER_DATA.name}
            </Text>
            <Text style={[styles.profileEmail, isDarkMode && styles.darkMutedText]}>
              {USER_DATA.email}
            </Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Profile Menu */}
        <View style={[styles.menuSection, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            My Account
          </Text>
          
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={[styles.menuItem, isDarkMode && styles.darkMenuItem]}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, isDarkMode && styles.darkMenuIconContainer]}>
                  <Ionicons name={item.icon} size={20} color={isDarkMode ? "#3e7d32" : "#3e7d32"} />
                </View>
                <Text style={[styles.menuItemText, isDarkMode && styles.darkText]}>
                  {item.title}
                </Text>
              </View>
              
              <View style={styles.menuItemRight}>
                {item.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#aaa" : "#999"} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Settings Section */}
        <View style={[styles.menuSection, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Settings
          </Text>
          
          <View style={[styles.menuItem, isDarkMode && styles.darkMenuItem]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, isDarkMode && styles.darkMenuIconContainer]}>
                <Ionicons name="notifications-outline" size={20} color={isDarkMode ? "#3e7d32" : "#3e7d32"} />
              </View>
              <Text style={[styles.menuItemText, isDarkMode && styles.darkText]}>
                Push Notifications
              </Text>
            </View>
            
            <Switch
              trackColor={{ false: "#ddd", true: "#c8e6c9" }}
              thumbColor={notifications ? "#3e7d32" : isDarkMode ? "#888" : "#f4f3f4"}
              ios_backgroundColor="#ddd"
              onValueChange={setNotifications}
              value={notifications}
            />
          </View>
          
          <View style={[styles.menuItem, isDarkMode && styles.darkMenuItem]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, isDarkMode && styles.darkMenuIconContainer]}>
                <Ionicons name="mail-outline" size={20} color={isDarkMode ? "#3e7d32" : "#3e7d32"} />
              </View>
              <Text style={[styles.menuItemText, isDarkMode && styles.darkText]}>
                Email Updates
              </Text>
            </View>
            
            <Switch
              trackColor={{ false: "#ddd", true: "#c8e6c9" }}
              thumbColor={emailUpdates ? "#3e7d32" : isDarkMode ? "#888" : "#f4f3f4"}
              ios_backgroundColor="#ddd"
              onValueChange={setEmailUpdates}
              value={emailUpdates}
            />
          </View>
          
          <TouchableOpacity style={[styles.menuItem, isDarkMode && styles.darkMenuItem]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, isDarkMode && styles.darkMenuIconContainer]}>
                <Ionicons name="language-outline" size={20} color={isDarkMode ? "#3e7d32" : "#3e7d32"} />
              </View>
              <Text style={[styles.menuItemText, isDarkMode && styles.darkText]}>
                Language
              </Text>
            </View>
            
            <View style={styles.menuItemRight}>
              <Text style={[styles.menuItemValue, isDarkMode && styles.darkMutedText]}>English</Text>
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#aaa" : "#999"} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Support Section */}
        <View style={[styles.menuSection, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Support
          </Text>
          
          <TouchableOpacity style={[styles.menuItem, isDarkMode && styles.darkMenuItem]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, isDarkMode && styles.darkMenuIconContainer]}>
                <Ionicons name="help-circle-outline" size={20} color={isDarkMode ? "#3e7d32" : "#3e7d32"} />
              </View>
              <Text style={[styles.menuItemText, isDarkMode && styles.darkText]}>
                Help Center
              </Text>
            </View>
            
            <View style={styles.menuItemRight}>
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#aaa" : "#999"} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, isDarkMode && styles.darkMenuItem]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, isDarkMode && styles.darkMenuIconContainer]}>
                <Ionicons name="chatbox-ellipses-outline" size={20} color={isDarkMode ? "#3e7d32" : "#3e7d32"} />
              </View>
              <Text style={[styles.menuItemText, isDarkMode && styles.darkText]}>
                Contact Us
              </Text>
            </View>
            
            <View style={styles.menuItemRight}>
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#aaa" : "#999"} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, isDarkMode && styles.darkMenuItem]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, isDarkMode && styles.darkMenuIconContainer]}>
                <Ionicons name="document-text-outline" size={20} color={isDarkMode ? "#3e7d32" : "#3e7d32"} />
              </View>
              <Text style={[styles.menuItemText, isDarkMode && styles.darkText]}>
                Privacy Policy
              </Text>
            </View>
            
            <View style={styles.menuItemRight}>
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#aaa" : "#999"} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton, isDarkMode && styles.darkLogoutButton]}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, isDarkMode && styles.darkMutedText]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100, // Space for header
    paddingBottom: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 20,
  },
  darkProfileHeader: {
    backgroundColor: '#2a2a2a',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#3e7d32',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#3e7d32',
    fontSize: 12,
    fontWeight: '500',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkSection: {
    backgroundColor: '#2a2a2a',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkMenuItem: {
    borderBottomColor: '#333',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  darkMenuIconContainer: {
    backgroundColor: 'rgba(62, 125, 50, 0.2)',
  },
  menuItemText: {
    fontSize: 15,
    color: '#333',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 14,
    color: '#888',
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#3e7d32',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d32f2f',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 14,
    borderRadius: 12,
  },
  darkLogoutButton: {
    backgroundColor: '#8b0000',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    marginBottom: 20,
  }
});