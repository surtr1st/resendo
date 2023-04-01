<script setup lang="ts">
import socket from '../socket';
import ChatBody from '../components/ChatBox/ChatBody.vue';
import ChatBox from '../components/ChatBox/ChatBox.vue';
import ChatFooter from '../components/ChatBox/ChatFooter.vue';
import ChatHeader from '../components/ChatBox/ChatHeader.vue';
import File from '../components/Input/File.vue';
import SwapLoading from '../components/Loading/SwapLoading.vue';
import Receiver from '../components/Message/Receiver.vue';
import Sender from '../components/Message/Sender.vue';
import PageHeader from '../components/PageHeader.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import TextArea from '../components/Input/TextArea.vue';
import SendIcon from '../components/Icon/SendIcon.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { DEBOUNCE_DURATION, ScrollState } from '../helpers';
import { useAuth, useMessage, useRoom } from '../hooks';
import { MessageResponse } from '../types';
import { tryOnMounted, tryOnUnmounted, useDebounceFn } from '@vueuse/core';

const conversation = ref<MessageResponse[]>([]);
const fullname = ref('');
const isLoading = ref(true);
const content = ref<string>('');

const route = useRoute();
const { userId, accessToken } = useAuth();
const { createMessage, uploadMedia } = useMessage();
const { getConversationInRoom } = useRoom();

function onReceive() {
  socket.on('from-server', (data) => {
    conversation.value.push(data);
  });
}

function onAbort() {
  socket.off('from-server', (data) => {
    conversation.value.push(data);
  });
}

function handleConversationInRoom(friendId: string) {
  getConversationInRoom({ userId, friendId, accessToken })
    .then((res) => {
      const { _id, user1, user2, messages } = res;
      sessionStorage.setItem('Room-Id', _id);
      socket.emit('join-room', _id);
      conversation.value = messages as MessageResponse[];
      switch (userId) {
        case user2._id:
          fullname.value = user1.fullname;
          break;
        default:
          fullname.value = user2.fullname;
          break;
      }
      isLoading.value = false;
    })
    .catch((err) => console.log(err));
}
const debounceMessagesInRoom = useDebounceFn(
  handleConversationInRoom,
  DEBOUNCE_DURATION,
);

function sendMessage() {
  const value = content.value.trim();
  const roomId = sessionStorage.getItem('Room-Id') as string;
  if (value.length === 0) return;
  createMessage({ content: value, userId, roomId }, accessToken)
    .then((res) => {
      socket.emit('from-client', { message: res, room: roomId });
      ScrollState.trigger = !ScrollState.trigger;
    })
    .catch((err) => console.log(err));
  content.value = '';
}

function handleUploadFiles(files: FileList | null) {
  const roomId = sessionStorage.getItem('Room-Id') as string;
  if (files)
    uploadMedia({ userId, roomId }, files[0], accessToken)
      .then((res) => {
        socket.emit('from-client', { message: res, room: roomId });
        ScrollState.trigger = !ScrollState.trigger;
      })
      .catch((err) => console.log(err));
}
const debounceUploadFile = useDebounceFn(handleUploadFiles, DEBOUNCE_DURATION);

tryOnMounted(() => {
  onReceive();
  debounceMessagesInRoom(`${route.params.id}`);
});
tryOnUnmounted(() => onAbort());
</script>

<template>
  <SwapLoading v-if="isLoading" />
  <ChatBox
    v-else
    type="container"
  >
    <ChatHeader>
      <PageHeader :author="fullname" />
    </ChatHeader>
    <ChatBody>
      <template
        v-for="message in conversation"
        :key="message._id"
      >
        <Sender
          v-if="message.user === userId"
          :content="message.content"
          :mediaSrc="message.media"
        />
        <Receiver
          v-else
          :author="message.author"
          :content="message.content"
          :mediaSrc="message.media"
        />
      </template>
    </ChatBody>
    <ChatFooter>
      <TextArea
        v-model:value="content"
        @enter="sendMessage"
      >
        <div>
          <File
            name="upload-media"
            @upload="debounceUploadFile"
          />
        </div>
        <PrimaryButton transparent>
          <SendIcon />
        </PrimaryButton>
      </TextArea>
    </ChatFooter>
  </ChatBox>
</template>
