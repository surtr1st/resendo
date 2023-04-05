import { BASE_URL } from '.';
import { AccessToken, FriendRequest } from '../types';

export function useFriendQueue() {
  const getFriendRequestsByUser = async (
    userId: string,
    accessToken: AccessToken,
  ): Promise<FriendRequest[]> => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/friend/${userId}/queues`, options);
    return await data.json();
  };

  const checkIfRequestSent = async (fromId: string, toId: string) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ fromId }),
    };
    const data = await fetch(
      `${BASE_URL}/friend/request/sent?userId=${toId}`,
      options,
    );
    return await data.json();
  };

  const sendFriendRequest = async (
    userId: string,
    fromId: string,
    accessToken: AccessToken,
  ) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ fromId }),
    };
    await fetch(`${BASE_URL}/friend/request?userId=${userId}`, options);
  };

  const acceptRequest = async (id: string, accessToken: AccessToken) => {
    const options: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    await fetch(`${BASE_URL}/friend/request/${id}/accept`, options);
  };

  const rejectRequest = async (id: string, accessToken: AccessToken) => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    await fetch(`${BASE_URL}/friend/request/${id}/reject`, options);
  };

  return {
    getFriendRequestsByUser,
    checkIfRequestSent,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
  };
}
