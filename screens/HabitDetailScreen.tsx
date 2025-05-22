// screens/HabitDetailScreen.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { useHabits } from 'context/HabitsContext';
import dayjs from 'dayjs';

export default function HabitDetailScreen() {
  const route = useRoute();
  const { habitId } = route.params as { habitId: string };
  const { habits } = useHabits();

  const habit = habits.find((h) => h.id === habitId);

  if (!habit) return <Text>Habit not found.</Text>;

  const markedDates = Object.keys(habit.daysChecked || {}).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: '#2563eb' };
    return acc;
  }, {} as Record<string, any>);

  return (
    <ScrollView className="flex-1 p-4 bg-white dark:bg-zinc-900">
      <Text className="text-3xl font-bold">{habit.emoji} {habit.name}</Text>
      <Text className="mt-1 text-gray-500">Streak: {habit.streak}</Text>
      <Text className="mb-4 text-gray-500">Started on: {dayjs(habit.createdAt).format('MMM D, YYYY')}</Text>

      <Text className="mb-2 text-lg font-semibold">Completion Calendar</Text>
      <Calendar
        markedDates={markedDates}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#2e3a59',
          selectedDayBackgroundColor: '#2563eb',
          todayTextColor: '#2563eb',
          arrowColor: '#2563eb',
          dotColor: '#2563eb',
        }}
      />
    </ScrollView>
  );
}
