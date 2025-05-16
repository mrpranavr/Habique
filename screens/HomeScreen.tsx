import { View, Text, Button, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockHabits } from 'utils/mockHabits';
import HabitTile from 'components/HabitTile';
import { PlusIcon } from 'react-native-heroicons/outline';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Habit } from 'types/types';
import { getHabits } from 'utils/storage';

type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // STATES --------------
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHabits = async () => {
    const storedHabits = await getHabits();
    setHabits(storedHabits);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  // ANIMATIONS ----------------
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // HANDLER FUNCTIONS --------------
  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 5 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 5 });
    navigation.navigate('AddHabit');
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="relative flex-1 px-4 py-5 bg-white dark:bg-zinc-950">
      {habits.length === 0 ? (
        <View className="items-center justify-center flex-1 gap-5">
          <Image
            source={require('../assets/add-new.png')} // Add your image to assets
            style={{ width: 50, height: 50, resizeMode: 'contain' }}
          />
          <Text className="text-base text-center text-gray-500">No habits yet. Add one to get started!</Text>
        </View>
      ) : (
        <ScrollView className="mb-4" bounces={false}>
          {habits.map((habit) => (
            <HabitTile key={habit.id} habit={habit} />
          ))}
        </ScrollView>
      )}

      {/* Floating Action Button */}
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
