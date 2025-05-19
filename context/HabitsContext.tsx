import { View, Text } from 'react-native'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Habit } from 'types/types'
import { getHabits, saveHabits as persistHabits } from 'utils/storage'

type HabitsContextType = {
  habits: Habit[]
  addHabit: (habit: Habit) => Promise<void>
  reloadHabits: () => Promise<void>
  loading: boolean
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

  return (
    <HabitsContext.Provider value={{habits, addHabit, reloadHabits, loading}}>
      {children}
    </HabitsContext.Provider>
  )
}

export const useHabits = () => {
  const context = useContext(HabitsContext)
  if(!context) throw new Error('useHabits must be used within a HabitsProvider')
  return context
}
