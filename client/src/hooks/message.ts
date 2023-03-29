import { BASE_URL } from '.';
import { AccessToken, Message, MessageResponse } from '../types';

export function useMessage() {
  const createMessage = async (
    message: Message,
    accessToken: AccessToken,
  ): Promise<MessageResponse> => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer $${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify(message),
    };
    const response = await fetch(`${BASE_URL}/message`, options);
    return await response.json();
  };

  const uploadMedia = async (
    message: Partial<Message>,
    file: File,
    accessToken: AccessToken,
  ) => {
    const formData = new FormData();
    formData.append('xfile', file);
    formData.append('xjson', JSON.stringify(message));
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: formData,
    };
    const data = await fetch(`${BASE_URL}/message/media`, options);
    return await data.json();
  };

  return {
    createMessage,
    uploadMedia,
  };
}
