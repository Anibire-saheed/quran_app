import { quranApi } from './axios';

export const fetchTimestampRange = async (reciterId: number, chapterNumber: number, verseKey?: string) => {
  const params: any = { chapter_number: chapterNumber };
  if (verseKey) params.verse_key = verseKey;
  const { data } = await quranApi.get(`/audio/reciters/${reciterId}/timestamp`, { params });
  return data.result;
};

export const lookupVerseByTimestamp = async (reciterId: number, chapterNumber: number, timestamp: number) => {
  const { data } = await quranApi.get(`/audio/reciters/${reciterId}/lookup`, {
    params: { chapter_number: chapterNumber, timestamp, segments: true }
  });
  return data.result;
};
