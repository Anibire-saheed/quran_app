import { quranApi } from './axios';

/**
 * GET ANSWERS BY AYAH
 * Path: /answers/by_ayah/:ayah_key
 * Retrieves published questions and answers for a specific ayah.
 */
export const fetchAnswersByAyah = async (ayahKey: string, params?: {
  page?: number;
  pageSize?: number;
  language?: string;
}) => {
  const { data } = await quranApi.get(`/answers/by_ayah/${ayahKey}`, { params });
  return data;
};

/**
 * GET ANSWER THREAD BY QUESTION ID
 * Path: /answers/:question_id
 * Retrieves a single question with its full answer thread.
 */
export const fetchAnswerThread = async (questionId: string | number) => {
  const { data } = await quranApi.get(`/answers/${questionId}`);
  return data;
};

/**
 * COUNT ANSWERS WITHIN RANGE
 * Path: /answers/count_within_range
 * Gets per-verse counts of published questions within a specific range.
 */
export const fetchAnswersCountInRange = async (from: string, to: string, language = 'en') => {
  const { data } = await quranApi.get('/answers/count_within_range', {
    params: { from, to, language }
  });
  return data;
};
