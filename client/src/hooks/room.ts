import { BASE_URL } from '.';
import { AccessToken, Room, RoomArgs, RoomResponse } from '../types';

export function useRoom() {
  const getRoomsByUserId = async (
    userId: string,
    accessToken: AccessToken,
  ): Promise<RoomResponse> => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/rooms?userId=${userId}`, options);
    return await data.json();
  };

  const getConversationInRoom = async ({
    userId,
    friendId,
    accessToken,
  }: Required<RoomArgs>): Promise<RoomResponse> => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    const data = await fetch(
      `${BASE_URL}/room/filter?userId=${userId}&friendId=${friendId}`,
      options,
    );
    return await data.json();
  };

  const getLatestMessageWithinRoom = async (
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
    const data = await fetch(
      `${BASE_URL}/room/latest?userId=${userId}`,
      options,
    );
    return await data.json();
  };

  const createRoom = async (room: Partial<Room>, accessToken: AccessToken) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify(room),
    };
    const data = await fetch(`${BASE_URL}/room`, options);
    return await data.json();
  };

  return {
    getRoomsByUserId,
    getConversationInRoom,
    getLatestMessageWithinRoom,
    createRoom,
  };
}
