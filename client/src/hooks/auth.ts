import { BASE_URL } from '.';
import type { AuthenticationArgs, AuthorizeResponse } from '../types';

export function useAuth() {
  const userId = sessionStorage.getItem('userId') as string;
  const isAuth = Boolean(sessionStorage.getItem('isAuth')) ? true : false;
  const accessToken = sessionStorage.getItem('Access-Token') ?? '';
  const refreshToken = sessionStorage.getItem('Refresh-Token') ?? '';
  const COOKIE_NAME = 'JWT';
  const DAYS = 7;
  const TIME = 24 * 60 * 60 * 1000;

  const setAuthorizing = (args: AuthorizeResponse) => {
    const { accessToken, refreshToken, userId } = args;
    sessionStorage.setItem('isAuth', `${true}`);
    sessionStorage.setItem('Access-Token', accessToken);
    sessionStorage.setItem('Refresh-Token', refreshToken);
    sessionStorage.setItem('userId', userId);
  };

  const setCookie = (args: AuthorizeResponse) => {
    const { accessToken } = args;
    const date = new Date();
    date.setTime(date.getTime() + DAYS * TIME);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${COOKIE_NAME}=${accessToken};${expires};path=/`;
  };

  const getCookie = (name: string) => {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  const authorize = async (args: AuthenticationArgs) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ...args }),
    };
    return await fetch(`${BASE_URL}/auth`, options);
  };

  const logout = (): void => {
    sessionStorage.clear();
    location.reload();
  };

  return {
    userId,
    isAuth,
    accessToken,
    refreshToken,
    authorize,
    setAuthorizing,
    setCookie,
    getCookie,
    logout,
  };
}
