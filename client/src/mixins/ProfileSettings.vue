<script setup lang="ts">
import Avatar from '../components/Avatar.vue';
import UserGearIcon from '../components/Icon/UserGearIcon.vue';
import TextField from '../components/Input/TextField.vue';
import Modal from '../components/Modal/Modal.vue';
import ModalBody from '../components/Modal/ModalBody.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import HorizontalSpacing from '../components/Spacing/HorizontalSpacing.vue';
import VerticalSpacing from '../components/Spacing/VerticalSpacing.vue';
import EditIcon from '../components/Icon/EditIcon.vue';
import TipsAndUpdateIcon from '../components/Icon/TipsAndUpdateIcon.vue';
import File from '../components/Input/File.vue';
import { ref } from 'vue';
import { useAuth, useUser } from '../hooks';
import { InsensitiveResponseUserInfo } from '../types';
import { tryOnMounted, tryOnUnmounted, useDebounceFn } from '@vueuse/core';
import { DEBOUNCE_DURATION } from '../helpers';

const open = ref(false);
const user = ref<InsensitiveResponseUserInfo>();
const profileName = ref('');
const editable = ref(false);
const { userId, accessToken } = useAuth();
const { getUserById, updateAvatar, updateProfileName } = useUser();

async function retrieveUser() {
  try {
    user.value = await getUserById(userId);
  } catch (e) {
    console.log(e);
  }
}

function updateName() {
  updateProfileName(userId, profileName.value, accessToken)
    .then(async () => {
      await retrieveUser();
      editable.value = false;
    })
    .catch((err) => console.log(err));
}
function handleUploadFiles(files: FileList | null) {
  if (files)
    updateAvatar(userId, files[0], accessToken)
      .then(async () => await retrieveUser())
      .catch((err) => console.log(err));
}
const debounceUploadFile = useDebounceFn(handleUploadFiles, DEBOUNCE_DURATION);

tryOnMounted(() => {
  retrieveUser();
});

tryOnUnmounted(() => {
  editable.value = false;
});
</script>

<template>
  <SecondaryButton
    label="Profile"
    @action="open = true"
  >
    <UserGearIcon />
  </SecondaryButton>
  <Modal
    :open="open"
    title="Profile settings"
    @close="open = false"
  >
    <ModalBody>
      <HorizontalSpacing>
        <Avatar
          :src="user?.avatar"
          alt="#"
          :name="user?.fullname"
          :width="64"
          :height="64"
        />
        <File
          name="avatar-uploader"
          @upload="debounceUploadFile"
        />
      </HorizontalSpacing>
      <VerticalSpacing grid>
        <TextField
          v-if="!editable"
          label="Username"
          :value="user?.fullname"
          readonly
        />
        <TextField
          v-else
          label="Username"
          v-model:value="profileName"
          :placeholder="user?.fullname"
        />
        <PrimaryButton
          v-if="!editable"
          label="Edit"
          @action="editable = true"
        >
          <EditIcon />
        </PrimaryButton>
        <PrimaryButton
          v-else
          label="Update"
          @action="updateName"
        >
          <TipsAndUpdateIcon />
        </PrimaryButton>
      </VerticalSpacing>
    </ModalBody>
  </Modal>
</template>
