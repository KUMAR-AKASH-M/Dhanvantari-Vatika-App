import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Image,
  Modal,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArticleType } from '../../components/learn/ArticleCard';

const { height } = Dimensions.get('window');

// Props for the SavedArticlesModal
interface SavedArticlesModalProps {
  visible: boolean;
  toggleModal: (visible: boolean) => void;
  slideAnimation: Animated.Value;
  isDarkMode: boolean;
  savedArticles: ArticleType[];
  onRemoveArticle: (articleId: string) => void;
  onViewArticle?: (article: ArticleType) => void;
}

const SavedArticlesModal = ({ 
  visible, 
  toggleModal, 
  slideAnimation, 
  isDarkMode,
  savedArticles = [],
  onRemoveArticle,
  onViewArticle
}: SavedArticlesModalProps) => {

  const renderArticleItem = ({ item }: { item: ArticleType }) => (
    <View style={[styles.articleItem, isDarkMode && styles.darkArticleItem]}>
      <Image 
        source={item.image} 
        style={styles.articleImage} 
      />
      <View style={styles.articleDetails}>
        <Text style={[styles.articleTitle, isDarkMode && styles.darkText]}>
          {item.title}
        </Text>
        <View style={styles.articleMeta}>
          <Text style={[styles.articleMetaText, isDarkMode && styles.darkMutedText]}>
            {item.readTime}
          </Text>
          <Text style={[styles.articleMetaText, isDarkMode && styles.darkMutedText]}>
            • Saved {item.savedDate || item.publishedDate}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.readButton}
          onPress={() => onViewArticle && onViewArticle(item)}
        >
          <Text style={styles.readButtonText}>Read</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => onRemoveArticle(item.id)}
      >
        <Ionicons name="close-circle" size={20} color="#e91e63" />
      </TouchableOpacity>
    </View>
  );

  const noArticlesView = (
    <View style={styles.noItemsContainer}>
      <Ionicons 
        name="book-outline" 
        size={60} 
        color={isDarkMode ? "#555" : "#ccc"} 
      />
      <Text style={[styles.noItemsText, isDarkMode && styles.darkText]}>
        No saved articles
      </Text>
      <Text style={[styles.noItemsSubText, isDarkMode && styles.darkMutedText]}>
        Articles you bookmark will appear here
      </Text>
    </View>
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => toggleModal(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => toggleModal(false)}
        />
        <Animated.View 
          style={[
            styles.modalContainer, 
            isDarkMode && styles.darkModalContainer,
            { transform: [{ translateY: slideAnimation }] }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
              Saved Articles ({savedArticles.length})
            </Text>
            <TouchableOpacity onPress={() => toggleModal(false)}>
              <Ionicons name="close" size={24} color={isDarkMode ? "#fff" : "#333"} />
            </TouchableOpacity>
          </View>

          <View style={styles.articlesList}>
            {savedArticles.length === 0 ? (
              noArticlesView
            ) : (
              <FlatList
                data={savedArticles}
                renderItem={renderArticleItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.articlesListContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          {savedArticles.length > 0 && (
            <TouchableOpacity 
              style={[styles.viewAllButton, isDarkMode && styles.darkViewAllButton]}
              onPress={() => toggleModal(false)}
            >
              <Text style={styles.viewAllText}>Browse More Articles</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    maxHeight: '90%',
    minHeight: '80%',
  },
  darkModalContainer: {
    backgroundColor: '#2a2a2a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
  articlesList: {
    flex: 1,
    minHeight: 300,
  },
  articlesListContent: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  darkArticleItem: {
    backgroundColor: '#333',
    borderBottomColor: '#444',
  },
  articleImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  articleDetails: {
    flex: 1,
    paddingRight: 10,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  articleMeta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  articleMetaText: {
    fontSize: 12,
    color: '#888',
  },
  readButton: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  readButtonText: {
    color: '#3e7d32',
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
  },
  viewAllButton: {
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  darkViewAllButton: {
    backgroundColor: 'rgba(62, 125, 50, 0.2)',
  },
  viewAllText: {
    color: '#3e7d32',
    fontSize: 15,
    fontWeight: '500',
  },
  noItemsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noItemsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
  },
  noItemsSubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  }
});

export default SavedArticlesModal;
