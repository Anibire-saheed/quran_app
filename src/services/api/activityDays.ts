import { quranAuthApi } from './axios';

/**
 * ADD OR UPDATE ACTIVITY DAY
 * Path: /v1/activity-days
 * Records daily progress (reading time and ranges) for streaks and goals.
 * Use headers to specify 'x-timezone' for accurate date calculation.
 */
export const updateActivityDay = async (activity: {
  type: 'QURAN' | 'LESSON' | 'QURAN_READING_PROGRAM';
  seconds: number;
  ranges: string[];
  mushafId: number;
  date?: string;
}, timezone?: string) => {
  const headers = timezone ? { 'x-timezone': timezone } : {};
  const { data } = await quranAuthApi.post('/v1/activity-days', activity, { headers });
  return data;
};

/**
 * GET ACTIVITY DAYS
 * Path: /v1/activity-days
 * Retrieves daily progress totals for calendar and history views.
 */
export const fetchActivityDays = async (params?: {
  from?: string;
  to?: string;
  dateOrderBy?: 'asc' | 'desc';
  type?: 'QURAN' | 'LESSON' | 'QURAN_READING_PROGRAM';
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}) => {
  const { data } = await quranAuthApi.get('/v1/activity-days', { params });
  return data;
};

/**
 * ESTIMATE READING TIME
 * Path: /v1/activity-days/estimate-reading-time
 * Calculates expected reading seconds for given verse ranges.
 */
export const estimateReadingTime = async (ranges: string) => {
  const { data } = await quranAuthApi.get('/v1/activity-days/estimate-reading-time', {
    params: { ranges }
  });
  return data;
};
