import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

import BottomNavigation from '../../components/BottomNavigation';

export default function TabsLayout() {
  const [activeTab, setActiveTab] = useState('index');
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Handle tab press through our custom bottom navigation
  const handleTabPress = (item) => {
    setActiveTab(item.name.toLowerCase());
    let route: "/" | "/herbs" | "/learn" | "/profile" | "/chatbot" = '/';
    switch (item.name.toLowerCase()) {
      case 'home':
        route = '/';
        break;
      case 'herbs':
        route = '/herbs';
        break;
      case 'learn':
        route = '/learn';
        break;
      case 'chatbot':
        route = '/chatbot';
        break;
      case 'profile':
        route = '/profile';
        break;
    }
    router.replace(route);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="herbs" />
        <Tabs.Screen name="learn" />
        <Tabs.Screen name="chatbot" />
        <Tabs.Screen name="profile" />
      </Tabs>
      
      <BottomNavigation 
        items={[
          {name: "Home", icon: "home", active: activeTab === 'index'},
          {name: "Herbs", icon: "leaf-outline", active: activeTab === 'herbs'},
          {name: "Chatbot", icon: "chatbubble-ellipses-outline", active: activeTab === 'chatbot'},
          {name: "Learn", icon: "book-outline", active: activeTab === 'learn'},
          {name: "Profile", icon: "person-outline", active: activeTab === 'profile'}
        ]}
        onItemPress={handleTabPress}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
});