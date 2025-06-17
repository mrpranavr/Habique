import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  useColorScheme,
} from 'react-native';
import React, { useCallback } from 'react';
import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HabitTile from 'components/HabitTile';
import { PlusIcon } from 'react-native-heroicons/outline';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useHabits } from 'context/HabitsContext';
import { useTheme } from 'context/ThemeContext';
import clsx from 'clsx';

type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
  HabitDetail: { habitId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { habits, loading, reloadHabits } = useHabits();

  useFocusEffect(
    useCallback(() => {
      reloadHabits();
    }, [])
  );

  // Animations
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 5 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 5 });
    navigation.navigate('AddHabit');
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white dark:bg-zinc-950">
        <ActivityIndicator size="large" color={isDark ? 'white' : 'black'} />
      </View>
    );
  }

  console.log('Theme in HomeScreen', theme);

  return (
    <View className={clsx('relative flex-1 px-4 py-5', isDark && 'dark bg-dark-bg')}>
      {habits && habits.length === 0 ? (
        <View className="items-center justify-center flex-1 gap-5">
          <Image
            source={require('../assets/add-new.png')}
            style={{ width: 60, height: 60, resizeMode: 'contain', tintColor: theme === 'dark' ? '#fff' : '#000' }}
          />
          <Text className="text-base text-center text-gray-500 dark:text-gray-400">
            No habits yet. Add one to get started!
          </Text>
        </View>
      ) : (
        <ScrollView className="mb-4" bounces={false}>
          {habits.map((habit) => (
            <Pressable
              key={habit.id}
              onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
            >
              <HabitTile habit={habit} />
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Floating Add Button */}
      <Animated.View style={animatedStyle} className="absolute bottom-6 right-6">
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="p-4 bg-blue-600 rounded-full shadow-lg shadow-black/40"
        >
          <PlusIcon size={28} color="white" />
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default HomeScreen;
