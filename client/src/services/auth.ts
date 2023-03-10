import type { AuthenticationArgs, AuthorizeResponse } from '../types';

const BASE_URL = 'http://localhost:4000/api';

export function useAuth() {
  const userId = sessionStorage.getItem('userId') as string;
  const isAuth = Boolean(sessionStorage.getItem('isAuth')) ? true : false;
  const accessToken = sessionStorage.getItem('Access-Token');
  const refreshToken = sessionStorage.getItem('Refresh-Token');

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
    await fetch(`${BASE_URL}/auth`, options).then(async (res) => {
      const data: AuthorizeResponse = await res.json();
      setAuthorizing(data);
    });
  };

  return {
    userId,
    isAuth,
    accessToken,
    refreshToken,
    authorize,
  };
}
