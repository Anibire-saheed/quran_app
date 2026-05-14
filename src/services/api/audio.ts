import { quranApi } from './axios';

/**
 * GET ALL CHAPTER RECITERS
 * Path: /resources/chapter_reciters
 */
export const fetchChapterReciters = async (language = 'en') => {
  try {
    const { data } = await quranApi.get('/resources/recitations', { params: { language } });
    return data.recitations || data.reciters;
  } catch (err) {
    // Fallback for Foundation API path
    const { data } = await quranApi.get('/resources/chapter_reciters', { params: { language } });
    return data.reciters || data.recitations;
  }
};

/**
 * GET ALL VERSE RECITATIONS (RESOURCES)
 * Path: /resources/recitations
 */
export const fetchAyahRecitations = async (language = 'en') => {
  const { data } = await quranApi.get('/resources/recitations', { params: { language } });
  return data.recitations;
};

/**
 * GET ALL CHAPTER RECITATIONS FOR A RECITER
 * Path: /chapter_recitations/:reciter_id
 */
export const fetchAllChapterRecitations = async (reciterId: number | string) => {
  const { data } = await quranApi.get(`/chapter_recitations/${reciterId}`);
  return data.audio_files;
};

/**
 * GET SPECIFIC CHAPTER RECITATION
 * Path: /chapter_recitations/:reciter_id/:chapter_id
 */
export const fetchChapterRecitation = async (reciterId: number | string, chapterId: number | string, segments = false) => {
  const { data } = await quranApi.get(`/chapter_recitations/${reciterId}/${chapterId}`, {
    params: { segments }
  });
  return data.audio_file;
};

// Alias for backward compatibility
export const fetchAudioByChapter = fetchChapterRecitation;

/**
 * GET VERSE RECITATIONS BY CHAPTER
 * Path: /recitations/:recitation_id/by_chapter/:chapter_id
 */
export const fetchVerseRecitationsByChapter = async (recitationId: number | string, chapterId: number | string, params?: {
  page?: number;
  per_page?: number;
  fields?: string;
}) => {
  const { data } = await quranApi.get(`/recitations/${recitationId}/by_chapter/${chapterId}`, {
    params: { 
      page: params?.page || 1, 
      per_page: params?.per_page || 50, 
      fields: params?.fields || 'url,duration,segments' 
    }
  });
  return data;
};

/**
 * GET VERSE RECITATIONS BY KEY
 * Path: /recitations/:recitation_id/by_ayah/:ayah_key
 */
export const fetchVerseRecitationsByKey = async (recitationId: number | string, ayahKey: string, params?: { fields?: string }) => {
  const { data } = await quranApi.get(`/recitations/${recitationId}/by_ayah/${ayahKey}`, {
    params: { fields: params?.fields || 'url,duration,segments' }
  });
  return data.audio_files;
};
