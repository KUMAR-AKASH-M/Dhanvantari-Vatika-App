import React, { createContext, useContext } from 'react';

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

export const ThemeProvider = ThemeContext.Provider;
