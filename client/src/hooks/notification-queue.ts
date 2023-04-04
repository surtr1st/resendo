import { BASE_URL } from '.';
import {
  AccessToken,
  NotificationQueueArgs,
  NotificationQueueResponse,
} from '../types';

export function useNotificationQueue() {
  const getNotificationsQueue = async (
    senderId: string,
    accessToken: AccessToken,
  ): Promise<NotificationQueueResponse> => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    const data = await fetch(
      `${BASE_URL}/notifications?sender=${senderId}`,
      options,
    );
    return await data.json();
  };

  const addToNotificationQueue = async (
    { message, sender }: NotificationQueueArgs,
    accessToken: AccessToken,
  ) => {
    const options: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ message, sender }),
    };
    await fetch(`${BASE_URL}/notifications`, options);
  };

  const clearOnSeen = async (senderId: string, accessToken: AccessToken) => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ senderId }),
    };
    await fetch(`${BASE_URL}/notifications/seen`, options);
  };

  return {
    getNotificationsQueue,
    addToNotificationQueue,
    clearOnSeen,
  };
}
