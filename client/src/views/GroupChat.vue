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
import GroupSettings from '../mixins/GroupSettings.vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { DEBOUNCE_DURATION, ScrollState } from '../helpers';
import { useAuth, useMessage, useGroup } from '../hooks';
import { InsensitiveResponseUserInfo, MessageResponse } from '../types';
import { tryOnMounted, useDebounceFn } from '@vueuse/core';
import { state } from '../state';

const title = ref('');
const isLoading = ref(true);
const content = ref<string>('');
const isTyping = ref(false);
const users = ref<Record<string, { fullname: string; isTyping: boolean }>>({});
const groupMembers = ref<InsensitiveResponseUserInfo[]>([]);
const route = useRoute();
const id = route.params.id as string;
const { userId, accessToken } = useAuth();
const { createMessage, uploadMedia } = useMessage();
const { getGroupById } = useGroup();

function handleConversationInRoom(id: string) {
  getGroupById(id, accessToken)
    .then((res) => {
      const { _id, title: groupTitle, messages, users: members } = res;
      sessionStorage.setItem('Group-Id', _id);
      socket.emit('join-room', _id);
      title.value = groupTitle;
      state.groupMessages = messages as MessageResponse[];
      groupMembers.value = members;
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
      socket.emit('from-group-client', { message: res, room: groupId });
    })
    .catch((err) => console.log(err));
  content.value = '';
}

function handleUploadFiles(files: FileList | null) {
  const groupId = sessionStorage.getItem('Group-Id') as string;
  if (files)
    uploadMedia({ userId, groupId }, files[0], accessToken)
      .then((res) => {
        socket.emit('from-group-client', { message: res, room: groupId });
      })
      .catch((err) => console.log(err));
}
const debounceUploadFile = useDebounceFn(handleUploadFiles, DEBOUNCE_DURATION);

watch(content, (newContent, oldContent) => {
  const groupId = sessionStorage.getItem('Group-Id') as string;
  if (newContent.trim() !== '')
    socket.emit('is-group-typing', {
      userId,
      room: groupId,
      isTyping: true,
    });
  else
    socket.emit('is-group-typing', {
      userId,
      room: groupId,
      isTyping: false,
    });
  console.log(users.value);
});

tryOnMounted(() => {
  debounceMessagesInRoom(id);
  socket.on('is-group-typing', (data) => {
    users.value[data.userId] = data;
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
      <PageHeader :author="title" />
      <GroupSettings
        :group-id="id"
        :title="title"
      />
    </ChatHeader>
    <ChatBody>
      <template
        v-for="message in state.groupMessages"
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
          :author-avatar-src="
            groupMembers[state.groupMessages.indexOf(message)].avatar
          "
        />
      </template>
    </ChatBody>
    <ChatFooter>
      <TypeIndicator
        :is-typing="isTyping"
        :users="users"
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
