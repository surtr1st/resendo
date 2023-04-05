<script setup lang="ts">
import TextField from '../components/Input/TextField.vue';
import Modal from '../components/Modal/Modal.vue';
import ModalBody from '../components/Modal/ModalBody.vue';
import ModalFooter from '../components/Modal/ModalFooter.vue';
import StrangerList from '../components/User/StrangerList.vue';
import CancelIcon from '../components/Icon/CancelIcon.vue';
import FindIcon from '../components/Icon/FindIcon.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import HorizontalSpacing from '../components/Spacing/HorizontalSpacing.vue';
import { ref } from 'vue';
import { tryOnMounted, useDebounceFn } from '@vueuse/core';
import { useAuth, useFriend, useUser, useFriendQueue } from '../hooks';
import { InsensitiveResponseUserInfo } from '../types';
import { DEBOUNCE_DURATION } from '../helpers';

const isOpenFindPeople = ref(false);
const users = ref<InsensitiveResponseUserInfo[]>([]);
const username = ref('');
const tempLabel = ref('');
const { getUsersWithoutSelf, findUserByName } = useUser();
const { userId, accessToken } = useAuth();
const { checkIfAdded } = useFriend();
const { sendFriendRequest } = useFriendQueue();

function findPeople() {
  getUsersWithoutSelf(userId, accessToken)
    .then(async (res) => {
      const filteredAddedUsers = [];
      for await (const user of res) {
        const isAdded = await checkIfAdded(userId, user._id);
        if (!isAdded) filteredAddedUsers.push(user);
      }
      users.value = filteredAddedUsers;
    })
    .catch((err) => console.log(err));
}

function addFriend(filteredUserId: string) {
  sendFriendRequest(filteredUserId, userId, accessToken)
    .then(() => (tempLabel.value = 'Sent Request'))
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

tryOnMounted(() => {
  findPeople();
});
</script>

<template>
  <SecondaryButton
    label="Find"
    @action="isOpenFindPeople = true"
  >
    <FindIcon />
  </SecondaryButton>
  <Modal
    :open="isOpenFindPeople"
    title="Find People"
    @close="isOpenFindPeople = false"
  >
    <ModalBody>
      <TextField
        label="Username"
        name="room-input"
        v-model:value="username"
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
          :temporary-label="tempLabel"
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
</template>
