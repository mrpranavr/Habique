// screens/AddHabitScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Pressable, ScrollView, Modal } from 'react-native';
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
import { useHabits } from 'context/HabitsContext';
import EmojiSelector from 'react-native-emoji-selector';
import { useTheme } from 'context/ThemeContext';

const habitSchema = z.object({
  name: z.string().min(2, 'Habit name is too short'),
  category: z.string().min(2, 'Category is too short'),
  emoji: z.string().min(1, 'Emoji is required').emoji('Must be a valid emoji').optional(),
});

type HabitFormData = z.infer<typeof habitSchema>;

export default function AddHabitScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [goalType, setGoalType] = useState('Daily');
  const [startDate, setStartDate] = useState(new Date());
  const [reminder, setReminder] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [emoji, setEmoji] = useState('🏁');
  const [isEmojiModalVisible, setEmojiModalVisible] = useState(false);

  const { addHabit } = useHabits();

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
        daysChecked: {},
        streak: 0,
        lastCompleted: null,
        emoji,
      };

      await addHabit(newHabit);

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

  const iconColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

  return (
    <ScrollView className={clsx('flex-1 p-4', {
      'bg-white': theme === 'light',
      'dark': theme === 'dark'
    })}>
      <Text className={clsx('mb-2 text-xl font-bold', {
        'text-zinc-800': theme === 'light',
        'text-white': theme === 'dark'
      })}>Habit Name</Text>
      <View className={clsx('flex-row items-center p-3 mb-1 border rounded-xl', {
        'border-zinc-300': theme === 'light',
        'border-zinc-700': theme === 'dark'
      })}>
        <Feather name="edit-2" size={20} color={iconColor} className="mr-2" />
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="e.g. Drink Water"
              placeholderTextColor={iconColor}
              className={clsx('flex-1 text-base', {
                'text-zinc-900': theme === 'light',
                'text-white': theme === 'dark'
              })}
            />
          )}
        />
      </View>
      {errors.name && <Text className="mb-3 text-red-500">{errors.name.message}</Text>}

      {/* Category */}
      <Text className={clsx('mb-2 text-xl font-bold', {
        'text-zinc-800': theme === 'light',
        'text-white': theme === 'dark'
      })}>Category</Text>
      <View className={clsx('flex-row items-center p-3 mb-1 border rounded-xl', {
        'border-zinc-300': theme === 'light',
        'border-zinc-700': theme === 'dark'
      })}>
        <FontAwesome name="tag" size={20} color={iconColor} className="mr-2" />
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="e.g. Health, Productivity"
              placeholderTextColor={iconColor}
              className={clsx('flex-1 text-base', {
                'text-zinc-900': theme === 'light',
                'text-white': theme === 'dark'
              })}
            />
          )}
        />
      </View>
      {errors.category && <Text className="mb-3 text-red-500">{errors.category.message}</Text>}

      {/* Emoji */}
      <Text className={clsx('mb-2 text-xl font-bold', {
        'text-zinc-800': theme === 'light',
        'text-white': theme === 'dark'
      })}>Emoji</Text>
      <Pressable
        onPress={() => setEmojiModalVisible(true)}
        className={clsx('flex-row items-center p-3 mb-3 border rounded-xl', {
          'border-zinc-300': theme === 'light',
          'border-zinc-700': theme === 'dark'
        })}>
        <Text className="mr-2 text-2xl">{emoji}</Text>
        <Text className={clsx({
          'text-zinc-700': theme === 'light',
          'text-zinc-300': theme === 'dark'
        })}>Tap to pick emoji</Text>
      </Pressable>

      <Text className={clsx('mb-2 text-xl font-bold', {
        'text-zinc-800': theme === 'light',
        'text-white': theme === 'dark'
      })}>Goal Type</Text>
      <View className="flex-row gap-2 mb-4">
        {['Daily', 'Weekly'].map((type) => (
          <Pressable
            key={type}
            onPress={() => setGoalType(type)}
            className={clsx(
              'rounded-full border px-4 py-2',
              goalType === type
                ? 'border-blue-600 bg-blue-600'
                : {
                    'border-zinc-400': theme === 'light',
                    'border-zinc-600': theme === 'dark'
                  }
            )}>
            <Text
              className={clsx(
                'text-sm font-medium',
                goalType === type 
                  ? 'text-white' 
                  : {
                      'text-zinc-700': theme === 'light',
                      'text-zinc-300': theme === 'dark'
                    }
              )}>
              {type}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text className={clsx('mb-2 text-xl font-bold', {
        'text-zinc-800': theme === 'light',
        'text-white': theme === 'dark'
      })}>Start Date</Text>
      <Pressable
        onPress={() => setShowDatePicker(true)}
        className={clsx('p-3 mb-4 border rounded-xl', {
          'border-zinc-300': theme === 'light',
          'border-zinc-700': theme === 'dark'
        })}>
        <Text className={clsx({
          'text-zinc-700': theme === 'light',
          'text-zinc-300': theme === 'dark'
        })}>{startDate.toDateString()}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={theme === 'dark' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <View className="flex-row items-center justify-between mb-6">
        <Text className={clsx('text-xl font-bold', {
          'text-zinc-800': theme === 'light',
          'text-white': theme === 'dark'
        })}>Reminder</Text>
        <Switch
          value={reminder}
          onValueChange={setReminder}
          trackColor={{ false: '#4b5563', true: '#60a5fa' }}
          thumbColor={reminder ? '#2563eb' : theme === 'dark' ? '#9ca3af' : '#f4f3f4'}
        />
      </View>

      <Pressable
        onPress={handleSubmit(onSubmit)}
        className="items-center py-3 bg-blue-600 rounded-xl">
        <Text className="text-base font-semibold text-white">Add Habit</Text>
      </Pressable>

      <Modal
        visible={isEmojiModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEmojiModalVisible(false)}>
        <View className="items-center justify-center flex-1 bg-black/50">
          <View className={clsx('h-[60%] w-[90%] rounded-2xl p-4', {
            'bg-white': theme === 'light',
            'bg-zinc-800': theme === 'dark'
          })}>
            <Text className={clsx('mb-2 text-lg font-bold text-center', {
              'text-zinc-800': theme === 'light',
              'text-white': theme === 'dark'
            })}>
              Pick an Emoji
            </Text>
            <EmojiSelector
              onEmojiSelected={(selectedEmoji) => {
                setEmoji(selectedEmoji);
                setEmojiModalVisible(false);
              }}
              showSearchBar={true}
              showTabs={true}
              showHistory={true}
            /> 
            <Pressable
              onPress={() => setEmojiModalVisible(false)}
              className={clsx('p-2 mt-3 rounded-lg', {
                'bg-zinc-300': theme === 'light',
                'bg-zinc-700': theme === 'dark'
              })}>
              <Text className={clsx('text-center', {
                'text-zinc-800': theme === 'light',
                'text-white': theme === 'dark'
              })}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
