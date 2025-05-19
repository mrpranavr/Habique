import dayjs from 'dayjs';
import { Habit } from 'types/types';
import { getHabits, saveAllHabits } from 'utils/storage';

export const formatDate = (date: Date) => dayjs(date).format('YYYY-MM-DD');

export const wasYesterdayCompleted = (daysChecked: Record<string, true>) => {
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  return !!daysChecked[yesterday];
};


