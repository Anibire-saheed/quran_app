import { quranAuthApi } from './axios';

/**
 * GET TODAY'S GOAL PLAN
 * Path: /v1/goals/get-todays-plan
 */
export const fetchTodaysGoalPlan = async (params: {
  type: 'QURAN_TIME' | 'QURAN_PAGES' | 'QURAN_RANGE';
  mushafId: number;
}, timezone?: string) => {
  const headers = timezone ? { 'x-timezone': timezone } : {};
  const { data } = await quranAuthApi.get('/v1/goals/get-todays-plan', { params, headers });
  return data;
};

/**
 * CREATE A GOAL
 * Path: /v1/goals
 */
export const createGoal = async (params: { mushafId: number }, goal: {
  type: string;
  amount: any;
  duration?: number;
  category: string;
}, timezone?: string) => {
  const headers = timezone ? { 'x-timezone': timezone } : {};
  const { data } = await quranAuthApi.post('/v1/goals', goal, { params, headers });
  return data;
};

/**
 * UPDATE A GOAL
 * Path: /v1/goals/:id
 */
export const updateGoal = async (id: string | number, params: { mushafId: number }, goal: {
  type?: string;
  amount?: any;
  duration?: number;
  category?: string;
}, timezone?: string) => {
  const headers = timezone ? { 'x-timezone': timezone } : {};
  const { data } = await quranAuthApi.put(`/v1/goals/${id}`, goal, { params, headers });
  return data;
};

/**
 * DELETE A GOAL
 * Path: /v1/goals/:id
 */
export const deleteGoal = async (id: string | number, params: { category: string }, timezone?: string) => {
  const headers = timezone ? { 'x-timezone': timezone } : {};
  const { data } = await quranAuthApi.delete(`/v1/goals/${id}`, { params, headers });
  return data;
};

/**
 * GENERATE TIMELINE ESTIMATION
 * Path: /v1/goals/estimate
 */
export const estimateGoalTimeline = async (params: {
  type: string;
  amount: any;
  duration?: number;
  mushafId: number;
}, timezone?: string) => {
  const headers = timezone ? { 'x-timezone': timezone } : {};
  const { data } = await quranAuthApi.get('/v1/goals/estimate', { params, headers });
  return data;
};
