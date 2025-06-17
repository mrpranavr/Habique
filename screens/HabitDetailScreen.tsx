// screens/HabitDetailScreen.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { useHabits } from 'context/HabitsContext';
import { useTheme } from 'context/ThemeContext';
import dayjs from 'dayjs';
import { clsx } from 'clsx';

export default function HabitDetailScreen() {
  const route = useRoute();
  const { habitId } = route.params as { habitId: string };
  const { habits } = useHabits();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const habit = habits.find((h) => h.id === habitId);

  if (!habit) return <Text className={clsx(isDark && 'text-white')}>Habit not found.</Text>;

  const markedDates = Object.keys(habit.daysChecked || {}).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: '#2563eb' };
    return acc;
  }, {} as Record<string, any>);

  return (
    <ScrollView className={clsx('flex-1 p-4', isDark ? 'dark' : 'bg-white')}>
      <Text className={clsx('text-3xl font-bold', isDark && 'text-white')}>
        {habit.emoji} {habit.name}
      </Text>
      <Text className={clsx('mt-1 text-gray-500', isDark && 'text-gray-400')}>
        Streak: {habit.streak}
      </Text>
      <Text className={clsx('mb-4 text-gray-500', isDark && 'text-gray-400')}>
        Started on: {dayjs(habit.createdAt).format('MMM D, YYYY')}
      </Text>

      <Text className={clsx('mb-2 text-lg font-semibold', isDark && 'text-white')}>
        Completion Calendar
      </Text>
      <Calendar
        markedDates={markedDates}
        theme={{
          backgroundColor: isDark ? '#121212' : '#ffffff',
          calendarBackground: isDark ? '#121212' : '#ffffff',
          textSectionTitleColor: isDark ? '#e4e4e7' : '#2e3a59',
          selectedDayBackgroundColor: '#2563eb',
          todayTextColor: '#2563eb',
          arrowColor: '#2563eb',
          dotColor: '#2563eb',
          textDisabledColor: isDark ? '#71717a' : '#d1d5db',
          textDayStyle: { color: isDark ? '#e4e4e7' : '#000000' },
          monthTextColor: isDark ? '#fff' : '#121212'
          // dayTextColor: '#fff'
          // textMonthStyle: { color: isDark ? '#e4e4e7' : '#000000' },
          // textDayHeaderStyle: { color: isDark ? '#e4e4e7' : '#000000' },
        }}
      />
    </ScrollView>
  );
}
