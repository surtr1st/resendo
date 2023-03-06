import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useSocketIO() {
  const socket = io('http://localhost:4000');
  const [message, setMessage] = useState<any>(null);
  useEffect(() => {
    socket.on('from-server', (arg) => {
      setMessage(arg);
    });

    return () => {};
  }, [socket]);
  const emit = (arg: any) => socket.emit('from-client', arg);

  return {
    message,
    emit,
  };
}
