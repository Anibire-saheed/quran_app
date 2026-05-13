import { quranAuthApi } from './axios';

/**
 * ADD OR UPDATE USER BOOKMARK
 * Path: /v1/bookmarks
 * Creates or updates a regular bookmark, or sets the user's singleton reading bookmark.
 */
export const addUserBookmark = async (bookmark: {
  key: number;
  type: 'ayah' | 'surah' | 'juz' | 'page';
  verseNumber?: number;
  isReading?: boolean | null;
  mushafId?: number;
}) => {
  const { data } = await quranAuthApi.post('/v1/bookmarks', bookmark);
  return data;
};

/**
 * GET USER BOOKMARKS
 * Path: /v1/bookmarks
 * Retrieves all bookmarks, including those belonging to collections.
 */
export const fetchUserBookmarks = async (params: {
  mushafId: number;
  type?: 'page' | 'juz' | 'surah' | 'ayah';
  isReading?: boolean;
  key?: number;
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}) => {
  const { data } = await quranAuthApi.get('/v1/bookmarks', { params });
  return data;
};

/**
 * DELETE STANDALONE BOOKMARK
 * Path: /v1/bookmarks/:bookmarkId
 * Removes orphan bookmarks or sets isReading=false for bookmarks in collections.
 */
export const deleteUserBookmark = async (bookmarkId: string) => {
  const { data } = await quranAuthApi.delete(`/v1/bookmarks/${bookmarkId}`);
  return data;
};

/**
 * GET BOOKMARKS WITHIN AYAH RANGE
 * Path: /v1/bookmarks/ayahs-range
 */
export const fetchBookmarksInRange = async (params: {
  chapterNumber: number;
  rangeStartAyahNumber: number;
  rangeEndAyahNumber: number;
  mushafId: number;
}) => {
  const { data } = await quranAuthApi.get('/v1/bookmarks/ayahs-range', { params });
  return data;
};

/**
 * GET BOOKMARK BY DETAILS
 * Path: /v1/bookmarks/bookmark
 */
export const fetchBookmarkByDetails = async (params: {
  mushafId?: number;
  key?: number;
  type?: 'page' | 'juz' | 'surah' | 'ayah';
  verseNumber?: number;
  isReading?: boolean;
}) => {
  const { data } = await quranAuthApi.get('/v1/bookmarks/bookmark', { params });
  return data;
};

/**
 * GET BOOKMARK COLLECTIONS
 * Path: /v1/bookmarks/collections
 * Retrieves named collection IDs for a bookmark.
 */
export const fetchBookmarkCollections = async (params: {
  key: number;
  mushafId: number;
  type?: 'page' | 'juz' | 'surah' | 'ayah';
  includeDefault?: boolean;
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}) => {
  const { data } = await quranAuthApi.get('/v1/bookmarks/collections', { params });
  return data;
};
