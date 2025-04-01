import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import VRGardenView from '../screens/VRGardenView';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Existing screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        
        {/* Add the VR Garden View screen */}
        <Stack.Screen 
          name="VRGardenView" 
          component={VRGardenView} 
          options={{ 
            headerShown: false,
            cardStyle: { backgroundColor: 'black' } 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;