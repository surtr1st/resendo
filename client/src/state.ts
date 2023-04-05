import socket from './socket';
import { reactive } from 'vue';
import { MessageResponse } from './types';

export const state = reactive({
  messages: [] as MessageResponse[],
  groupMessages: [] as MessageResponse[],
  isSeen: false,
});

socket.on('from-server', (data) => state.messages.push(data));
socket.on('from-group-server', (data) => state.groupMessages.push(data));
