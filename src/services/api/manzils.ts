import { quranApi } from './axios';

/**
 * LIST ALL MANZILS
 * Path: /manzils
 * Retrieves a list of all 7 Manzils.
 */
export const fetchManzils = async () => {
  const { data } = await quranApi.get('/manzils');
  return data.manzils;
};

/**
 * GET SINGLE MANZIL
 * Path: /manzils/:id
 * Retrieves details for a specific Manzil.
 */
export const fetchManzilDetail = async (id: number | string) => {
  const { data } = await quranApi.get(`/manzils/${id}`);
  return data.manzil;
};
