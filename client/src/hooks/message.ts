import { BASE_URL } from '.';
import { AccessToken, Message } from '../types';

export function useMessage() {
  const getMessagesByUserId = async (
    userId: string,
    accessToken: AccessToken,
  ) => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer $${accessToken}`,
      },
      credentials: 'include',
    };
    await fetch(`${BASE_URL}/messages?userId=${userId}`, options);
  };

  const createMessage = async (message: Message, accessToken: AccessToken) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer $${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify(message),
    };
    const data = await fetch(`${BASE_URL}/message`, options);
    const json = await data.json();
    return json;
  };

  return {
    getMessagesByUserId,
    createMessage,
  };
}
