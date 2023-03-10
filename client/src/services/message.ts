import { Message } from '../types';

const BASE_URL = 'http://localhost:4000/api';

export function useMessage() {
  const getMessagesByUserId = async (userId: string) => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
    await fetch(`${BASE_URL}/messages?userId=${userId}`, options);
  };

  const createMessage = async (message: Message) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(message),
    };
    await fetch(`${BASE_URL}/messages`, options);
  };

  return {
    getMessagesByUserId,
    createMessage,
  };
}
