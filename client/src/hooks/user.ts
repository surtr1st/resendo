import { BASE_URL } from '.';
import {
  AccessToken,
  InsensitiveResponseUserInfo,
  User,
  UserFilter,
} from '../types';

export function useUser() {
  const getUsersWithoutSelf = async (
    userId: string,
    accessToken: AccessToken,
  ) => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    const data = await fetch(
      `${BASE_URL}/users/filter?except=${userId}`,
      options,
    );
    return await data.json();
  };

  const getUserById = async (
    id: string,
  ): Promise<InsensitiveResponseUserInfo> => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/user?id=${id}`, options);
    return await data.json();
  };

  const createUser = async (user: User) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(user),
    };
    return await fetch(`${BASE_URL}/user`, options);
  };

  const findUserByName = async ({
    keyword,
    userId,
    accessToken,
  }: UserFilter) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    if (keyword.length === 0)
      return await getUsersWithoutSelf(userId, accessToken);
    const data = await fetch(
      `${BASE_URL}/users/search?name=${keyword}`,
      options,
    );
    return await data.json();
  };

  return {
    getUsersWithoutSelf,
    getUserById,
    createUser,
    findUserByName,
  };
}
