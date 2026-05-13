import { quranApi } from './axios';

/**
 * FETCH VERSES BY CHAPTER
 * Uses the high-performance /verses/by_chapter/:chapter_number endpoint
 */
export const fetchSurahVerses = async (
  chapterNumber: number | string,
  page = 1,
  perPage = 10,
  options?: {
    translationId?: number | string;
    fields?: string;
  }
) => {
  const translationId = options?.translationId ?? 131;
  const fields = options?.fields ?? 'text_uthmani,verse_key,verse_number';
  const { data } = await quranApi.get(`/verses/by_chapter/${chapterNumber}`, {
    params: {
      language: 'en',
      words: true,
      translations: `${translationId},57`,
      fields,
      page,
      per_page: perPage,
    }
  });
  return data;
};

/**
 * FETCH VERSES BY PAGE
 */
export const fetchVersesByPage = async (
  pageNumber: number, 
  mushaf?: number,
  page = 1,
  perPage = 10
) => {
  const { data } = await quranApi.get(`/verses/by_page/${pageNumber}`, {
    params: {
      mushaf,
      language: 'en',
      words: true,
      translations: '131,57',
      fields: 'text_uthmani,verse_key,verse_number',
      page,
      per_page: perPage,
    }
  });
  return data;
};

/**
 * FETCH VERSES BY JUZ
 */
export const fetchVersesByJuz = async (
  juzNumber: number,
  page = 1,
  perPage = 10
) => {
  const { data } = await quranApi.get(`/verses/by_juz/${juzNumber}`, {
    params: {
      language: 'en',
      words: true,
      translations: '131,57',
      fields: 'text_uthmani,verse_key,verse_number',
      page,
      per_page: perPage,
    }
  });
  return data;
};

/**
 * FETCH VERSES BY HIZB
 */
export const fetchVersesByHizb = async (
  hizbNumber: number,
  page = 1,
  perPage = 10
) => {
  const { data } = await quranApi.get(`/verses/by_hizb/${hizbNumber}`, {
    params: {
      language: 'en',
      words: true,
      translations: '131,57',
      fields: 'text_uthmani,verse_key,verse_number',
      page,
      per_page: perPage,
    }
  });
  return data;
};

/**
 * FETCH VERSES BY RUB EL HIZB
 */
export const fetchVersesByRub = async (
  rubNumber: number,
  page = 1,
  perPage = 10
) => {
  const { data } = await quranApi.get(`/verses/by_rub/${rubNumber}`, {
    params: {
      language: 'en',
      words: true,
      translations: '131,57',
      fields: 'text_uthmani,verse_key,verse_number',
      page,
      per_page: perPage,
    }
  });
  return data;
};

/**
 * FETCH VERSES BY RUB EL HIZB (ALIAS)
 */
export const fetchVersesByRubAlias = async (
  rubNumber: number,
  page = 1,
  perPage = 10
) => {
  const { data } = await quranApi.get(`/verses/by_rub_el_hizb/${rubNumber}`, {
    params: {
      language: 'en',
      words: true,
      translations: '131,57',
      fields: 'text_uthmani,verse_key,verse_number',
      page,
      per_page: perPage,
    }
  });
  return data;
};

/**
 * FETCH VERSES BY MANZIL
 */
export const fetchVersesByManzil = async (
  manzilNumber: number,
  page = 1,
  perPage = 10
) => {
  const { data } = await quranApi.get(`/verses/by_manzil/${manzilNumber}`, {
    params: {
      language: 'en',
      words: true,
      translations: '131,57',
      fields: 'text_uthmani,verse_key,verse_number',
      page,
      per_page: perPage,
    }
  });
  return data;
};

/**
 * FETCH VERSES BY RUKU
 */
export const fetchVersesByRuku = async (
  rukuNumber: number,
  page = 1,
  perPage = 10
) => {
  const { data } = await quranApi.get(`/verses/by_ruku/${rukuNumber}`, {
    params: {
      language: 'en',
      words: true,
      translations: '131,57',
      fields: 'text_uthmani,verse_key,verse_number',
      page,
      per_page: perPage,
    }
  });
  return data;
};

/**
 * FETCH VERSES BY RANGE
 */
export const fetchVersesByRange = async (
  from: string,
  to: string,
  page = 1,
  perPage = 10
) => {
  const { data } = await quranApi.get('/verses/by_range', {
    params: {
      from,
      to,
      language: 'en',
      words: true,
      translations: '131,57',
      fields: 'text_uthmani,verse_key,verse_number',
      page,
      per_page: perPage,
    }
  });
  return data;
};

/**
 * FETCH SPECIFIC VERSE BY KEY
 */
export const fetchVerseByKey = async (verseKey: string) => {
  const { data } = await quranApi.get(`/verses/by_key/${verseKey}`, {
    params: {
      language: 'en',
      words: true,
      translations: '131,57',
      fields: 'text_uthmani,verse_key,verse_number',
    }
  });
  return data.verse;
};

/**
 * FETCH RANDOM VERSE
 */
export const fetchRandomVerse = async (filters?: {
  chapter_number?: number;
  page_number?: number;
  juz_number?: number;
  hizb_number?: number;
  rub_el_hizb_number?: number;
  ruku_number?: number;
  manzil_number?: number;
}) => {
  const { data } = await quranApi.get('/verses/random', {
    params: {
      ...filters,
      language: 'en',
      words: true,
      translations: '131,57',
      fields: 'text_uthmani,verse_key,verse_number',
    }
  });
  return data.verse;
};

/**
 * FETCH QURAN BY SCRIPT (Generic)
 */
export const fetchQuranByScript = async (
  script: string,
  filters?: {
    chapter_number?: number;
    juz_number?: number;
    page_number?: number;
    hizb_number?: number;
    rub_el_hizb_number?: number;
    manzil_number?: number;
    ruku_number?: number;
    verse_key?: string;
  }
) => {
  const { data } = await quranApi.get(`/quran/verses/${script}`, {
    params: filters
  });
  return data;
};

/**
 * FETCH INDOPAK SCRIPT
 */
export const fetchQuranIndopak = async (filters?: object) => {
  const { data } = await quranApi.get('/quran/verses/indopak', {
    params: filters
  });
  return data;
};

/**
 * FETCH INDOPAK NASTALEEQ SCRIPT
 */
export const fetchQuranIndopakNastaleeq = async (filters?: object) => {
  const { data } = await quranApi.get('/quran/verses/indopak_nastaleeq', {
    params: filters
  });
  return data;
};

/**
 * FETCH UTHMANI TAJWEED SCRIPT
 */
export const fetchQuranTajweed = async (filters?: object) => {
  const { data } = await quranApi.get('/quran/verses/uthmani_tajweed', {
    params: filters
  });
  return data;
};

/**
 * FETCH UTHMANI SCRIPT
 */
export const fetchQuranUthmani = async (filters?: object) => {
  const { data } = await quranApi.get('/quran/verses/uthmani', {
    params: filters
  });
  return data;
};

/**
 * FETCH UTHMANI SIMPLE SCRIPT
 */
export const fetchQuranUthmaniSimple = async (filters?: object) => {
  const { data } = await quranApi.get('/quran/verses/uthmani_simple', {
    params: filters
  });
  return data;
};

/**
 * FETCH IMLAEI SCRIPT
 */
export const fetchQuranImlaei = async (filters?: object) => {
  const { data } = await quranApi.get('/quran/verses/imlaei', {
    params: filters
  });
  return data;
};

/**
 * FETCH V1 GLYPH CODES
 */
export const fetchQuranCodeV1 = async (filters?: object) => {
  const { data } = await quranApi.get('/quran/verses/code_v1', {
    params: filters
  });
  return data;
};

/**
 * FETCH V2 GLYPH CODES
 * Path: /quran/verses/code_v2
 * Retrieves glyph codes for QCF V2 font rendering.
 */
export const fetchQuranCodeV2 = async (filters?: object) => {
  const { data } = await quranApi.get('/quran/verses/code_v2', {
    params: filters
  });
  return data;
};
