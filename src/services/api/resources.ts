import { quranApi } from './axios';

/**
 * GET RECITATION INFO
 * Path: /resources/recitations/:recitation_id/info
 */
export const fetchRecitationInfo = async (recitationId: number | string) => {
  const { data } = await quranApi.get(`/resources/recitations/${recitationId}/info`);
  return data.info;
};

/**
 * GET TRANSLATION INFO
 * Path: /resources/translations/:translation_id/info
 */
export const fetchTranslationInfo = async (translationId: number | string) => {
  const { data } = await quranApi.get(`/resources/translations/${translationId}/info`);
  return data.info;
};

/**
 * LIST AVAILABLE TRANSLATIONS
 * Path: /resources/translations
 */
export const fetchAvailableTranslations = async (language = 'en') => {
  const { data } = await quranApi.get('/resources/translations', {
    params: { language }
  });
  return data.translations;
};

/**
 * LIST AVAILABLE TAFSIRS
 * Path: /resources/tafsirs
 */
export const fetchAvailableTafsirs = async (language = 'en') => {
  const { data } = await quranApi.get('/resources/tafsirs', {
    params: { language }
  });
  return data.tafsirs;
};

/**
 * GET TAFSIR INFO
 * Path: /resources/tafsirs/${tafsir_id}/info
 */
export const fetchTafsirInfo = async (tafsirId: number | string) => {
  const { data } = await quranApi.get(`/resources/tafsirs/${tafsirId}/info`);
  return data.info;
};

/**
 * LIST RECITATION STYLES
 * Path: /resources/recitation_styles
 */
export const fetchRecitationStyles = async () => {
  const { data } = await quranApi.get('/resources/recitation_styles');
  return data.recitation_styles;
};

/**
 * LIST ALL LANGUAGES
 * Path: /resources/languages
 */
export const fetchLanguages = async (language = 'en') => {
  const { data } = await quranApi.get('/resources/languages', {
    params: { language }
  });
  return data.languages;
};

/**
 * LIST CHAPTER INFO RESOURCES
 * Path: /resources/chapter_infos
 */
export const fetchChapterInfosCatalog = async () => {
  const { data } = await quranApi.get('/resources/chapter_infos');
  return data.chapter_infos;
};

/**
 * GET VERSE MEDIA
 * Path: /resources/verse_media
 * Retrieves media assets (video, etc.) related to verses.
 */
export const fetchVerseMedia = async () => {
  const { data } = await quranApi.get('/resources/verse_media');
  return data.verse_media;
};

/**
 * SYNC PUBLIC CONTENT RESOURCES
 * Path: /resources/sync
 * Advanced synchronization for local copies of Quran.Foundation content.
 */
export const syncResources = async (params: {
  resources?: string;
  bootstrap?: boolean;
  sync_token?: string;
  cursor?: string;
  per_page?: number;
}) => {
  const { data } = await quranApi.get('/resources/sync', {
    params
  });
  return data.sync;
};

/**
 * GET CONTENT RESOURCE SNAPSHOT
 * Path: /resources/snapshots/:resource_group/:id
 * Fetches a full replacement copy of a specific content resource.
 */
export const fetchResourceSnapshot = async (
  resourceGroup: 'articles' | 'recitations' | 'tafsirs' | 'translations',
  id: number | string
) => {
  const { data } = await quranApi.get(`/resources/snapshots/${resourceGroup}/${id}`);
  return data;
};
