import { quranReflectApi } from './axios';

/**
 * UPDATE ROOM ADMIN ACCESS
 * Path: /v1/rooms/admins-access
 */
export const updateRoomAdminAccess = async (params: {
  roomId: number;
  userId: string;
  admin: boolean;
}) => {
  const { data } = await quranReflectApi.post('/v1/rooms/admins-access', params);
  return data;
};

/**
 * CREATE NEW GROUP
 * Path: /v1/rooms/groups
 */
export const createGroup = async (group: {
  name: string;
  description?: string;
  url: string;
  public?: boolean;
  hideFollowJoinButton?: boolean;
}) => {
  const { data } = await quranReflectApi.post('/v1/rooms/groups', group);
  return data;
};

/**
 * UPDATE GROUP
 * Path: /v1/rooms/groups
 */
export const updateGroup = async (group: {
  id: number;
  name?: string;
  description?: string;
  url?: string;
  removeAvatar?: boolean;
  avatar?: string;
  country?: string;
  public?: boolean;
  hideFollowJoinButton?: boolean;
}) => {
  const { data } = await quranReflectApi.patch('/v1/rooms/groups', group);
  return data;
};

/**
 * CREATE NEW PAGE (REQUEST)
 * Path: /v1/rooms/pages
 */
export const createPageRequest = async (page: {
  name: string;
  description?: string;
  jobTitle: string;
  contactNumber: string;
  organizationName: string;
  organizationWebsite?: string;
  purpose: string;
  additionalDetails?: string;
  country?: string;
  url: string;
  public?: boolean;
  hideFollowJoinButton?: boolean;
}) => {
  const { data } = await quranReflectApi.post('/v1/rooms/pages', page);
  return data;
};

/**
 * UPDATE PAGE
 * Path: /v1/rooms/pages
 */
export const updatePage = async (page: {
  id: number;
  removeAvatar?: boolean;
  avatar?: string;
  public?: boolean;
  hideFollowJoinButton?: boolean;
  name?: string;
  description?: string;
  organizationWebsite?: string;
  country?: string;
  url?: string;
}) => {
  const { data } = await quranReflectApi.patch('/v1/rooms/pages', page);
  return data;
};

/**
 * GET ROOM MEMBERS
 * Path: /v1/rooms/:id/members
 */
export const fetchRoomMembers = async (roomId: number, params?: { limit?: number; page?: number }) => {
  const { data } = await quranReflectApi.get(`/v1/rooms/${roomId}/members`, { params });
  return data;
};

/**
 * INVITE USER TO ROOM
 * Path: /v1/rooms/:id/invite
 */
export const inviteToRoom = async (roomId: number, invite: { userIds?: string[]; emails?: string[] }) => {
  const { data } = await quranReflectApi.post(`/v1/rooms/${roomId}/invite`, invite);
  return data;
};

/**
 * ACCEPT ROOM INVITE
 * Path: /v1/rooms/:id/accept-invite
 */
export const acceptRoomInvite = async (roomId: number, token: string) => {
  const { data } = await quranReflectApi.get(`/v1/rooms/${roomId}/accept-invite`, { params: { token } });
  return data;
};

/**
 * REJECT ROOM INVITE
 * Path: /v1/rooms/:id/reject-invite
 */
export const rejectRoomInvite = async (roomId: number, token: string) => {
  const { data } = await quranReflectApi.get(`/v1/rooms/${roomId}/reject-invite`, { params: { token } });
  return data;
};

/**
 * REMOVE MEMBER FROM ROOM
 * Path: /v1/rooms/:id/members/:userId
 */
export const removeRoomMember = async (roomId: number, userId: string) => {
  const { data } = await quranReflectApi.delete(`/v1/rooms/${roomId}/members/${userId}`);
  return data;
};

/**
 * GET JOINED OR MANAGED ROOMS
 * Path: /v1/rooms/joined-rooms
 */
export const fetchUserJoinedRooms = async (params?: {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: 'NAME_ASC' | 'NAME_DESC' | 'LATEST_ACTIVITY';
}) => {
  const { data } = await quranReflectApi.get('/v1/rooms/joined-rooms', { params });
  return data;
};

/**
 * SEARCH ROOMS
 * Path: /v1/rooms/search
 */
export const searchRooms = async (params?: {
  query?: string;
  page?: number;
  limit?: number;
  roomType?: 'GROUP' | 'PAGE';
}) => {
  const { data } = await quranReflectApi.get('/v1/rooms/search', { params });
  return data;
};

/**
 * GET ROOM PROFILE BY URL (GROUP)
 * Path: /v1/rooms/group/:url
 */
export const fetchGroupProfile = async (url: string) => {
  const { data } = await quranReflectApi.get(`/v1/rooms/group/${url}`);
  return data;
};

/**
 * ACCEPT ROOM INVITE BY PRIVATE TOKEN (URL-based)
 * Path: /v1/rooms/group/:url/accept/:token
 */
export const acceptPrivateRoomInvite = async (url: string, token: string) => {
  const { data } = await quranReflectApi.get(`/v1/rooms/group/${url}/accept/${token}`);
  return data;
};

/**
 * GET ROOM PROFILE BY ID
 * Path: /v1/rooms/:id
 */
export const fetchRoomProfile = async (roomId: number) => {
  const { data } = await quranReflectApi.get(`/v1/rooms/${roomId}`);
  return data;
};

/**
 * GET ROOM POSTS
 * Path: /v1/rooms/:id/posts
 */
export const fetchRoomPosts = async (roomId: number, params?: {
  sortBy?: 'latest' | 'popular';
  limit?: number;
  page?: number;
  tab?: 'reflections' | 'saved' | 'public' | 'members_only';
}) => {
  const { data } = await quranReflectApi.get(`/v1/rooms/${roomId}/posts`, { params });
  return data;
};

/**
 * JOIN A GROUP
 * Path: /v1/rooms/:groupId/join
 */
export const joinGroup = async (groupId: number) => {
  const { data } = await quranReflectApi.post(`/v1/rooms/${groupId}/join`);
  return data;
};

/**
 * LEAVE A GROUP
 * Path: /v1/rooms/:groupId/leave
 */
export const leaveGroup = async (groupId: number) => {
  const { data } = await quranReflectApi.post(`/v1/rooms/${groupId}/leave`);
  return data;
};

/**
 * FOLLOW A PAGE
 * Path: /v1/rooms/:pageId/follow
 */
export const followPage = async (pageId: number) => {
  const { data } = await quranReflectApi.post(`/v1/rooms/${pageId}/follow`);
  return data;
};

/**
 * UNFOLLOW A PAGE
 * Path: /v1/rooms/:pageId/unfollow
 */
export const unfollowPage = async (pageId: number) => {
  const { data } = await quranReflectApi.post(`/v1/rooms/${pageId}/unfollow`);
  return data;
};

/**
 * UPDATE POST PRIVACY IN ROOM
 * Path: /v1/rooms/:roomId/posts/:postId/privacy
 */
export const updateRoomPostPrivacy = async (roomId: number, postId: number, isPublic: boolean) => {
  const { data } = await quranReflectApi.patch(`/v1/rooms/${roomId}/posts/${postId}/privacy`, { isPublic });
  return data;
};
