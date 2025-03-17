import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the context type
type WishlistContextType = {
  savedItems: any[];
  addToWishlist: (item: any) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
};

// Create the context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Provider component
export const WishlistProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState<any[]>([]);
  
  // Add item to wishlist
  const addToWishlist = (item) => {
    // Check if item is already in wishlist
    if (!savedItems.some(savedItem => savedItem.id === item.id)) {
      setSavedItems([...savedItems, {
        ...item, 
        id: item.id || `item-${Date.now()}`
      }]);
    }
  };
  
  // Remove item from wishlist
  const removeFromWishlist = (itemId) => {
    setSavedItems(savedItems.filter(item => item.id !== itemId));
  };
  
  // Check if item is in wishlist
  const isInWishlist = (itemId) => {
    return savedItems.some(item => item.id === itemId);
  };

  return (
    <WishlistContext.Provider value={{ 
      savedItems, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
