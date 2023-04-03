<script setup lang="ts">
import socket from '../socket';
import Grid from '../components/Grid.vue';
import GridItem from '../components/GridItem.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import List from '../components/List.vue';
import ListItem from '../components/ListItem.vue';
import Friend from '../components/Friend.vue';
import FlipSquareLoading from '../components/Loading/FlipSquareLoading.vue';
import HamburgerIcon from '../components/Icon/HamburgerIcon.vue';
import Menu from '../mixins/Menu.vue';
import HorizontalSpacing from '../components/Spacing/HorizontalSpacing.vue';
import { ref, watch } from 'vue';
import { GroupResponse, InsensitiveResponseUserInfo } from '../types';
import { useAuth, useFriend, useGroup } from '../hooks';
import { tryOnMounted, tryOnUnmounted } from '@vueuse/core';

const friends = ref<InsensitiveResponseUserInfo[]>([]);
const groups = ref<GroupResponse[]>([]);
const onlineUsers = ref<string[]>([]);
const isLoadingFriends = ref(false);
const isLoadingGroups = ref(false);
const isOpenMenu = ref(false);

const { userId, accessToken } = useAuth();
const { getFriendsByUserId } = useFriend();
const { getGroupsByUser } = useGroup();

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

function setOnline(userIds: string[]) {
  onlineUsers.value = userIds;
}

watch(onlineUsers, (newUser, oldUser) => {
  setOnline(newUser);
});

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
  <Grid>
    <GridItem type="side">
      <HorizontalSpacing floated>
        <PrimaryButton @action="isOpenMenu = true">
          <HamburgerIcon />
        </PrimaryButton>
      </HorizontalSpacing>
      <Menu
        :open="isOpenMenu"
        :friends="friends"
        @callback="isOpenMenu = false"
      />
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
              :latestMessage="friend.lastMessage"
              :is-online="onlineUsers.includes(friend._id)"
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
