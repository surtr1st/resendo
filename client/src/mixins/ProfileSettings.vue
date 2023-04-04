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
import File from '../components/Input/File.vue';
import { onMounted, ref } from 'vue';
import { useAuth, useUser } from '../hooks';
import { InsensitiveResponseUserInfo } from '../types';
import { useDebounceFn } from '@vueuse/core';
import { DEBOUNCE_DURATION } from '../helpers';

const open = ref(false);
const user = ref<InsensitiveResponseUserInfo>();
const { userId, accessToken } = useAuth();
const { getUserById, updateAvatar } = useUser();

async function retrieveUser() {
  try {
    user.value = await getUserById(userId);
  } catch (e) {
    console.log(e);
  }
}
function handleUploadFiles(files: FileList | null) {
  if (files)
    updateAvatar(userId, files[0], accessToken)
      .then(async () => await retrieveUser())
      .catch((err) => console.log(err));
}
const debounceUploadFile = useDebounceFn(handleUploadFiles, DEBOUNCE_DURATION);

onMounted(() => {
  retrieveUser();
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
          label="Username"
          :value="user?.fullname"
          readonly
        />
        <PrimaryButton label="Edit">
          <EditIcon />
        </PrimaryButton>
      </VerticalSpacing>
    </ModalBody>
  </Modal>
</template>
