<script setup lang="ts">
import TextField from '../components/Input/TextField.vue';
import Modal from '../components/Modal/Modal.vue';
import ModalBody from '../components/Modal/ModalBody.vue';
import ModalFooter from '../components/Modal/ModalFooter.vue';
import VerticalSpacing from '../components/Spacing/VerticalSpacing.vue';
import HorizontalSpacing from '../components/Spacing/HorizontalSpacing.vue';
import FriendList from '../components/User/FriendList.vue';
import CancelIcon from '../components/Icon/CancelIcon.vue';
import CreateIcon from '../components/Icon/CreateIcon.vue';
import PeopleTeamIcon from '../components/Icon/PeopleTeamIcon.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import { ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useAuth, useGroup, useToast } from '../hooks';
import { Group, InsensitiveResponseUserInfo } from '../types';
import { DEBOUNCE_DURATION } from '../helpers';

interface IGroupCreator {
  friends?: InsensitiveResponseUserInfo[];
}
defineProps<IGroupCreator>();

const isOpenCreateGroup = ref(false);
const members = ref<string[]>([]);
const groupTitle = ref('');
const { onSuccess, onError } = useToast();
const { createGroup } = useGroup();
const { userId, accessToken } = useAuth();

function handleCreateGroup() {
  if (!groupTitle.value) return;
  if (groupTitle.value.length === 0) {
    onError('Cannot create group without a title!');
    return;
  }
  const group: Group = {
    title: groupTitle.value,
    owner: userId,
    users: members.value,
  };
  createGroup(group, accessToken)
    .then(() => {
      onSuccess('Created a group!');
      isOpenCreateGroup.value = false;
      members.value = [];
      groupTitle.value = '';
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
</script>

<template>
  <SecondaryButton
    label="Create Group"
    @action="isOpenCreateGroup = true"
  >
    <CreateIcon />
  </SecondaryButton>
  <Modal
    :open="isOpenCreateGroup"
    title="Create a Group"
    @close="isOpenCreateGroup = false"
  >
    <ModalBody>
      <TextField
        label="Title"
        name="group-input"
        v-model:value="groupTitle"
        @clear="groupTitle = ''"
      />
      <HorizontalSpacing>
        <FriendList
          v-for="friend in friends"
          :key="friend._id"
          :uid="friend._id"
          :name="friend.fullname"
          :label="members.includes(friend._id) ? 'Added' : 'Add'"
          @action="() => handleAddToGroup(friend._id)"
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
