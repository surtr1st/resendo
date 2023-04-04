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
import TypeIndicator from '../components/TypeIndicator.vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { DEBOUNCE_DURATION } from '../helpers';
import { useAuth, useMessage, useNotificationQueue, useRoom } from '../hooks';
import { MessageResponse } from '../types';
import { tryOnMounted, useDebounceFn } from '@vueuse/core';
import { state } from '../state';

const fullname = ref('');
const isLoading = ref(true);
const content = ref<string>('');
const isTyping = ref(false);
const who = ref('');
const avatarSrc = ref('');

const route = useRoute();
const { userId, accessToken } = useAuth();
const { createMessage, uploadMedia } = useMessage();
const { getConversationInRoom } = useRoom();
const { addToNotificationQueue, clearOnSeen } = useNotificationQueue();

function handleConversationInRoom(friendId: string) {
  getConversationInRoom({ userId, friendId, accessToken })
    .then((res) => {
      const { _id, user1, user2, messages } = res;
      sessionStorage.setItem('Room-Id', _id);
      socket.emit('join-room', _id);
      state.messages = messages as MessageResponse[];
      switch (userId) {
        case user2._id:
          fullname.value = user1.fullname;
          avatarSrc.value = user1.avatar as string;
          break;
        default:
          fullname.value = user2.fullname;
          avatarSrc.value = user2.avatar as string;
          break;
      }
      isLoading.value = false;
      clearOnSeen(friendId, accessToken);
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
      socket.emit('notification-queue', { message: res, userId });
      addToNotificationQueue({ message: res, sender: userId }, accessToken)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
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
        socket.emit('notification-queue', { message: res, userId });
        addToNotificationQueue({ message: res, sender: userId }, accessToken)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
}
const debounceUploadFile = useDebounceFn(handleUploadFiles, DEBOUNCE_DURATION);

watch(content, (newContent, oldContent) => {
  const roomId = sessionStorage.getItem('Room-Id') as string;
  if (newContent.trim() !== '')
    socket.emit('is-typing', {
      room: roomId,
      userId,
      isTyping: true,
    });
  else
    socket.emit('is-typing', {
      room: roomId,
      userId,
      isTyping: false,
    });
});

tryOnMounted(() => {
  debounceMessagesInRoom(`${route.params.id}`);
  socket.on('is-typing', (data) => {
    who.value = data.fullname;
    isTyping.value = data.isTyping;
  });
});
</script>

<template>
  <SwapLoading v-if="isLoading" />
  <ChatBox
    v-else
    type="container"
  >
    <ChatHeader>
      <PageHeader
        :author="fullname"
        :avatar-src="avatarSrc"
      />
    </ChatHeader>
    <ChatBody>
      <template
        v-for="message in state.messages"
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
          :author-avatar-src="avatarSrc"
        />
      </template>
    </ChatBody>
    <ChatFooter>
      <TypeIndicator
        :is-typing="isTyping"
        :who="who"
      />
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
