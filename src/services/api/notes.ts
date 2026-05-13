import { quranAuthApi } from './axios';

/**
 * GET ALL NOTES
 * Path: /v1/notes
 */
export const fetchNotes = async (params?: {
  cursor?: string;
  limit?: number;
  sortBy?: 'newest' | 'oldest';
}) => {
  const { data } = await quranAuthApi.get('/v1/notes', { params });
  return data;
};

/**
 * ADD NOTE
 * Path: /v1/notes
 */
export const addNote = async (note: {
  body: string;
  saveToQR: boolean;
  attachedEntity?: {
    entityId: string;
    entityType: 'reflection';
    entityMetadata?: object;
  };
  ranges?: string[];
}) => {
  const { data } = await quranAuthApi.post('/v1/notes', note);
  return data;
};

/**
 * GET NOTES BY VERSE
 * Path: /v1/notes/by-verse/:verseKey
 */
export const fetchNotesByVerse = async (verseKey: string) => {
  const { data } = await quranAuthApi.get(`/v1/notes/by-verse/${verseKey}`);
  return data;
};

/**
 * GET NOTES BY ATTACHED ENTITY
 * Path: /v1/notes/by-attached-entity
 */
export const fetchNotesByEntity = async (params: {
  entityId: string;
  entityType: 'reflection';
}) => {
  const { data } = await quranAuthApi.get('/v1/notes/by-attached-entity', { params });
  return data;
};

/**
 * GET NOTES COUNT WITHIN RANGE
 * Path: /v1/notes/count-within-range
 */
export const fetchNotesCountInRange = async (params: { from: string; to: string }) => {
  const { data } = await quranAuthApi.get('/v1/notes/count-within-range', { params });
  return data;
};

/**
 * GET NOTES BY RANGE
 * Path: /v1/notes/by-range
 */
export const fetchNotesByRange = async (params: { from: string; to: string }) => {
  const { data } = await quranAuthApi.get('/v1/notes/by-range', { params });
  return data;
};

/**
 * GET NOTE BY ID
 * Path: /v1/notes/:noteId
 */
export const fetchNoteById = async (noteId: string | number, params?: { withAttachedEntities?: boolean }) => {
  const { data } = await quranAuthApi.get(`/v1/notes/${noteId}`, { params });
  return data;
};

/**
 * UPDATE NOTE BY ID
 * Path: /v1/notes/:noteId
 */
export const updateNote = async (noteId: string | number, note: {
  body: string;
  saveToQR?: boolean;
}) => {
  const { data } = await quranAuthApi.patch(`/v1/notes/${noteId}`, note);
  return data;
};

/**
 * DELETE NOTE BY ID
 * Path: /v1/notes/:noteId
 */
export const deleteNote = async (noteId: string | number) => {
  const { data } = await quranAuthApi.delete(`/v1/notes/${noteId}`);
  return data;
};

/**
 * PUBLISH NOTE TO QURAN REFLECT
 * Path: /v1/notes/:noteId/publish
 */
export const publishNote = async (noteId: string | number, update: {
  body: string;
  ranges?: string[];
}) => {
  const { data } = await quranAuthApi.post(`/v1/notes/${noteId}/publish`, update);
  return data;
};
