import { Room } from '../types';

const BASE_URL = 'http://localhost:4000/api';

export function useRoom() {
  const getRoomsByUserId = async (userId: string) => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const data = await fetch(`${BASE_URL}/rooms?userId=${userId}`, options);
    const rooms = await data.json();
    return rooms;
  };

  const createRoom = async (room: Partial<Room>) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(room),
    };
    const data = await fetch(`${BASE_URL}/rooms`, options);
    const id = await data.json();
    return id;
  };

  return {
    getRoomsByUserId,
    createRoom,
  };
}
