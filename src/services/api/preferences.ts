import { quranAuthApi } from './axios';

/**
 * ADD OR UPDATE PREFERENCE
 * Path: /v1/preferences
 * Updates a specific preference group (e.g., theme, translations).
 */
export const updatePreference = async (params: { mushafId: number }, body: {
  group: 'tafsirs' | 'translations' | 'audio' | 'theme' | 'quranReaderStyles' | 'reading' | 'language' | 'userHasCustomised';
  key: string;
  value: any;
}) => {
  const { data } = await quranAuthApi.post('/v1/preferences', body, { params });
  return data;
};

/**
 * GET USER PREFERENCES
 * Path: /v1/preferences
 */
export const fetchPreferences = async () => {
  const { data } = await quranAuthApi.get('/v1/preferences');
  return data;
};

/**
 * BULK UPDATE PREFERENCES
 * Path: /v1/preferences/bulk
 */
export const bulkUpdatePreferences = async (params: { mushafId: number }, body: object) => {
  const { data } = await quranAuthApi.post('/v1/preferences/bulk', body, { params });
  return data;
};
