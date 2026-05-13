import { quranApi } from './axios';

/**
 * LIST ALL RUB EL HIZBS
 * Path: /rub_el_hizbs
 * Retrieves a list of all 240 Rub El Hizb segments.
 */
export const fetchRubElHizbs = async () => {
  const { data } = await quranApi.get('/rub_el_hizbs');
  return data.rub_el_hizbs;
};

/**
 * GET SINGLE RUB EL HIZB
 * Path: /rub_el_hizbs/:id
 * Retrieves details for a specific Rub El Hizb segment.
 */
export const fetchRubElHizbDetail = async (id: number | string) => {
  const { data } = await quranApi.get(`/rub_el_hizbs/${id}`);
  return data.rub_el_hizb;
};
