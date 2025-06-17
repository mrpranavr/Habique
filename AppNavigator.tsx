// AppNavigator.tsx or AppNavigator.js
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddHabitScreen from './screens/AddHabitsScreen';
import { Pressable } from 'react-native';
import { SunIcon, MoonIcon } from 'react-native-heroicons/outline';
import HabitDetailScreen from 'screens/HabitDetailScreen';
import { useTheme } from 'context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { theme, toggleTheme } = useTheme();
  return (
    <NavigationContainer theme={theme === 'light' ? DefaultTheme : DarkTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerTitle: 'Habitica',
            headerRight: () => (
              <Pressable onPress={toggleTheme} className="">
                {theme === 'light' ? <SunIcon size={24} color="#000" /> : <MoonIcon size={24} color="#fff" />}
              </Pressable>
            ),
          })}
        />
        <Stack.Screen
          name="AddHabit"
          component={AddHabitScreen}
          options={{ presentation: 'modal', headerTitle: 'Add Habit' }}
        />
        <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
