import { BASE_URL } from '.';
import type { AccessToken, User, UserFilter } from '../types';
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
    const data = await fetch(`${BASE_URL}/users?except=${userId}`, options);
    const user = await data.json();
    return user;
  };
  const getUserById = async (id: string) => {
    const options: RequestInit = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/users?userId=${id}`, options);
    const user = await data.json();
    return user;
  };
  const createUser = async (user: User) => {
    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(user),
    };
    await fetch(`${BASE_URL}/users`, options);
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
    const data = await fetch(`${BASE_URL}/users?name=${keyword}`, options);
    const json = await data.json();
    return json;
  };
  return { getUsersWithoutSelf, getUserById, createUser, findUserByName };
}
