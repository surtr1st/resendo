import { Friend, Room } from '../types';

const BASE_URL = 'http://localhost:4000/api';

export function useFriend() {
  const getFriendsByUserId = async (userId: string) => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/friends?userId=${userId}`, options);
    const friends = await data.json();
    return friends;
  };

  const checkIfAdded = async (userId: string, friendId: string) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId, friendId }),
    };
    const data = await fetch(`${BASE_URL}/friends`, options);
    const result = await data.json();
    return result;
  };

  const createFriend = async (userId: string) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/friends?userId=${userId}`, options);
    const id = await data.json();
    return id;
  };

  const updateFriend = async (userId: string, friendId: string) => {
    const options: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ friendId }),
    };
    await fetch(`${BASE_URL}/friends?userId=${userId}`, options);
  };
  return {
    getFriendsByUserId,
    checkIfAdded,
    createFriend,
    updateFriend,
  };
}
