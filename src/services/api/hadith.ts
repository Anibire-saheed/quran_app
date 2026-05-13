import { quranApi } from './axios';

export const fetchHadithReferences = async (ayahKey: string, language = 'en') => {
  const { data } = await quranApi.get(`/hadith_references/by_ayah/${ayahKey}`, {
    params: { language }
  });
  return data.hadith_references;
};

export const fetchHadithContent = async (ayahKey: string, language = 'en', page = 1, limit = 4) => {
  const { data } = await quranApi.get(`/hadith_references/by_ayah/${ayahKey}/hadiths`, {
    params: { language, page, limit }
  });
  return data;
};

export const fetchHadithCountInRange = async (from: string, to: string, language = 'en') => {
  const { data } = await quranApi.get('/hadith_references/count_within_range', {
    params: { from, to, language }
  });
  return data;
};
