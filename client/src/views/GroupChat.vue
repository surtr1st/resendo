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
import { useAuth, useMessage, useGroup } from '../hooks';
import { MessageResponse } from '../types';
import { tryOnMounted, tryOnUnmounted, useDebounceFn } from '@vueuse/core';

const conversation = ref<MessageResponse[]>([]);
const title = ref('');
const isLoading = ref(true);
const content = ref<string>('');

const route = useRoute();
const { userId, accessToken } = useAuth();
const { createMessage, uploadMedia } = useMessage();
const { getGroupById } = useGroup();

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

function handleConversationInRoom(id: string) {
  getGroupById(id, accessToken)
    .then((res) => {
      const { _id, title: groupTitle, messages } = res;
      sessionStorage.setItem('Group-Id', _id);
      socket.emit('join-room', _id);
      title.value = groupTitle;
      conversation.value = messages as MessageResponse[];
      ScrollState.trigger = !ScrollState.trigger;
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
  const groupId = sessionStorage.getItem('Group-Id') as string;
  if (value.length === 0) return;
  createMessage({ content: value, userId, groupId }, accessToken)
    .then((res) => {
      socket.emit('from-client', { message: res, room: groupId });
      ScrollState.trigger = !ScrollState.trigger;
    })
    .catch((err) => console.log(err));
  content.value = '';
}

function handleUploadFiles(files: FileList | null) {
  const groupId = sessionStorage.getItem('Group-Id') as string;
  if (files)
    uploadMedia({ userId, groupId }, files[0], accessToken)
      .then((res) => {
        socket.emit('from-client', { message: res, room: groupId });
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
      <PageHeader :author="title" />
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
