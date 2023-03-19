import { User } from '../types';
import { BASE_URL } from '.';

export function useUser() {
  const getUsersWithoutSelf = async (userId: string) => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/users?except=${userId}`, options);
    const user = await data.json();
    return user;
  };
  const getUserById = async (id: string): Promise<User> => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/users?uid=${id}`, options);
    const user = await data.json();
    return user;
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
    await fetch(`${BASE_URL}/users`, options);
  };

  const findUserByName = async (keyword: string, userId: string) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
    if (keyword.length === 0) return await getUsersWithoutSelf(userId);
    const data = await fetch(`${BASE_URL}/users?name=${keyword}`, options);
    const json = await data.json();
    return json;
  };

  return {
    getUsersWithoutSelf,
    getUserById,
    createUser,
    findUserByName,
  };
}
