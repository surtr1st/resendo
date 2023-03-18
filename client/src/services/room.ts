import { BASE_URL } from '.';
import { Room, RoomResponse } from '../types';

export function useRoom() {
  const getRoomsByUserId = async (userId: string) => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/rooms?userId=${userId}`, options);
    const rooms = await data.json();
    return rooms;
  };

  const getConversationInRoom = async (userId: string, friendId: string) => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
    const data = await fetch(
      `${BASE_URL}/rooms?userId=${userId}&friendId=${friendId}`,
      options,
    );
    const room: RoomResponse = await data.json();
    return room;
  };

  const createRoom = async (room: Partial<Room>) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(room),
    };
    const data = await fetch(`${BASE_URL}/rooms`, options);
    const id = await data.json();
    return id;
  };

  return {
    getRoomsByUserId,
    getConversationInRoom,
    createRoom,
  };
}
