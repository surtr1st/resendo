<script setup lang="ts">
import Modal from '../components/Modal/Modal.vue';
import ModalBody from '../components/Modal/ModalBody.vue';
import ModalFooter from '../components/Modal/ModalFooter.vue';
import TextField from '../components/Input/TextField.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import FriendList from '../components/User/FriendList.vue';
import GearIcon from '../components/Icon/GearIcon.vue';
import VerticalSpacing from '../components/Spacing/VerticalSpacing.vue';
import HorizontalSpacing from '../components/Spacing/HorizontalSpacing.vue';
import PeopleTeamIcon from '../components/Icon/PeopleTeamIcon.vue';
import FilledPersonAddIcon from '../components/Icon/FilledPersonAddIcon.vue';
import CreateIcon from '../components/Icon/CreateIcon.vue';
import CancelIcon from '../components/Icon/CancelIcon.vue';
import { onMounted, ref } from 'vue';
import { useAuth, useFriend, useGroup } from '../hooks';
import { InsensitiveResponseUserInfo } from '../types';
import { useDebounceFn } from '@vueuse/core';
import { DEBOUNCE_DURATION } from '../helpers';

interface ISetting {
  groupId?: string;
  title?: string;
}
const { groupId } = defineProps<ISetting>();

const open = ref(false);
const openAddMember = ref(false);
const isLoadingFriends = ref(false);
const isLoadingMembers = ref(false);
const members = ref<string[]>([]);
const friends = ref<InsensitiveResponseUserInfo[]>([]);
const groupMembers = ref<InsensitiveResponseUserInfo[]>([]);
const {
  getOutsideGroupUsers,
  addMembers,
  removeMember,
  getMembersWithinGroup,
} = useGroup();
const { userId, accessToken } = useAuth();
const { getFriendsByUserId } = useFriend();

async function retrieveFriends() {
  try {
    isLoadingFriends.value = true;
    const data = await getFriendsByUserId(userId, accessToken);
    const friendIds = [];
    for (const user of data) friendIds.push(user._id);
    const noneAddedUsers = await getOutsideGroupUsers(
      groupId as string,
      friendIds,
    );
    console.log(noneAddedUsers);
    friends.value = noneAddedUsers;
    isLoadingFriends.value = false;
  } catch (e) {
    console.log(e);
  }
}

async function retrieveMembers() {
  try {
    isLoadingMembers.value = true;
    const data = await getMembersWithinGroup(groupId as string, accessToken);
    groupMembers.value = data;
    isLoadingMembers.value = false;
  } catch (e) {
    console.log(e);
  }
}

function handleAddToQueue(user: string) {
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

function handleAddToGroup() {
  addMembers(groupId as string, members.value, accessToken)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}
const debounceAddToGroup = useDebounceFn(handleAddToGroup, DEBOUNCE_DURATION);

function handleRemoveMember(memberId: string) {
  removeMember(groupId as string, memberId, accessToken)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}
const debounceRemoveMember = useDebounceFn(
  handleRemoveMember,
  DEBOUNCE_DURATION,
);

onMounted(() => {
  retrieveMembers();
  retrieveFriends();
});
</script>

<template>
  <PrimaryButton @action="open = true">
    <GearIcon />
  </PrimaryButton>
  <Modal
    :open="open"
    title="Group Settings"
    @close="open = false"
  >
    <ModalBody>
      <TextField
        :value="title"
        readonly
      />
      <VerticalSpacing>
        <PrimaryButton
          label="Add member"
          @action="openAddMember = true"
        >
          <FilledPersonAddIcon />
        </PrimaryButton>
      </VerticalSpacing>
      <FriendList
        v-for="member in groupMembers"
        :key="member._id"
        :uid="member._id"
        :name="member.fullname"
        label="Remove"
        @action="() => debounceRemoveMember(member._id)"
      />
    </ModalBody>
  </Modal>
  <Modal
    :open="openAddMember"
    title="Add friend to group"
    @close="openAddMember = false"
  >
    <ModalBody>
      <HorizontalSpacing>
        <FriendList
          v-for="friend in friends"
          :key="friend._id"
          :uid="friend._id"
          :name="friend.fullname"
          :label="members.includes(friend._id) ? 'Added' : 'Add'"
          @action="() => handleAddToQueue(friend._id)"
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
        @action="debounceAddToGroup"
      >
        <CreateIcon />
      </PrimaryButton>
      <PrimaryButton
        label="Cancel"
        @action="openAddMember = false"
      >
        <CancelIcon />
      </PrimaryButton>
    </ModalFooter>
  </Modal>
</template>
