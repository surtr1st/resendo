<script setup lang="ts">
import ChatBox from '../../components/ChatBox/ChatBox.vue';
import ChatHeader from '../../components/ChatBox/ChatHeader.vue';
import ChatFooter from '../../components/ChatBox/ChatFooter.vue';
import ChatBody from '../../components/ChatBox/ChatBody.vue';
import Grid from '../../components/Container/Grid.vue';
import GridItem from '../../components/Container/GridItem.vue';
import HorizontalSpacing from '../../components/Spacing/HorizontalSpacing.vue';
import ModalBox from '../../components/Modal/ModalBox.vue';
import ModalBody from '../../components/Modal/ModalBody.vue';
import ModalFooter from '../../components/Modal/ModalFooter.vue';
import CancelButton from '../../components/Button/CancelButton.vue';
import User from '../../components/User/User.vue';
import SendButton from '../../components/Button/SendButton.vue';
import Friend from '../../components/Message/Friend.vue';
import ListBox from '../../components/List/ListBox.vue';
import ListItem from '../../components/List/ListItem.vue';
import PageHeader from '../../components/PageHeader/PageHeader.vue';
import Sender from '../../components/Message/Sender.vue';
import Receiver from '../../components/Message/Receiver.vue';
import Search from '../../components/Input/Search.vue';
import TextArea from '../../components/Input/TextArea.vue';
import { io } from 'socket.io-client';
import { useDebounceFn, useMemoize } from '@vueuse/core';
import { onMounted, reactive, ref, watch } from 'vue';
import {
  useAuth,
  useMessage,
  useUser,
  useFriend,
  useRoom,
} from '../../services';
import type {
  User as TypeUser,
  InsensitiveUserInfo,
  MessageResponse,
} from '../../types';
import { triggerScrollDown } from '../../helpers';

const { userId, accessToken } = useAuth();
const { createMessage } = useMessage();
const { getUsersWithoutSelf, findUserByName } = useUser();
const { getFriendsByUserId, checkIfAdded, updateFriend } = useFriend();
const { getConversationInRoom } = useRoom();
const state = reactive({
  socket: io('http://localhost:4000', {
    withCredentials: true,
    requestTimeout: 5000,
    reconnectionAttempts: 3,
  }),
});

const DURATION = 500;
const content = ref<string>('');
const username = ref<string>('');
const fullname = ref<string>('');
const room = ref<string>('');
const conversation = ref<MessageResponse[]>([]);
const friends = ref<InsensitiveUserInfo[]>([]);
const users = ref<TypeUser[]>([]);

const isOpenModalFind = ref(false);
const isMount = ref(false);

const retrieveFriends = useMemoize(
  async () => await getFriendsByUserId(userId, accessToken),
);

async function findPeople() {
  isOpenModalFind.value = true;
  const responseUsers = await getUsersWithoutSelf(userId, accessToken);
  const filteredAddedUsers = [];
  for (const user of responseUsers) {
    const isAdded = await checkIfAdded(userId, user._id as string);
    if (!isAdded) filteredAddedUsers.push(user);
  }
  users.value = filteredAddedUsers;
}

function addFriend(filteredUserId: string) {
  updateFriend({ userId, friendId: filteredUserId, accessToken })
    .then(async () => {
      const remainUsers = users.value.filter(
        (user) => user._id !== filteredUserId,
      );
      users.value = remainUsers;
      friends.value = await retrieveFriends();
    })
    .catch((err) => console.log(err));
}
const debounceAddFriend = useDebounceFn(addFriend, DURATION);

async function filterUser() {
  const value = `${username.value}`.trim();
  if (value.length === 0) return;
  users.value = await findUserByName({ keyword: value, userId, accessToken });
}
const debounceFilterUser = useDebounceFn(filterUser, DURATION);

function handleConversationInRoom(friendId: string) {
  isMount.value = true;
  getConversationInRoom({ userId, friendId, accessToken })
    .then((res) => {
      const { _id, user1, user2, messages } = res;
      room.value = _id;
      state.socket.emit('join-room', _id);
      conversation.value = messages as MessageResponse[];
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
      state.socket.emit('from-client', { message: res, room });
      triggerScrollDown.forceScroll = !triggerScrollDown.forceScroll;
    })
    .catch((err) => console.log(err));
  if (content.value) content.value = '';
}

function handleModalClose() {
  isOpenModalFind.value = false;
  username.value = '';
}

watch(conversation, () => {
  triggerScrollDown.forceScroll = !triggerScrollDown.forceScroll;
});

watch(
  () => state.socket,
  (newSocket) => {
    newSocket.on('from-server', (data) => {
      conversation.value.push(data);
    });
  },
);

onMounted(async () => {
  friends.value = await retrieveFriends();
});
</script>

<template>
  <Grid>
    <GridItem type="side">
      <ListBox>
        <ListItem>
          <HorizontalSpacing>
            <SendButton
              label="Find"
              :on-send="findPeople"
            />
          </HorizontalSpacing>
          <ModalBox
            :open="isOpenModalFind"
            title="Find People"
            :on-close="handleModalClose"
          >
            <ModalBody>
              <Search
                type="text"
                label="User Name"
                name="room-input"
                v-model:input-value="username"
                clearable
                :on-clear="
                  () => {
                    if (username) username = '';
                  }
                "
                :on-enter="debounceFilterUser"
              />
              <HorizontalSpacing>
                <User
                  v-for="user in users"
                  avatar-src=""
                  :uid="user._id"
                  :name="user.fullname"
                  :add-friend="() => debounceAddFriend(user._id as string)"
                  :is-self="user._id === userId"
                />
              </HorizontalSpacing>
            </ModalBody>
            <ModalFooter>
              <CancelButton
                label="Cancel"
                :on-cancel="handleModalClose"
              />
            </ModalFooter>
          </ModalBox>
          <Friend
            v-for="friend in friends"
            :id="friend._id"
            avatarSrc=""
            :opponent-name="friend.fullname"
            latest-message=""
            :on-action="() => debounceMessagesInRoom(friend._id as string)"
          />
        </ListItem>
      </ListBox>
    </GridItem>
    <GridItem type="article">
      <ChatBox
        v-show="isMount"
        type="container"
      >
        <ChatHeader>
          <PageHeader
            :author="fullname"
            avatarSrc=""
          />
        </ChatHeader>
        <ChatBody>
          <template v-for="message in conversation">
            <Sender
              :id="message._id"
              v-if="message.user === userId"
              :content="message.content"
            />
            <Receiver
              :id="message._id"
              v-else
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
    </GridItem>
  </Grid>
</template>
