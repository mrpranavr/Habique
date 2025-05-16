// screens/AddHabitScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import clsx from 'clsx';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesome, Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import { saveHabits } from 'utils/storage';
import { DayOfWeek } from 'types/types';

const habitSchema = z.object({
  name: z.string().min(2, 'Habit name is too short'),
  category: z.string().min(2, 'Category is too short'),
});

type HabitFormData = z.infer<typeof habitSchema>;

export default function AddHabitScreen() {
  const navigation = useNavigation();

  const [goalType, setGoalType] = useState('Daily');
  const [startDate, setStartDate] = useState(new Date());
  const [reminder, setReminder] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<HabitFormData>({ resolver: zodResolver(habitSchema) });

  const onSubmit = async (data: HabitFormData) => {
    try {
      console.log({ ...data, goalType, startDate, reminder });

      const newHabit = {
        id: uuid.v4() as string,

        name: data.name,
        createdAt: Date.now(),
        schedule: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ] as DayOfWeek[],
        completedDates: [],
        streak: 0,
        lastCompleted: null,
        emoji: '🏁',
      };

      await saveHabits(newHabit); // this might be failing

      Toast.show({
        type: 'success',
        text1: 'Habit added!',
        text2: `${data.name} has been successfully saved.`,
        position: 'bottom',
        visibilityTime: 4000,
        bottomOffset: 80,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Failed to save habit:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong while saving your habit.',
      });
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white dark:bg-zinc-900">
      <Text className="mb-2 text-xl font-bold text-zinc-800 dark:text-white">Habit Name</Text>
      <View className="flex-row items-center p-3 mb-1 border rounded-xl border-zinc-300 dark:border-zinc-700">
        <Feather name="edit-2" size={20} color="#6b7280" className="mr-2" />
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="e.g. Drink Water"
              className="flex-1 text-base text-zinc-900 dark:text-white"
            />
          )}
        />
      </View>
      {errors.name && <Text className="mb-3 text-red-500">{errors.name.message}</Text>}

      {/* Category */}
      <Text className="mb-2 text-xl font-bold text-zinc-800 dark:text-white">Category</Text>
      <View className="flex-row items-center p-3 mb-1 border rounded-xl border-zinc-300 dark:border-zinc-700">
        <FontAwesome name="tag" size={20} color="#6b7280" className="mr-2" />
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="e.g. Health, Productivity"
              className="flex-1 text-base text-zinc-900 dark:text-white"
            />
          )}
        />
      </View>
      {errors.category && <Text className="mb-3 text-red-500">{errors.category.message}</Text>}

      <Text className="mb-2 text-xl font-bold text-zinc-800 dark:text-white">Goal Type</Text>
      <View className="flex-row gap-2 mb-4">
        {['Daily', 'Weekly'].map((type) => (
          <Pressable
            key={type}
            onPress={() => setGoalType(type)}
            className={clsx(
              'rounded-full border px-4 py-2',
              goalType === type
                ? 'border-blue-600 bg-blue-600'
                : 'border-zinc-400 dark:border-zinc-600'
            )}>
            <Text
              className={clsx(
                'text-sm font-medium',
                goalType === type ? 'text-white' : 'text-zinc-700 dark:text-white'
              )}>
              {type}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text className="mb-2 text-xl font-bold text-zinc-800 dark:text-white">Start Date</Text>
      <Pressable
        onPress={() => setShowDatePicker(true)}
        className="p-3 mb-4 border rounded-xl border-zinc-300 dark:border-zinc-700">
        <Text className="text-zinc-700 dark:text-white">{startDate.toDateString()}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-xl font-bold text-zinc-800 dark:text-white">Reminder</Text>
        <Switch
          value={reminder}
          onValueChange={setReminder}
          trackColor={{ false: '#ccc', true: '#60a5fa' }}
          thumbColor={reminder ? '#2563eb' : '#f4f3f4'}
        />
      </View>

      <Pressable
        onPress={handleSubmit(onSubmit)}
        className="items-center py-3 bg-blue-600 rounded-xl">
        <Text className="text-base font-semibold text-white">Add Habit</Text>
      </Pressable>
    </ScrollView>
  );
}
