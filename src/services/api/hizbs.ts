import { quranApi } from './axios';

/**
 * LIST ALL HIZBS
 * Path: /hizbs
 * Retrieves a list of all 60 Hizbs with their verse boundaries.
 */
export const fetchHizbs = async () => {
  const { data } = await quranApi.get('/hizbs');
  return data.hizbs;
};

/**
 * GET SINGLE HIZB
 * Path: /hizbs/:id
 * Retrieves details for a specific Hizb.
 */
export const fetchHizbDetail = async (id: number | string) => {
  const { data } = await quranApi.get(`/hizbs/${id}`);
  return data.hizb;
};
