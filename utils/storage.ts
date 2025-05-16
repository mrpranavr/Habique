import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "types/types";

const HABIT_KEY = 'habits';

export const getHabits = async (): Promise<Habit[]> => {
  const json = await AsyncStorage.getItem(HABIT_KEY)
  return json ? JSON.parse(json) : []
}

export const saveHabits = async (newHabit: Habit): Promise<void> => {
  const habits = await getHabits();
  const updated = [...habits, newHabit];
  await AsyncStorage.setItem(HABIT_KEY, JSON.stringify(updated));
}