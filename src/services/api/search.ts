import { quranSearchApi } from './axios';

/**
 * SEARCH QURAN CONTENT
 * Path: /api/v1/search
 * This is the primary search API used for both navigational (quick) 
 * and detailed (advanced) results.
 */
export const searchQuran = async (params: {
  mode: 'advanced' | 'quick';
  query: string;
  filter_translations?: string;
  exact_matches_only?: '0' | '1';
  get_text?: '0' | '1';
  highlight?: '0' | '1';
  navigationalResultsNumber?: number;
  versesResultsNumber?: number;
  indexes?: string;
  translation_ids?: string;
}) => {
  const { data } = await quranSearchApi.get('/api/v1/search', { params });
  return data;
};
