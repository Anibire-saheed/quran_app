import { quranApi } from './axios';

/**
 * GET SINGLE TRANSLATION (Generic/Resource Stream)
 * Path: /quran/translations/:translation_id
 */
export const fetchQuranTranslation = async (
  translationId: number | string,
  filters?: object
) => {
  const { data } = await quranApi.get(`/quran/translations/${translationId}`, {
    params: filters
  });
  return data;
};

/**
 * GET SINGLE TAFSIR (Generic/Resource Stream)
 * Path: /quran/tafsirs/:tafsir_id
 */
export const fetchQuranTafsir = async (
  tafsirId: number | string,
  filters?: object
) => {
  const { data } = await quranApi.get(`/quran/tafsirs/${tafsirId}`, {
    params: filters
  });
  return data;
};

/**
 * TRANSLATION BY CHAPTER
 */
export const fetchTranslationByChapter = async (resourceId: number | string, chapterNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/translations/${resourceId}/by_chapter/${chapterNumber}`, { params });
  return data;
};

/**
 * TRANSLATION BY PAGE
 */
export const fetchTranslationByPage = async (resourceId: number | string, pageNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/translations/${resourceId}/by_page/${pageNumber}`, { params });
  return data;
};

/**
 * TRANSLATION BY JUZ
 */
export const fetchTranslationByJuz = async (resourceId: number | string, juzNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/translations/${resourceId}/by_juz/${juzNumber}`, { params });
  return data;
};

/**
 * TRANSLATION BY RUB EL HIZB
 */
export const fetchTranslationByRub = async (resourceId: number | string, rubNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/translations/${resourceId}/by_rub_el_hizb/${rubNumber}`, { params });
  return data;
};

/**
 * TRANSLATION BY HIZB
 */
export const fetchTranslationByHizb = async (resourceId: number | string, hizbNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/translations/${resourceId}/by_hizb/${hizbNumber}`, { params });
  return data;
};

/**
 * TRANSLATION BY MANZIL
 */
export const fetchTranslationByManzil = async (resourceId: number | string, manzilNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/translations/${resourceId}/by_manzil/${manzilNumber}`, { params });
  return data;
};

/**
 * TRANSLATION BY RUKU
 */
export const fetchTranslationByRuku = async (resourceId: number | string, rukuNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/translations/${resourceId}/by_ruku/${rukuNumber}`, { params });
  return data;
};

/**
 * TRANSLATION BY AYAH
 */
export const fetchTranslationByAyah = async (resourceId: number | string, ayahKey: string, params?: object) => {
  const { data } = await quranApi.get(`/translations/${resourceId}/by_ayah/${ayahKey}`, { params });
  return data;
};

/**
 * TRANSLATION BY RUB (ALIAS)
 */
export const fetchTranslationByRubAlias = async (resourceId: number | string, rubNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/translations/${resourceId}/by_rub/${rubNumber}`, { params });
  return data;
};

/**
 * TAFSIR BY CHAPTER
 */
export const fetchTafsirByChapter = async (resourceId: number | string, chapterNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/tafsirs/${resourceId}/by_chapter/${chapterNumber}`, { params });
  return data;
};

/**
 * TAFSIR BY PAGE
 */
export const fetchTafsirByPage = async (resourceId: number | string, pageNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/tafsirs/${resourceId}/by_page/${pageNumber}`, { params });
  return data;
};

/**
 * TAFSIR BY JUZ
 */
export const fetchTafsirByJuz = async (resourceId: number | string, juzNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/tafsirs/${resourceId}/by_juz/${juzNumber}`, { params });
  return data;
};

/**
 * TAFSIR BY RUB EL HIZB
 */
export const fetchTafsirByRub = async (resourceId: number | string, rubNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/tafsirs/${resourceId}/by_rub_el_hizb/${rubNumber}`, { params });
  return data;
};

/**
 * TAFSIR BY HIZB
 */
export const fetchTafsirByHizb = async (resourceId: number | string, hizbNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/tafsirs/${resourceId}/by_hizb/${hizbNumber}`, { params });
  return data;
};

/**
 * TAFSIR BY MANZIL
 */
export const fetchTafsirByManzil = async (resourceId: number | string, manzilNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/tafsirs/${resourceId}/by_manzil/${manzilNumber}`, { params });
  return data;
};

/**
 * TAFSIR BY RUKU
 */
export const fetchTafsirByRuku = async (resourceId: number | string, rukuNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/tafsirs/${resourceId}/by_ruku/${rukuNumber}`, { params });
  return data;
};

/**
 * TAFSIR BY AYAH
 */
export const fetchTafsirByAyah = async (resourceId: number | string, ayahKey: string, params?: object) => {
  const { data } = await quranApi.get(`/tafsirs/${resourceId}/by_ayah/${ayahKey}`, { params });
  return data;
};

/**
 * TAFSIR BY RUB (ALIAS)
 */
export const fetchTafsirByRubAlias = async (resourceId: number | string, rubNumber: number, params?: object) => {
  const { data } = await quranApi.get(`/tafsirs/${resourceId}/by_rub/${rubNumber}`, { params });
  return data;
};

/**
 * GET FOOTNOTE
 * Path: /foot_notes/:id
 * Retrieves a single footnote by its ID.
 */
export const fetchFootnote = async (id: number | string) => {
  const { data } = await quranApi.get(`/foot_notes/${id}`);
  return data.foot_note;
};
