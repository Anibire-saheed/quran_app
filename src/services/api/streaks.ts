import { quranAuthApi } from './axios';

/**
 * GET USER STREAKS
 * Path: /v1/streaks
 */
export const fetchStreaks = async (params?: {
  from?: string;
  to?: string;
  type?: 'QURAN';
  sortOrder?: 'asc' | 'desc';
  orderBy?: 'startDate' | 'days';
  status?: 'ACTIVE' | 'BROKEN';
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}) => {
  const { data } = await quranAuthApi.get('/v1/streaks', { params });
  return data;
};

/**
 * GET CURRENT STREAK DAYS
 * Path: /v1/streaks/current-streak-days
 */
export const fetchCurrentStreak = async (type = 'QURAN', timezone?: string) => {
  const headers = timezone ? { 'x-timezone': timezone } : {};
  const { data } = await quranAuthApi.get('/v1/streaks/current-streak-days', {
    params: { type },
    headers
  });
  return data;
};
