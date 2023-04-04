import { BASE_URL } from '.';
import type { AuthenticationArgs, AuthorizeResponse } from '../types';

export function useAuth() {
  const userId = sessionStorage.getItem('userId') as string;
  const isAuth = Boolean(sessionStorage.getItem('isAuth')) ? true : false;
  const accessToken = sessionStorage.getItem('Access-Token') ?? '';
  const refreshToken = sessionStorage.getItem('Refresh-Token') ?? '';

  const setAuthorizing = (args: AuthorizeResponse) => {
    const { accessToken, refreshToken, userId } = args;
    sessionStorage.setItem('isAuth', `${true}`);
    sessionStorage.setItem('Access-Token', accessToken);
    sessionStorage.setItem('Refresh-Token', refreshToken);
    sessionStorage.setItem('userId', userId);
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
    logout,
  };
}
