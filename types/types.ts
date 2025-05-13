export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';


export interface Habit {
  id: string; // UUID or unique string
  name: string; // e.g. "Drink Water"
  createdAt: number; // timestamp (ms)
  schedule: DayOfWeek[]; // which days the habit recurs
  completedDates: string[]; // ['2025-05-13', '2025-05-14'] (ISO date strings)
  streak: number; // current streak
  lastCompleted: string | null; // last completed date (ISO)
  emoji?: string; // optional emoji or icon
}

export interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  markHabitDone: (habitId: string, date: string) => void;
  deleteHabit: (habitId: string) => void;
  updateHabit: (habit: Habit) => void;
}
