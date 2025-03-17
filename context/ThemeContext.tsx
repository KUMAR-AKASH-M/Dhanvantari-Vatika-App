import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const defaultState: ThemeContextType = {
  isDarkMode: false,
  toggleTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultState);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference on app start
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('isDarkMode');
        setIsDarkMode(savedTheme === 'true');
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      }
    };
    
    loadThemePreference();
  }, []);

  const toggleTheme = async () => {
    const newThemeValue = !isDarkMode;
    setIsDarkMode(newThemeValue);
    
    // Save theme preference
    try {
      await AsyncStorage.setItem('isDarkMode', newThemeValue.toString());
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
