import { io } from 'socket.io-client';

export function useSocketIO() {
  const socket = io();
  const receive = () => {
    let message;
    socket.on('from-server', (arg) => (message = arg));
    return message;
  };
  const emit = (arg: any) => socket.emit('from-client', arg);

  return {
    receive,
    emit,
  };
}
