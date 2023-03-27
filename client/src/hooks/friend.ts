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
    await fetch(`${BASE_URL}/friends?userId=${userId}`, options);
  };
  return {
    getFriendsByUserId,
    checkIfAdded,
    updateFriend,
  };
}
