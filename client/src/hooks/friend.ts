import { BASE_URL } from '.';
import { AccessToken, FriendArgs } from '../types';

export function useFriend() {
  const getFriendsByUserId = async (
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
    const data = await fetch(`${BASE_URL}/friends?userId=${userId}`, options);
    return await data.json();
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
    return await data.json();
  };

  const updateFriend = async ({
    userId,
    friendId,
    accessToken,
  }: Required<FriendArgs>) => {
    const options: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ friendId }),
    };
    return await fetch(`${BASE_URL}/friends?userId=${userId}`, options);
  };
  return {
    getFriendsByUserId,
    checkIfAdded,
    updateFriend,
  };
}
