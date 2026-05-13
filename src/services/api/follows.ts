import { quranAuthApi } from './axios';

/**
 * TOGGLE FOLLOW/UNFOLLOW A USER
 * Path: /v1/users/:id/toggle-follow
 */
export const toggleFollowUser = async (userId: number | string) => {
  const { data } = await quranAuthApi.post(`/v1/users/${userId}/toggle-follow`);
  return data;
};

/**
 * GET USER FOLLOWERS
 * Path: /v1/users/:id/followers
 */
export const fetchUserFollowers = async (userId: number | string, params?: {
  first?: number;
  after?: string;
}) => {
  const { data } = await quranAuthApi.get(`/v1/users/${userId}/followers`, { params });
  return data;
};

/**
 * GET USERS FOLLOWED BY USER
 * Path: /v1/users/:id/following
 */
export const fetchUserFollowing = async (userId: number | string, params?: {
  first?: number;
  after?: string;
}) => {
  const { data } = await quranAuthApi.get(`/v1/users/${userId}/following`, { params });
  return data;
};

/**
 * REMOVE A FOLLOWER
 * Path: /v1/users/followers/:id
 */
export const removeFollower = async (followerId: number | string) => {
  const { data } = await quranAuthApi.delete(`/v1/users/followers/${followerId}`);
  return data;
};
