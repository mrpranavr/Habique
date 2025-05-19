import { View, Text } from 'react-native'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Habit } from 'types/types'
import { getHabits, saveHabits as persistHabits, saveAllHabits } from 'utils/storage'
import { formatDate, wasYesterdayCompleted } from 'utils/streak'

type HabitsContextType = {
  habits: Habit[]
  addHabit: (habit: Habit) => Promise<void>
  reloadHabits: () => Promise<void>
  loading: boolean
  checkOffHabit: (habitId: string) => Promise<void>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const HabitsProvider = ({children} : {children: React.ReactNode}) => {

  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  const loadHabits = async () => {
    const data = await getHabits();
    setHabits(data)
  }

  const addHabit = async (habit: Habit) => {
    const updated = [...habits, habit]
    setHabits(updated)
    await persistHabits(habit)
  }

  const reloadHabits = async () => {
    setLoading(true);
    const stored = await getHabits();
    setHabits(stored);
    setLoading(false);
  };

  useEffect(() => {
    loadHabits()
  }, [])

  const checkOffHabit = async (habitId: string) => {
    const today = formatDate(new Date());
  
    const updatedHabits = habits.map((habit) => {
      if (habit.id !== habitId) return habit;
  
      const wasCheckedToday = habit.daysChecked?.[today];
  
      let newDaysChecked = { ...habit.daysChecked };
      let newStreak = habit.streak;
      let newLastCompleted = habit.lastCompleted;
  
      if (wasCheckedToday) {
        // 🔄 Uncheck today
        delete newDaysChecked[today];
        // Recalculate streak based on the last day checked (optional simplification: reset to 0)
        newStreak = 0;
        newLastCompleted = null;
      } else {
        // ✅ Check today
        newDaysChecked[today] = true;
        newStreak = wasYesterdayCompleted(newDaysChecked) ? habit.streak + 1 : 1;
        newLastCompleted = today;
      }
  
      return {
        ...habit,
        daysChecked: newDaysChecked,
        streak: newStreak,
        lastCompleted: newLastCompleted,
      };
    });
  
    setHabits(updatedHabits);
    await saveAllHabits(updatedHabits);
  };
  
  
  return (
    <HabitsContext.Provider value={{habits, addHabit, reloadHabits, loading, checkOffHabit}}>
      {children}
    </HabitsContext.Provider>
  )
}

export const useHabits = () => {
  const context = useContext(HabitsContext)
  if(!context) throw new Error('useHabits must be used within a HabitsProvider')
  return context
}
