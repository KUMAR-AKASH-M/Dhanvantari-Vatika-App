import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

type ArticleType = {
  id: string;
  title: string;
  author: string; // Keeping in the type but won't display
  image: { uri: string };
  readTime: string;
  publishedDate: string;
};

interface ArticleCardProps {
  article: ArticleType;
  isDarkMode: boolean;
  isModal?: boolean;
  onPress?: () => void;
}

const ArticleCard = ({ article, isDarkMode, isModal = false, onPress }: ArticleCardProps) => {
  return (
    <TouchableOpacity 
      style={[
        styles.articleCard, 
        isDarkMode && styles.darkCard,
        isModal && styles.modalArticleCard
      ]}
      onPress={onPress}
    >
      <Image source={article.image} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text 
          style={[styles.articleTitle, isDarkMode && styles.darkText]} 
          numberOfLines={isModal ? undefined : 2}
        >
          {article.title}
        </Text>
        
        {/* Author name removed */}
        
        <View style={styles.articleMeta}>
          <Text style={[styles.articleMetaText, isDarkMode && styles.darkMutedText]}>
            {article.readTime}
          </Text>
          <Text style={[styles.articleMetaText, isDarkMode && styles.darkMutedText]}>
            • {article.publishedDate}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  darkCard: {
    backgroundColor: '#2a2a2a',
  },
  articleImage: {
    width: 100,
    height: '100%',
    resizeMode: 'cover',
  },
  articleContent: {
    flex: 1,
    padding: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8, // Increased to account for removed author line
  },
  articleAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleMetaText: {
    fontSize: 12,
    color: '#888',
    marginRight: 4,
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
  modalArticleCard: {
    marginHorizontal: 0,
    marginBottom: 15,
  }
});

export default ArticleCard;
export type { ArticleType };
