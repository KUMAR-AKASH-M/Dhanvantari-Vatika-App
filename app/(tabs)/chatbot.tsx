import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
// Replace the @env import with direct import from config
import { OPENAI_API_KEY } from '../../config';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am Dhanvantari, your Ayurvedic wellness assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const callOpenAI = async (userMessage: string, previousMessages: Message[]) => {
    try {
      // Format messages in the way OpenAI expects them
      const formattedMessages = previousMessages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }));
      
      // Add system message for context
      formattedMessages.unshift({
        role: "system",
        content: "You are Dhanvantari, an expert Ayurvedic wellness assistant. Provide helpful advice about Ayurvedic medicines, herbs, treatments, and wellness practices. Your responses should be informative, rooted in Ayurvedic principles, and promote holistic health. Don't share your any personal details. And talk in a very friendly tone in plane text please don't use markdown and give reponse under 500char."
      });
      
      // Add the latest user message
      formattedMessages.push({
        role: "user",
        content: userMessage
      });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: formattedMessages,
          temperature: 1.2,
          max_tokens: 500
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      } else {
        throw new Error('Invalid response from OpenAI');
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
    }
  };

  const handleSend = async () => {
    if (message.trim().length === 0) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await callOpenAI(message, messages);
      
      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      // Handle error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    return (
      <View
        style={[
          styles.messageBubble,
          item.isUser
            ? [styles.userMessage, isDarkMode && styles.userMessageDark]
            : [styles.botMessage, isDarkMode && styles.botMessageDark],
        ]}
      >
        <Text style={[
          styles.messageText,
          item.isUser 
            ? styles.userMessageText 
            : [styles.botMessageText, isDarkMode && styles.botMessageTextDark]
        ]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <Header isDarkMode={isDarkMode} onThemeChange={handleThemeChange} />
      
      <View style={styles.contentContainer}>
        <View style={[styles.chatHeader, isDarkMode && styles.chatHeaderDark]}>
          <Ionicons name="medkit" size={24} color={isDarkMode ? "#8cc63f" : "#4a7c59"} />
          <Text style={[styles.chatTitle, isDarkMode && styles.chatTitleDark]}>
            Dhanvantari Assistant
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isLoading && (
          <View style={[styles.loadingContainer, isDarkMode && styles.loadingContainerDark]}>
            <ActivityIndicator size="small" color={isDarkMode ? "#8cc63f" : "#4a7c59"} />
            <Text style={[styles.loadingText, isDarkMode && styles.loadingTextDark]}>
              Dhanvantari is thinking...
            </Text>
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
          style={styles.inputContainer}
        >
          <View style={[styles.inputWrapper, isDarkMode && styles.inputWrapperDark]}>
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your question..."
              placeholderTextColor={isDarkMode ? '#aaaaaa' : '#888888'}
              multiline
              editable={!isLoading}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                (!message.trim() || isLoading) && styles.disabledButton
              ]} 
              onPress={handleSend}
              disabled={!message.trim() || isLoading}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  contentContainer: {
    flex: 1,
    marginTop: 100, // Space for header
    paddingBottom: 70, // Space for bottom navigation
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  chatHeaderDark: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333333',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333333',
  },
  chatTitleDark: {
    color: '#f0f0f0',
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4a7c59',
    borderBottomRightRadius: 4,
  },
  userMessageDark: {
    backgroundColor: '#2a5a3a',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  botMessageDark: {
    backgroundColor: '#2a2a2a',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#333333',
  },
  botMessageTextDark: {
    color: '#f0f0f0',
  },
  timestamp: {
    fontSize: 10,
    color: '#8a8a8a',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  inputWrapperDark: {
    backgroundColor: '#2a2a2a',
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    maxHeight: 100,
    minHeight: 36,
    color: '#333333',
  },
  inputDark: {
    color: '#f0f0f0',
  },
  sendButton: {
    backgroundColor: '#4a7c59',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  loadingContainerDark: {
    backgroundColor: '#1e1e1e',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333333',
  },
  loadingTextDark: {
    color: '#f0f0f0',
  },
});
