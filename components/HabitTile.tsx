// components/HabitTile.tsx
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { DayOfWeek, Habit } from '../types/types'
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { clsx } from 'clsx';

interface HabitTileProps {
  habit: Habit;
}

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const HabitTile: React.FC<HabitTileProps> = ({ habit }) => {
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

  const [isCompleted, setIsCompleted] = useState(habit.completedDates.includes(today));

  const toggleComplete = () => {
    setIsCompleted((prev) => !prev);
    // TODO: update state/DB in parent or context
  };

  const todayIndex = new Date().getDay(); // 0 (Sun) to 6 (Sat)

  return (
    <View className="p-4 mb-4 bg-white shadow-sm dark:bg-zinc-900 rounded-2xl">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold dark:text-white">
          {habit.emoji} {habit.name}
        </Text>

        <Pressable
          onPress={toggleComplete}
          className={clsx(
            'w-9 h-9 rounded-full items-center justify-center border-2',
            isCompleted ? 'bg-green-500 border-green-600' : 'border-zinc-400'
          )}
        >
          {isCompleted && (
            <Animated.Text
              entering={ZoomIn}
              exiting={ZoomOut}
              className="text-lg font-bold text-white"
            >
              ✔
            </Animated.Text>
          )}
        </Pressable>
      </View>

      <View className="flex-row justify-between px-1 mt-4">
        {daysOfWeek.map((day, i) => {
          const dayFull =
            ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i];

          const isScheduled = habit.schedule.includes(dayFull as DayOfWeek);
          const isToday = i === todayIndex;

          return (
            <View
              key={i}
              className={clsx(
                'w-8 h-8 rounded-full items-center justify-center',
                isToday ? 'border-2 border-blue-400' : '',
                isScheduled ? 'bg-blue-200 dark:bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'
              )}
            >
              <Text className="text-xs font-bold text-zinc-900 dark:text-white">{day}</Text>
            </View>
          );
        })}
      </View>

      <Text className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        Streak: {habit.streak} 🔥
      </Text>
    </View>
  );
};

export default HabitTile;
