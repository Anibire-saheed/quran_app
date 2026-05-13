import { quranApi } from './axios';

export const fetchSurahs = async (language = 'en') => {
  const { data } = await quranApi.get('/chapters', { params: { language } });
  return data.chapters;
};

export const fetchSurahDetail = async (id: number | string, language = 'en') => {
  const { data } = await quranApi.get(`/chapters/${id}`, { params: { language } });
  return data.chapter;
};

export const fetchChapterInfo = async (id: number | string, language = 'en') => {
  const { data } = await quranApi.get(`/chapters/${id}/info`, { 
    params: { language, include_resources: true } 
  });
  return data.chapter_info;
};
