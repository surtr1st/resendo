<script setup lang="ts">
import ChatBox from '../components/ChatBox/ChatBox.vue';
import ChatHeader from '../components/ChatBox/ChatHeader.vue';
import ChatFooter from '../components/ChatBox/ChatFooter.vue';
import ChatBody from '../components/ChatBox/ChatBody.vue';
import PageHeader from '../components/PageHeader/PageHeader.vue';
import Sender from '../components/Message/Sender.vue';
import Receiver from '../components/Message/Receiver.vue';
import TextArea from '../components/Input/TextArea.vue';
import SendButton from '../components/Button/SendButton.vue';
import { ref, watch } from 'vue';
import { useAuth, useMessage, useRoom } from '../services';
import { MessageResponse } from '../types';
import { triggerScrollDown } from '../helpers';
import { tryOnMounted, useDebounceFn } from '@vueuse/core';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { socket, state } from '../socket';

const route = useRoute();
const { userId, accessToken } = useAuth();
const { createMessage } = useMessage();
const { getConversationInRoom } = useRoom();

const DURATION = 250;
const content = ref<string>('');
const fullname = ref<string>('');
const room = ref<string>('');

function handleConversationInRoom() {
  getConversationInRoom({
    userId,
    friendId: route.params.userId,
    accessToken,
  })
    .then((res) => {
      const { _id, user1, user2, messages } = res;
      room.value = _id;
      socket.emit('join-room', _id);
      state.conversation = messages as MessageResponse[];
      triggerScrollDown.forceScroll = !triggerScrollDown.forceScroll;
      switch (userId) {
        case user2._id:
          fullname.value = user1.fullname;
          break;
        default:
          fullname.value = user2.fullname;
          break;
      }
    })
    .catch((err) => console.log(err));
  setTimeout(() => {
    triggerScrollDown.forceScroll = !triggerScrollDown.forceScroll;
  }, 0);
}
const debounceMessagesInRoom = useDebounceFn(
  handleConversationInRoom,
  DURATION,
);

function sendMessage() {
  const value = `${content.value}`.trim();
  if (value.length === 0) return;
  createMessage({ content: value, userId, roomId: room.value }, accessToken)
    .then(async (res) => {
      socket.emit('from-client', { message: res, room });
      triggerScrollDown.forceScroll = !triggerScrollDown.forceScroll;
    })
    .catch((err) => console.log(err));
  if (content.value) content.value = '';
}

watch(
  () => state.conversation,
  () => {
    triggerScrollDown.forceScroll = !triggerScrollDown.forceScroll;
  },
);

tryOnMounted(() => {
  debounceMessagesInRoom();
});

onBeforeRouteUpdate(() => {
  debounceMessagesInRoom();
});
</script>

<template>
  <ChatBox type="container">
    <ChatHeader>
      <PageHeader
        :author="fullname"
        avatarSrc=""
      />
    </ChatHeader>
    <ChatBody>
      <template v-for="message in state.conversation">
        <Sender
          v-if="message.user === userId"
          :id="message._id"
          :content="message.content"
        />
        <Receiver
          v-else
          :id="message._id"
          :content="message.content"
        />
      </template>
    </ChatBody>
    <ChatFooter>
      <TextArea
        v-model:content="content"
        :on-enter="sendMessage"
      >
        <SendButton
          transparent
          :on-send="sendMessage"
        />
      </TextArea>
    </ChatFooter>
  </ChatBox>
</template>
