import { quranAuthApi } from './axios';

/**
 * ADD OR UPDATE READING SESSION
 * Path: /v1/reading-sessions
 * Tracks the user's most recent reading location for "Continue reading" UX.
 */
export const updateReadingSession = async (chapterNumber: number, verseNumber: number) => {
  const { data } = await quranAuthApi.post('/v1/reading-sessions', {
    chapterNumber,
    verseNumber
  });
  return data;
};

/**
 * GET READING SESSIONS
 * Path: /v1/reading-sessions
 * Retrieves ordered location history for "Recently read" UX.
 */
export const fetchReadingSessions = async (params?: {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}) => {
  const { data } = await quranAuthApi.get('/v1/reading-sessions', { params });
  return data;
};
