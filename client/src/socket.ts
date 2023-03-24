import { io } from 'socket.io-client';
import { reactive } from 'vue';
import { MessageResponse } from './types';

export const socket = io('http://localhost:4000', {
  withCredentials: true,
  reconnection: true,
});

export const state = reactive({
  conversation: [] as MessageResponse[],
});

socket.on('from-server', (data) => state.conversation.push(data));
