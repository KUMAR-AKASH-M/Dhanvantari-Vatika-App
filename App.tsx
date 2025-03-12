import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './context/ThemeContext';
import { ExpoRoot } from 'expo-router';

export default function App() {
  // Get system color scheme
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  
  // Update dark mode if system preference changes
  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeProvider value={{ isDarkMode, toggleTheme }}>
      <SafeAreaProvider>
        <StatusBar 
          barStyle={isDarkMode ? "light-content" : "dark-content"} 
          backgroundColor={isDarkMode ? "#121212" : "#FFFFFF"}
        />
        <ExpoRoot context={require.context('./app')} />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
