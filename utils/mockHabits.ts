// utils/mockHabits.ts
import { Habit } from '../types/types';

export const mockHabits: Habit[] = [
  {
    id: '1',
    name: 'Drink Water',
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
    schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    completedDates: ['2025-05-10', '2025-05-11', '2025-05-12'],
    streak: 3,
    lastCompleted: '2025-05-12',
    emoji: '💧',
  },
  {
    id: '2',
    name: 'Exercise',
    createdAt: Date.now() - 86400000 * 10,
    schedule: ['Monday', 'Wednesday', 'Friday'],
    completedDates: ['2025-05-11', '2025-05-13'],
    streak: 1,
    lastCompleted: '2025-05-13',
    emoji: '🏋️',
  },
  {
    id: '3',
    name: 'Read Book',
    createdAt: Date.now() - 86400000 * 3,
    schedule: ['Sunday', 'Tuesday', 'Thursday'],
    completedDates: ['2025-05-12'],
    streak: 1,
    lastCompleted: '2025-05-12',
    emoji: '📚',
  }
];
