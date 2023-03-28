import { BASE_URL } from '.';
import { AccessToken, Room, RoomArgs, RoomResponse } from '../types';

export function useRoom() {
  const getRoomsByUserId = async (userId: string, accessToken: AccessToken) => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/rooms?userId=${userId}`, options);
    const rooms = await data.json();
    return rooms;
  };

  const getConversationInRoom = async ({
    userId,
    friendId,
    accessToken,
  }: Required<RoomArgs>) => {
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
    const room: RoomResponse = await data.json();
    return room;
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
    const result = await data.json();
    return result;
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
    const id = await data.json();
    return id;
  };

  return {
    getRoomsByUserId,
    getConversationInRoom,
    getLatestMessageWithinRoom,
    createRoom,
  };
}
