import { quranApi } from './axios';

/**
 * LIST ALL RUKUS
 * Path: /rukus
 * Retrieves a list of all Rukus.
 */
export const fetchRukus = async () => {
  const { data } = await quranApi.get('/rukus');
  return data.rukus;
};

/**
 * GET SINGLE RUKU
 * Path: /rukus/:id
 * Retrieves details for a specific Ruku.
 */
export const fetchRukuDetail = async (id: number | string) => {
  const { data } = await quranApi.get(`/rukus/${id}`);
  return data.ruku;
};
