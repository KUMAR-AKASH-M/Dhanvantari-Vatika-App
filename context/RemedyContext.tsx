import React, { createContext, useState, useContext, useEffect } from 'react';
import { RecipeType } from '../components/learn/RecipeCard';

// Define the context type
type RemedyContextType = {
  savedRemedies: RecipeType[];
  addToSavedRemedies: (remedy: RecipeType) => void;
  removeFromSavedRemedies: (remedyId: string) => void;
  isInSavedRemedies: (remedyId: string) => boolean;
};

// Create the context
const RemedyContext = createContext<RemedyContextType | undefined>(undefined);

// Provider component
export const RemedyProvider = ({ children }) => {
  const [savedRemedies, setSavedRemedies] = useState<RecipeType[]>([]);
  
  // Add remedy to saved remedies
  const addToSavedRemedies = (remedy) => {
    // Check if remedy is already saved
    if (!savedRemedies.some(savedRemedy => savedRemedy.id === remedy.id)) {
      setSavedRemedies([...savedRemedies, {
        ...remedy,
        id: remedy.id || `remedy-${Date.now()}`,
        saved: new Date().toLocaleDateString()
      }]);
    }
  };
  
  // Remove remedy from saved remedies
  const removeFromSavedRemedies = (remedyId) => {
    setSavedRemedies(savedRemedies.filter(remedy => remedy.id !== remedyId));
  };
  
  // Check if remedy is in saved remedies
  const isInSavedRemedies = (remedyId) => {
    return savedRemedies.some(remedy => remedy.id === remedyId);
  };

  return (
    <RemedyContext.Provider value={{ 
      savedRemedies, 
      addToSavedRemedies, 
      removeFromSavedRemedies, 
      isInSavedRemedies 
    }}>
      {children}
    </RemedyContext.Provider>
  );
};

// Custom hook to use the remedy context
export const useSavedRemedies = () => {
  const context = useContext(RemedyContext);
  if (context === undefined) {
    throw new Error('useSavedRemedies must be used within a RemedyProvider');
  }
  return context;
};
