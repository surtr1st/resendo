// Router
const BASE_URL = '/api';
export const AUTH = `${BASE_URL}/auth`;

export const CREATE_USER = `${BASE_URL}/user`;
export const USER_BY_ID = `${BASE_URL}/user`;
export const USERS_BY_NAME = `${BASE_URL}/users/search`;
export const USERS_EXCEPT_SELF = `${BASE_URL}/users/filter`;

export const CREATE_MESSAGE = `${BASE_URL}/message`;
export const MESSAGE_BY_ID = `${BASE_URL}/message`;
export const MESSAGES_BY_USER_ID = `${BASE_URL}/messages/filter`;
export const UPLOAD_MEDIA = `${BASE_URL}/message/media`;

export const CREATE_ROOM = `${BASE_URL}/room`;
export const ROOM_BY_ID = `${BASE_URL}/room`;
export const ROOMS_BY_USER_ID = `${BASE_URL}/rooms`;
export const ROOM_BY_USER_ID_AND_FRIEND_ID = `${BASE_URL}/room/filter`;
export const LATEST_MESSAGE_IN_ROOM_BY_USER = `${BASE_URL}/room/latest`;

export const IS_ADDED_FRIEND = `${BASE_URL}/friends`;
export const FRIENDS_BY_USER_ID = `${BASE_URL}/friends`;

export const CREATE_GROUP = `${BASE_URL}/group`;
export const IS_JOINED_GROUP = `${BASE_URL}/group/joined`;
export const GROUP_BY_ID = `${BASE_URL}/group`;
export const ADD_MEMBERS = `${BASE_URL}/group/member/add`;
export const REMOVE_MEMBERS = `${BASE_URL}/group/member/remove`;
export const GROUPS_BY_USER_ID = `${BASE_URL}/groups`;
export const LATEST_MESSAGE_IN_GROUP_BY_USER = `${BASE_URL}/group/latest`;

export const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
};
