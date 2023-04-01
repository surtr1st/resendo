import io from 'socket.io-client';
import { SERVER_URL, SOCKET_AUTH_TOKEN } from './hooks';

const socket = io(SERVER_URL, {
  autoConnect: false,
  auth: { token: SOCKET_AUTH_TOKEN },
});

export default socket;
