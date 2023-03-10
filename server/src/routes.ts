// Router
const BASE_URL = '/api';
export const AUTH = `${BASE_URL}/auth`;
export const USER = `${BASE_URL}/users`;
export const USER_BY_ID = `${BASE_URL}/users`;
export const MESSAGE = `${BASE_URL}/messages`;
export const MESSAGE_BY_USER_ID = `${BASE_URL}/messages?userId`;
export const ROOM = `${BASE_URL}/rooms`;
export const ROOM_BY_USER_ID = `${BASE_URL}/rooms?userId`;
export const GROUP = `${BASE_URL}/groups`;
export const GROUP_BY_USER_ID = `${BASE_URL}/groups?userId`;
export const MEDIA = `${BASE_URL}/media`;
export const MEDIA_BY_MESSAGE_ID = `${BASE_URL}/media?messageId`;

export const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
};
