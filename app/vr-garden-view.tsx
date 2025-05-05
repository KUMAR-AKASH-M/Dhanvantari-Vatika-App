import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

export default function VRGardenView() {
  const { gardenName } = useLocalSearchParams();
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{gardenName || 'Garden'} VR View</Text>

      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          Please connect to the VR garden to experience the virtual environment.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
