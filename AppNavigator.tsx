// AppNavigator.tsx or AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddHabitScreen from './screens/AddHabitsScreen';
import { Pressable, Text } from 'react-native';
import { PlusIcon } from 'react-native-heroicons/outline';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerTitle: 'Habitica',
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate('AddHabit')} className="p-1 mr-3">
                <PlusIcon size={24} color="#000" />
              </Pressable>
            ),
          })}
        />
        <Stack.Screen
          name="AddHabit"
          component={AddHabitScreen}
          options={{ presentation: 'modal', headerTitle: 'Add Habit' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
