import { quranApi } from './axios';

/**
 * LIST ALL AVAILABLE TRANSLATIONS
 * Path: /translations
 */
export const fetchTranslations = async (language = 'en') => {
  const { data } = await quranApi.get('/translations', {
    params: { language }
  });
  return data.translations;
};

/**
 * GET TRANSLATION BY ID
 * Path: /translations/:id
 */
export const fetchTranslation = async (id: number | string, params?: {
  chapter_number?: number;
  verse_number?: number;
  juz_number?: number;
  hizb_number?: number;
  rub_el_hizb_number?: number;
  ruku_number?: number;
  manzil_number?: number;
  page_number?: number;
}) => {
  const { data } = await quranApi.get(`/translations/${id}`, { params });
  return data.translations;
};

/**
 * GET TRANSLATION METADATA
 * Path: /translations/:id/info
 */
export const fetchTranslationMeta = async (id: number | string) => {
  const { data } = await quranApi.get(`/translations/${id}/info`);
  return data.info;
};
