<script setup lang="ts">
import Avatar from '../components/Avatar.vue';
import Modal from '../components/Modal/Modal.vue';
import ModalBody from '../components/Modal/ModalBody.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import HorizontalSpacing from '../components/Spacing/HorizontalSpacing.vue';
import UserCardDetailIcon from '../components/Icon/UserCardDetailIcon.vue';
import { ref } from 'vue';
import { useAuth, useFriendQueue, useFriend } from '../hooks';
import { FriendRequest } from '../types';
import AcceptIcon from '../components/Icon/AcceptIcon.vue';
import CancelIcon from '../components/Icon/CancelIcon.vue';
import VerticalSpacing from '../components/Spacing/VerticalSpacing.vue';
import { tryOnMounted } from '@vueuse/core';
import { state } from '../state';

const open = ref(false);
const friendRequests = ref<FriendRequest[]>([]);
const { userId, accessToken } = useAuth();
const { updateFriend } = useFriend();
const { getFriendRequestsByUser, acceptRequest, rejectRequest } =
  useFriendQueue();

async function retrieveRequest() {
  try {
    friendRequests.value = await getFriendRequestsByUser(userId, accessToken);
  } catch (e) {
    console.log(e);
  }
}
function accept(id: string, friendId: string) {
  acceptRequest(id, accessToken)
    .then(() => {
      updateFriend({ userId, friendId, accessToken })
        .then(() => {
          retrieveRequest();
          state.isNewFriend = !state.isNewFriend;
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => err);
}
function reject(id: string) {
  rejectRequest(id, accessToken)
    .then(() => retrieveRequest())
    .catch((err) => err);
}

tryOnMounted(() => {
  retrieveRequest();
});
</script>

<template>
  <SecondaryButton
    label="Friend Request"
    @action="open = true"
  >
    <UserCardDetailIcon />
  </SecondaryButton>
  <Modal
    :open="open"
    title="Friend requests"
    @close="open = false"
  >
    <ModalBody>
      <div
        class="card"
        v-if="friendRequests.length > 0"
        v-for="request in friendRequests"
      >
        <div class="card-image">
          <Avatar
            :src="request.user.avatar"
            alt="#"
            :name="request.user.fullname"
            :width="64"
            :height="64"
          />
        </div>
        <VerticalSpacing>
          <h3 v-if="request.user.fullname && request.user.fullname.length > 12">
            {{ `${request.user.fullname.substring(0, 12)}...` }}
          </h3>
          <h3 v-else>
            {{ request.user.fullname }}
          </h3>
          <HorizontalSpacing>
            <PrimaryButton
              label="Accept"
              @action="() => accept(request._id, request.from)"
            >
              <AcceptIcon />
            </PrimaryButton>
            <PrimaryButton
              label="Reject"
              @action="() => reject(request._id)"
            >
              <CancelIcon />
            </PrimaryButton>
          </HorizontalSpacing>
        </VerticalSpacing>
      </div>
    </ModalBody>
  </Modal>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  justify-content: space-evenly;
  gap: 1rem;
  align-items: center;
  border: 1px solid var(--darker-bg);
  border-radius: 0.3rem;
  padding: 0.5rem;
  background-color: transparent;
  transition: 150ms ease-in-out all;
  height: 13vh;
  margin: 0.15rem;
  animation-name: fadedown;
  animation-duration: 150ms;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}

.card:hover {
  cursor: pointer;
  background-color: var(--secondary);
}

.card-image {
  display: grid;
  background: inherit;
}
</style>
