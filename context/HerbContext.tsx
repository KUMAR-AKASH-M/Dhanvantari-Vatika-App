/**
 * Context for managing saved herbs (medicinal plants)
 * Used throughout the application for consistent herb management
 */
import React, { createContext, useState, useContext } from 'react';

// Define the herb type based on the app's existing structure
type HerbType = {
  id: string;
  name: string;
  scientificName: string;
  image: any; // Image source
  benefits: string[];
  description: string;
  classification?: string;
  categories?: string[];
  savedDate?: string;
  // Other possible fields
  howToUse?: string[];
  growingTips?: string[];
  origin?: string;
  rating?: number;
  reviews?: number;
};

// Define the context type
type HerbContextType = {
  savedHerbs: HerbType[];
  addToSavedHerbs: (herb: HerbType) => void;
  removeFromSavedHerbs: (herbId: string) => void;
  isInSavedHerbs: (herbId: string) => boolean;
};

// Create the context
const HerbContext = createContext<HerbContextType | undefined>(undefined);

// Provider component
export const HerbProvider = ({ children }) => {
  const [savedHerbs, setSavedHerbs] = useState<HerbType[]>([]);
  
  // Add herb to saved herbs
  const addToSavedHerbs = (herb) => {
    // Check if herb is already saved
    if (!savedHerbs.some(savedHerb => savedHerb.id === herb.id)) {
      setSavedHerbs([...savedHerbs, {
        ...herb,
        id: herb.id || `herb-${Date.now()}`,
        savedDate: new Date().toLocaleDateString()
      }]);
    }
  };
  
  // Remove herb from saved herbs
  const removeFromSavedHerbs = (herbId) => {
    setSavedHerbs(savedHerbs.filter(herb => herb.id !== herbId));
  };
  
  // Check if herb is in saved herbs
  const isInSavedHerbs = (herbId) => {
    return savedHerbs.some(herb => herb.id === herbId);
  };

  return (
    <HerbContext.Provider value={{ 
      savedHerbs, 
      addToSavedHerbs, 
      removeFromSavedHerbs, 
      isInSavedHerbs 
    }}>
      {children}
    </HerbContext.Provider>
  );
};

// Custom hook to use the herb context
export const useSavedHerbs = () => {
  const context = useContext(HerbContext);
  if (context === undefined) {
    throw new Error('useSavedHerbs must be used within a HerbProvider');
  }
  return context;
};
