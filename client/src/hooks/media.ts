import { BASE_URL } from '.';
import { AccessToken } from '../types';

export function useMedia() {
  const uploadMedia = async (files: FileList, accessToken: AccessToken) => {
    const formData = new FormData();
    formData.append('file', files[0]);
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: formData,
    };
    await fetch(`${BASE_URL}/media/upload`, options);
  };

  return { uploadMedia };
}
