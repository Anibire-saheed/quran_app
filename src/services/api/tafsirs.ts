import { quranApi } from './axios';

/**
 * LIST ALL AVAILABLE TAFSIRS
 * Path: /tafsirs
 */
export const fetchTafsirs = async (language = 'en') => {
  const { data } = await quranApi.get('/tafsirs', {
    params: { language }
  });
  return data.tafsirs;
};

/**
 * GET TAFSIR BY ID (OR SLUG)
 * Path: /tafsirs/:id
 */
export const fetchTafsir = async (id: number | string, params?: {
  chapter_number?: number;
  verse_number?: number;
  juz_number?: number;
  hizb_number?: number;
  rub_el_hizb_number?: number;
  ruku_number?: number;
  manzil_number?: number;
  page_number?: number;
}) => {
  const { data } = await quranApi.get(`/tafsirs/${id}`, { params });
  return data.tafsir;
};

/**
 * GET TAFSIR METADATA
 * Path: /tafsirs/:id/info
 */
export const fetchTafsirMeta = async (id: number | string) => {
  const { data } = await quranApi.get(`/tafsirs/${id}/info`);
  return data.info;
};
