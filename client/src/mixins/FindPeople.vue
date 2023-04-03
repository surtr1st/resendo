<script setup lang="ts">
import TextField from '../components/Input/TextField.vue';
import Modal from '../components/Modal/Modal.vue';
import ModalBody from '../components/Modal/ModalBody.vue';
import ModalFooter from '../components/Modal/ModalFooter.vue';
import StrangerList from '../components/User/StrangerList.vue';
import CancelIcon from '../components/Icon/CancelIcon.vue';
import FindIcon from '../components/Icon/FindIcon.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import { useAuth, useFriend, useUser } from '../hooks';
import { UserResponse } from '../types';
import { ref } from 'vue';
import { tryOnMounted, useDebounceFn } from '@vueuse/core';
import { DEBOUNCE_DURATION } from '../helpers';

const isOpenFindPeople = ref(false);
const users = ref<UserResponse[]>([]);
const username = ref('');
const { getUsersWithoutSelf, findUserByName } = useUser();
const { userId, accessToken } = useAuth();
const { checkIfAdded, updateFriend } = useFriend();

function findPeople() {
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

tryOnMounted(() => {
  findPeople();
});
</script>

<template>
  <PrimaryButton
    label="Find"
    @action="isOpenFindPeople = true"
  >
    <FindIcon />
  </PrimaryButton>
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
