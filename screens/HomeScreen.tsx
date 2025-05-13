import { View, Text, Button, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockHabits } from 'utils/mockHabits';
import HabitTile from 'components/HabitTile';
import { PlusIcon } from 'react-native-heroicons/outline';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 5 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 5 });
    navigation.navigate('AddHabit');
  };

  return (
    <View className="relative flex-1 px-4 py-5 bg-white dark:bg-zinc-950">
      {/* <Text className='text-lg font-semibold'>Your Habits</Text> */}
      <ScrollView className="mb-4" bounces={false}>
        {mockHabits.map((habit, index) => (
          <HabitTile key={habit.id} habit={habit} />
        ))}
      </ScrollView>
      {/* <Button title='Add Habit' onPress={() => navigation.navigate('AddHabit')} /> */}
      {/* FAB */}
      <Animated.View style={[animatedStyle]} className="absolute bottom-6 right-6">
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="p-4 bg-blue-600 rounded-full shadow-lg shadow-black/40">
          <PlusIcon size={28} color="white" />
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default HomeScreen;
