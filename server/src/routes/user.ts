import { RequestOptions } from 'https';

export function useUserRouter() {
  const hostname = 'localhost';
  const GET_USERS: RequestOptions = {
    hostname,
    path: '/api/users',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const POST_USER: RequestOptions = {
    hostname,
    path: '/api/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return { GET_USERS, POST_USER };
}
