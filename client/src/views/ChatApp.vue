<script setup lang="ts">
import Grid from '../components/Container/Grid.vue';
import GridItem from '../components/Container/GridItem.vue';
import HorizontalSpacing from '../components/Spacing/HorizontalSpacing.vue';
import ModalBox from '../components/Modal/ModalBox.vue';
import ModalBody from '../components/Modal/ModalBody.vue';
import ModalFooter from '../components/Modal/ModalFooter.vue';
import CancelButton from '../components/Button/CancelButton.vue';
import User from '../components/User/User.vue';
import SendButton from '../components/Button/SendButton.vue';
import Friend from '../components/Message/Friend.vue';
import ListBox from '../components/List/ListBox.vue';
import ListItem from '../components/List/ListItem.vue';
import Search from '../components/Input/Search.vue';
import { useDebounceFn, useMemoize, useNetwork } from '@vueuse/core';
import { onMounted, onUnmounted, ref } from 'vue';
import { useAuth, useUser, useFriend } from '../services';
import type { User as TypeUser, InsensitiveUserInfo } from '../types';
import { useRouter } from 'vue-router';

const { isOnline } = useNetwork();
const router = useRouter();
const { userId, accessToken } = useAuth();
const { getUsersWithoutSelf, findUserByName } = useUser();
const { getFriendsByUserId, checkIfAdded, updateFriend } = useFriend();

const DURATION = 500;
const username = ref<string>('');
const friends = ref<InsensitiveUserInfo[]>([]);
const users = ref<TypeUser[]>([]);
const isOpenModalFind = ref(false);

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

function handleModalClose() {
  isOpenModalFind.value = false;
  username.value = '';
}

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
            :latest-message="isOnline ? 'Online' : 'Offline'"
            :on-action="() => router.replace({ path: `/chat/@${friend._id}` })"
          />
        </ListItem>
      </ListBox>
    </GridItem>
    <GridItem type="article">
      <RouterView />
    </GridItem>
  </Grid>
</template>
