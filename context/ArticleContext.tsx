import React, { createContext, useState, useContext } from 'react';
import { ArticleType } from '../components/learn/ArticleCard';

// Define the context type
type ArticleContextType = {
  savedArticles: ArticleType[];
  addToSavedArticles: (article: ArticleType) => void;
  removeFromSavedArticles: (articleId: string) => void;
  isInSavedArticles: (articleId: string) => boolean;
};

// Create the context
const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

// Provider component
export const ArticleProvider = ({ children }) => {
  const [savedArticles, setSavedArticles] = useState<ArticleType[]>([]);
  
  // Add article to saved articles
  const addToSavedArticles = (article) => {
    // Check if article is already saved
    if (!savedArticles.some(savedArticle => savedArticle.id === article.id)) {
      setSavedArticles([...savedArticles, {
        ...article,
        id: article.id || `article-${Date.now()}`,
        savedDate: new Date().toLocaleDateString()
      }]);
    }
  };
  
  // Remove article from saved articles
  const removeFromSavedArticles = (articleId) => {
    setSavedArticles(savedArticles.filter(article => article.id !== articleId));
  };
  
  // Check if article is in saved articles
  const isInSavedArticles = (articleId) => {
    return savedArticles.some(article => article.id === articleId);
  };

  return (
    <ArticleContext.Provider value={{ 
      savedArticles, 
      addToSavedArticles, 
      removeFromSavedArticles, 
      isInSavedArticles 
    }}>
      {children}
    </ArticleContext.Provider>
  );
};

// Custom hook to use the article context
export const useSavedArticles = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useSavedArticles must be used within an ArticleProvider');
  }
  return context;
};
