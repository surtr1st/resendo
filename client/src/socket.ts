import { io } from 'socket.io-client';
import { SERVER_URL, SOCKET_AUTH_TOKEN } from './hooks';

export function useSocketIO() {
  return io(SERVER_URL, {
    auth: { token: SOCKET_AUTH_TOKEN },
  });
}
