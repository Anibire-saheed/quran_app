import { quranApi } from './axios';

/**
 * LIST ALL JUZS
 * Path: /juzs
 * Get list of all Juzs with verse boundaries for a specific mushaf.
 */
export const fetchJuzs = async (mushaf?: number) => {
  const { data } = await quranApi.get('/juzs', {
    params: { mushaf }
  });
  return data.juzs;
};

/**
 * GET SINGLE JUZ DETAIL
 * Path: /juzs/:id
 * Retrieves metadata for a specific Juz (1-30).
 */
export const fetchJuzDetail = async (id: number, mushaf?: number) => {
  const { data } = await quranApi.get(`/juzs/${id}`, {
    params: { mushaf }
  });
  return data.juz;
};
