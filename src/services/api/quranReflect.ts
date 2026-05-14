import { quranReflectApi } from './axios';

/**
 * GET POSTS FEED
 * Path: /v1/posts/feed
 */
export const fetchReflectFeed = async (params?: {
  tab?: 'newest' | 'latest' | 'following' | 'draft' | 'favorite' | 'most_popular' | 'only_room_members' | 'public' | 'feed' | 'trending' | 'popular';
  sortBy?: 'latest' | 'popular';
  languages?: number[];
  page?: number;
  limit?: number;
  [key: string]: any;
}) => {
  const { data } = await quranReflectApi.get('/v1/posts/feed', { params });
  return data;
};

/**
 * GET RELATED POSTS
 */
export const fetchRelatedPosts = async (postId: number, params?: { limit?: number; page?: number }) => {
  const { data } = await quranReflectApi.get(`/v1/posts/${postId}/related`, { params });
  return data;
};

/**
 * GET CURRENT USER POSTS
 */
export const fetchMyPosts = async (params?: {
  tab?: 'my_reflections' | 'saved' | 'notes' | 'mentions';
  sortBy?: 'latest' | 'popular';
  limit?: number;
  page?: number;
}) => {
  const { data } = await quranReflectApi.get('/v1/posts/my-posts', { params });
  return data;
};

/**
 * GET POST LIKED STATE
 */
export const fetchPostLikedState = async (id: number) => {
  const { data } = await quranReflectApi.get(`/v1/posts/${id}/liked`);
  return data;
};

/**
 * GET POST BY ID
 */
export const fetchReflectPost = async (id: number | string) => {
  const { data } = await quranReflectApi.get(`/v1/posts/${id}`);
  return data;
};

/**
 * DELETE POST
 */
export const deletePost = async (id: number) => {
  const { data } = await quranReflectApi.delete(`/v1/posts/${id}`);
  return data;
};

/**
 * EDIT POST
 */
export const editPost = async (id: number, update: object) => {
  const { data } = await quranReflectApi.patch(`/v1/posts/${id}`, { post: update });
  return data;
};

/**
 * TRACK POST VIEW
 */
export const trackPostView = async (id: number) => {
  const { data } = await quranReflectApi.get(`/v1/posts/viewed/${id}`);
  return data;
};

/**
 * CREATE POST
 */
export const createPost = async (post: object) => {
  const { data } = await quranReflectApi.post('/v1/posts', { post });
  return data;
};

/**
 * REPORT POST ABUSE
 */
export const reportPost = async (id: number, report: object) => {
  const { data } = await quranReflectApi.post(`/v1/posts/${id}/report`, { report });
  return data;
};

/**
 * GET USER REFLECT POSTS
 */
export const fetchUserReflectPosts = async (userId: string, params?: object) => {
  const { data } = await quranReflectApi.get(`/v1/posts/user-posts/${userId}`, { params });
  return data;
};

/**
 * TOGGLE POST LIKE
 */
export const togglePostLike = async (id: number) => {
  const { data } = await quranReflectApi.post(`/v1/posts/${id}/toggle-like`);
  return data;
};

/**
 * TOGGLE POST SAVE
 */
export const togglePostSave = async (id: number) => {
  const { data } = await quranReflectApi.post(`/v1/posts/${id}/toggle-save`);
  return data;
};

/**
 * GET POST COMMENTS (Paginated)
 */
export const fetchPostComments = async (postId: number | string, params?: object) => {
  const { data } = await quranReflectApi.get(`/v1/posts/${postId}/comments`, { params });
  return data;
};

/**
 * GET ALL POST COMMENTS
 */
export const fetchAllPostComments = async (postId: number | string) => {
  const { data } = await quranReflectApi.get(`/v1/posts/${postId}/all-comments`);
  return data;
};

/**
 * EXPORT POSTS AS PDF
 */
export const exportPostsAsPdf = async (ids: number[]) => {
  const { data } = await quranReflectApi.post('/v1/posts/export/pdf', { ids }, { responseType: 'blob' });
  return data;
};

/**
 * GET POSTS COUNT WITHIN RANGE
 */
export const fetchPostsCountInRange = async (params: { from: string; to: string }) => {
  const { data } = await quranReflectApi.get('/v1/posts/count-within-range', { params });
  return data;
};

/**
 * GET POSTS BY VERSE
 */
export const fetchMyPostsByVerse = async (verseKey: string) => {
  const { data } = await quranReflectApi.get(`/v1/posts/by-verse/${verseKey}`);
  return data;
};

/**
 * SEARCH AND RETRIEVE TAGS
 */
export const fetchTags = async (params?: object) => {
  const { data } = await quranReflectApi.get('/v1/tags', { params });
  return data;
};

/**
 * CREATE NEW COMMENT
 * Path: /v1/comments
 */
export const createComment = async (comment: {
  body: string;
  postId: number;
  isPrivate?: boolean;
  parentId?: number;
  mentions?: object[];
}) => {
  const { data } = await quranReflectApi.post('/v1/comments', { comment });
  return data;
};

/**
 * DELETE A COMMENT
 * Path: /v1/comments/:id/delete (Follows documented GET method for soft-delete)
 */
export const deleteComment = async (id: number) => {
  const { data } = await quranReflectApi.get(`/v1/comments/${id}/delete`);
  return data;
};

/**
 * TOGGLE LIKE/UNLIKE A COMMENT
 * Path: /v1/comments/:id/toggle-like
 */
export const toggleCommentLike = async (id: number) => {
  const { data } = await quranReflectApi.post(`/v1/comments/${id}/toggle-like`);
  return data;
};

/**
 * GET REPLIES TO A COMMENT
 * Path: /v1/comments/:id/replies
 */
export const fetchCommentReplies = async (id: number, params?: { limit?: number; page?: number }) => {
  const { data } = await quranReflectApi.get(`/v1/comments/${id}/replies`, { params });
  return data;
};

/**
 * GET LOGGED-IN USER PROFILE
 */
export const fetchUserProfile = async (params?: { qdc?: boolean }) => {
  const { data } = await quranReflectApi.get('/v1/users/profile', { params });
  return data;
};

/**
 * EDIT USER SETTINGS (PATCH)
 */
export const editUserSettings = async (settings: object) => {
  const { data } = await quranReflectApi.patch('/v1/users/profile', settings);
  return data;
};

/**
 * UPDATE USER PROFILE (PUT)
 */
export const updateUserProfile = async (profile: object) => {
  const { data } = await quranReflectApi.put('/v1/users/profile', profile);
  return data;
};

/**
 * TOGGLE FOLLOW/UNFOLLOW
 */
export const toggleFollow = async (followeeId: string, action?: 'follow' | 'unfollow') => {
  const { data } = await quranReflectApi.post(`/v1/users/${followeeId}/toggle-follow`, { action });
  return data;
};

/**
 * GET USER PROFILE BY ID OR USERNAME
 */
export const fetchUserProfileById = async (id: string, params?: { qdc?: boolean }) => {
  const { data } = await quranReflectApi.get(`/v1/users/${id}`, { params });
  return data;
};
