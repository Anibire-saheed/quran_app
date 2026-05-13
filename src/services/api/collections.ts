import { quranAuthApi } from './axios';

/**
 * ADD COLLECTION
 * Path: /v1/collections
 * Creates a new collection under the user's account.
 */
export const addCollection = async (name: string) => {
  const { data } = await quranAuthApi.post('/v1/collections', { name });
  return data;
};

/**
 * GET ALL COLLECTIONS
 * Path: /v1/collections
 * Lists collections owned by the user with pagination and sorting.
 */
export const fetchCollections = async (params?: {
  sortBy?: 'recentlyUpdated' | 'alphabetical' | 'alphabeticalDesc';
  type?: 'page' | 'juz' | 'surah' | 'ayah';
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}) => {
  const { data } = await quranAuthApi.get('/v1/collections', { params });
  return data;
};

/**
 * ADD COLLECTION BOOKMARK
 * Path: /v1/collections/:collectionId/bookmarks
 * Adds a bookmark (Ayah, Surah, Juz, or Page) to a collection.
 */
export const addCollectionBookmark = async (collectionId: string, bookmark: {
  key: number;
  type?: 'ayah' | 'surah' | 'juz' | 'page';
  verseNumber?: number;
  mushafId?: number;
}) => {
  const { data } = await quranAuthApi.post(`/v1/collections/${collectionId}/bookmarks`, bookmark);
  return data;
};

/**
 * DELETE COLLECTION BOOKMARK BY DETAILS
 * Path: /v1/collections/:collectionId/bookmarks
 */
export const deleteCollectionBookmarkByDetails = async (collectionId: string, bookmark: {
  key: number;
  type?: 'ayah';
  verseNumber?: number;
  mushafId?: number;
}) => {
  const { data } = await quranAuthApi.delete(`/v1/collections/${collectionId}/bookmarks`, {
    data: bookmark
  });
  return data;
};

/**
 * DELETE COLLECTION
 * Path: /v1/collections/:collectionId
 */
export const deleteCollection = async (collectionId: string) => {
  const { data } = await quranAuthApi.delete(`/v1/collections/${collectionId}`);
  return data;
};

/**
 * GET COLLECTION ITEMS BY ID
 * Path: /v1/collections/:collectionId
 */
export const fetchCollectionItems = async (collectionId: string, params?: object) => {
  const { data } = await quranAuthApi.get(`/v1/collections/${collectionId}`, { params });
  return data;
};

/**
 * UPDATE COLLECTION
 * Path: /v1/collections/:collectionId
 */
export const updateCollection = async (collectionId: string, name: string) => {
  const { data } = await quranAuthApi.post(`/v1/collections/${collectionId}`, { name });
  return data;
};

/**
 * DELETE COLLECTION BOOKMARK BY ID
 * Path: /v1/collections/:collectionId/bookmarks/:bookmarkId
 */
export const deleteCollectionBookmarkById = async (collectionId: string, bookmarkId: string) => {
  const { data } = await quranAuthApi.delete(`/v1/collections/${collectionId}/bookmarks/${bookmarkId}`);
  return data;
};

/**
 * GET ALL COLLECTION ITEMS
 * Path: /v1/collections/all
 * Retrieves all collections along with their resources.
 */
export const fetchAllCollectionItems = async (params?: object) => {
  const { data } = await quranAuthApi.get('/v1/collections/all', { params });
  return data;
};
