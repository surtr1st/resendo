// Router
const BASE_URL = '/api';
export const AUTH = `${BASE_URL}/auth`;
export const USERS = `${BASE_URL}/users`;
export const USER_BY_ID = `${BASE_URL}/users`;
export const USER_BY_NAME = `${BASE_URL}/users`;
export const USERS_EXCEPT_SELF = `${BASE_URL}/users`;
export const MESSAGES = `${BASE_URL}/messages`;
export const MESSAGE_BY_ID = `${BASE_URL}/messages`;
export const MESSAGE_BY_USER_ID = `${BASE_URL}/messages`;
export const ROOMS = `${BASE_URL}/rooms`;
export const ROOM_BY_ID = `${BASE_URL}/rooms`;
export const ROOM_BY_USER_ID = `${BASE_URL}/rooms`;
export const ROOM_BY_USER_ID_AND_FRIEND_ID = `${BASE_URL}/rooms`;
export const FRIENDS = `${BASE_URL}/friends`;
export const FRIEND_BY_ID = `${BASE_URL}/friends`;
export const FRIEND_BY_USER_ID = `${BASE_URL}/friends`;
export const FRIENDS_BY_USER_ID = `${BASE_URL}/friends`;
export const GROUPS = `${BASE_URL}/groups`;
export const GROUP_BY_USER_ID = `${BASE_URL}/groups`;
export const MEDIAS = `${BASE_URL}/media`;
export const MEDIA_BY_MESSAGE_ID = `${BASE_URL}/media`;

export const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
};
