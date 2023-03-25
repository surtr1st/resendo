import { io } from 'socket.io-client';

export function useSocketIO() {
  const socket = io('http://localhost:4000', {
    withCredentials: true,
  });

  return {
    socket,
  };
}
