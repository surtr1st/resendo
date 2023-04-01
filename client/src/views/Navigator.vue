<script setup lang="ts">
import socket from '../socket';
import Grid from '../components/Grid.vue';
import GridItem from '../components/GridItem.vue';
import TextField from '../components/Input/TextField.vue';
import Modal from '../components/Modal/Modal.vue';
import ModalBody from '../components/Modal/ModalBody.vue';
import ModalFooter from '../components/Modal/ModalFooter.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import HorizontalSpacing from '../components/Spacing/HorizontalSpacing.vue';
import VerticalSpacing from '../components/Spacing/VerticalSpacing.vue';
import ErrorNotify from '../components/Toasty/ErrorNotify.vue';
import SuccessNotify from '../components/Toasty/SuccessNotify.vue';
import FriendList from '../components/User/FriendList.vue';
import StrangerList from '../components/User/StrangerList.vue';
import List from '../components/List.vue';
import ListItem from '../components/ListItem.vue';
import Friend from '../components/Friend.vue';
import FlipSquareLoading from '../components/Loading/FlipSquareLoading.vue';
import CancelIcon from '../components/Icon/CancelIcon.vue';
import CreateIcon from '../components/Icon/CreateIcon.vue';
import PeopleTeamIcon from '../components/Icon/PeopleTeamIcon.vue';
import FindIcon from '../components/Icon/FindIcon.vue';
import { reactive, ref } from 'vue';
import {
  Group,
  GroupResponse,
  InsensitiveResponseUserInfo,
  UserResponse,
} from '../types';
import { useAuth, useFriend, useGroup, useUser } from '../hooks';
import { DEBOUNCE_DURATION } from '../helpers';
import { tryOnMounted, tryOnUnmounted, useDebounceFn } from '@vueuse/core';

const users = ref<UserResponse[]>([]);
const friends = ref<InsensitiveResponseUserInfo[]>([]);
const groups = ref<GroupResponse[]>([]);
const members = ref<string[]>([]);
const onlineUsers = ref<string[]>([]);
const isLoadingFriends = ref(false);
const isLoadingGroups = ref(false);
const username = ref('');
const groupTitle = ref('');
const responseMessage = reactive({
  success: false,
  error: false,
});
const isOpenFindPeople = ref(false);
const isOpenCreateGroup = ref(false);

const { getUsersWithoutSelf, findUserByName } = useUser();
const { getFriendsByUserId, checkIfAdded, updateFriend } = useFriend();
const { userId, accessToken } = useAuth();
const { getGroupsByUser, createGroup } = useGroup();

async function retrieveFriends() {
  try {
    isLoadingFriends.value = true;
    const data = await getFriendsByUserId(userId, accessToken);
    friends.value = data;
    isLoadingFriends.value = false;
  } catch (e) {
    console.log(e);
  }
}

async function retrieveGroups() {
  try {
    isLoadingGroups.value = true;
    const data = await getGroupsByUser(userId, accessToken);
    groups.value = data;
    isLoadingGroups.value = false;
  } catch (e) {
    console.log(e);
  }
}

function findPeople() {
  isOpenFindPeople.value = true;
  getUsersWithoutSelf(userId, accessToken)
    .then(async (res: UserResponse[]) => {
      const filteredAddedUsers = [];
      for await (const user of res) {
        const isAdded = await checkIfAdded(userId, user._id as string);
        if (!isAdded) filteredAddedUsers.push(user);
      }
      users.value = filteredAddedUsers;
    })
    .catch((err) => console.log(err));
}

function addFriend(filteredUserId: string) {
  updateFriend({ userId, friendId: filteredUserId, accessToken })
    .then(() => {
      const remainUsers = users.value.filter(
        (user) => user._id !== filteredUserId,
      );
      users.value = remainUsers;
    })
    .catch((err) => console.log(err));
}
const debounceAddFriend = useDebounceFn(addFriend, DEBOUNCE_DURATION);

function filterUser() {
  const value = username.value.trim();
  if (value.length === 0) return;
  findUserByName({ keyword: value, userId, accessToken })
    .then((res) => (users.value = res))
    .catch((err) => console.log(err));
}
const debounceFilterUser = useDebounceFn(filterUser, DEBOUNCE_DURATION);

function handleCreateGroup() {
  if (!groupTitle.value) return;
  if (groupTitle.value.length === 0) {
    responseMessage.error = true;
    return;
  }
  const group: Group = {
    title: groupTitle.value,
    owner: userId,
    users: members.value,
  };
  createGroup(group, accessToken)
    .then(() => {
      responseMessage.success = true;
      members.value = [];
    })
    .catch((err) => console.log(err));
}
const debounceCreateGroup = useDebounceFn(handleCreateGroup, DEBOUNCE_DURATION);

function handleAddToGroup(user: string) {
  if (members.value.length === 0) {
    members.value.push(user);
    return;
  }
  if (!members.value.includes(user)) {
    members.value.push(user);
    return;
  }
  const filtered = members.value.filter((member) => member !== user);
  members.value = filtered;
}
const debounceAddToGroup = useDebounceFn(handleAddToGroup, DEBOUNCE_DURATION);

function setOnline(userIds: string[]) {
  onlineUsers.value = userIds;
}

tryOnMounted(() => {
  socket.connect();
  socket.emit('online', { isOnline: true, userId });
  socket.on('user-onlines', setOnline);
  retrieveFriends();
  retrieveGroups();
});

tryOnUnmounted(() => {
  socket.disconnect();
  socket.off('online', () => {});
  socket.off('user-onlines', setOnline);
});
</script>

<template>
  <SuccessNotify
    v-show="responseMessage.success"
    message="Created group!"
    :duration="3000"
    @reset="responseMessage.success = false"
  />
  <ErrorNotify
    v-show="responseMessage.error"
    message="Cannot create group without a title!"
    :duration="3000"
    @reset="responseMessage.error = false"
  />
  <Grid>
    <GridItem type="side">
      <HorizontalSpacing floated>
        <PrimaryButton
          label="Find"
          @action="findPeople"
        >
          <FindIcon />
        </PrimaryButton>
        <PrimaryButton
          label="Create Group"
          @action="isOpenCreateGroup = true"
        >
          <CreateIcon />
        </PrimaryButton>
      </HorizontalSpacing>
      <Modal
        :open="isOpenFindPeople"
        title="Find People"
        @close="isOpenFindPeople = false"
      >
        <ModalBody>
          <TextField
            label="Username"
            name="room-input"
            @clear="username = ''"
            @enter="debounceFilterUser"
          />
          <HorizontalSpacing>
            <StrangerList
              v-for="user in users"
              :key="user._id"
              :uid="user._id"
              :name="user.fullname"
              :is-self="user._id === userId"
              @action="() => debounceAddFriend(user._id)"
            />
          </HorizontalSpacing>
        </ModalBody>
        <ModalFooter>
          <PrimaryButton
            label="Cancel"
            @action="isOpenFindPeople = false"
          >
            <CancelIcon />
          </PrimaryButton>
        </ModalFooter>
      </Modal>
      <Modal
        :open="isOpenCreateGroup"
        title="Create a Group"
        @close="isOpenCreateGroup = false"
      >
        <ModalBody>
          <TextField
            label="Title"
            name="group-input"
            @clear="groupTitle = ''"
          />
          <HorizontalSpacing>
            <FriendList
              v-for="user in users"
              :key="user._id"
              :uid="user._id"
              :name="user.fullname"
              :temporaryDisabled="members.includes(user._id)"
              @action="() => debounceAddToGroup(user._id)"
            />
          </HorizontalSpacing>
          <VerticalSpacing>
            <h3 class="member-label">
              <PeopleTeamIcon />
              Members: {{ members.length }}
            </h3>
          </VerticalSpacing>
        </ModalBody>
        <ModalFooter>
          <PrimaryButton
            label="Create"
            @action="debounceCreateGroup"
          >
            <CreateIcon />
          </PrimaryButton>
          <PrimaryButton
            label="Cancel"
            @action="isOpenCreateGroup = false"
          >
            <CancelIcon />
          </PrimaryButton>
        </ModalFooter>
      </Modal>
      <List>
        <ListItem>
          <Friend
            invisible
            avatar-src=""
            opponent-name=""
          />
          <FlipSquareLoading v-if="isLoadingFriends || isLoadingGroups" />
          <template v-else>
            <Friend
              v-for="friend in friends"
              :key="friend._id"
              :opponentName="friend.fullname"
              :latestMessage="
                onlineUsers.includes(friend._id) ? 'Online' : 'Offline'
              "
              @action="$router.replace({ path: `/@chat/${friend._id}` })"
            />
            <Friend
              v-for="group in groups"
              :key="group._id"
              :opponentName="group.title"
              :latestMessage="`${group.lastMessage.sender && '@'}${
                group.lastMessage.sender
              }${group.lastMessage.sender && ': '}${group.lastMessage.content}`"
              @action="$router.replace({ path: `/@chat/group/${group._id}` })"
            />
          </template>
        </ListItem>
      </List>
    </GridItem>
    <GridItem type="article">
      <RouterView :key="$route.fullPath" />
    </GridItem>
  </Grid>
</template>

<style scoped>
.member-label {
  background: var(--darker-bg);
  border-radius: '10px';
  padding: '.5rem';
  display: 'flex';
  gap: '.2rem';
}
</style>
