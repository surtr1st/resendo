import socket from './socket';
import { reactive } from 'vue';
import { MessageResponse } from './types';

export const state = reactive({
  messages: [] as MessageResponse[],
});

socket.on('from-server', (data) => state.messages.push(data));
