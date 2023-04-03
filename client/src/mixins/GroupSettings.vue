<script setup lang="ts">
import Modal from '../components/Modal/Modal.vue';
import ModalBody from '../components/Modal/ModalBody.vue';
import TextField from '../components/Input/TextField.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import FriendList from '../components/User/FriendList.vue';
</script>

<template>
  <Modal
    open
    title="Group Settings"
  >
    <ModalBody>
      <TextField label="Group title" />
      <PrimaryButton label="Add member">
        <FilledPersonAddIcon />
      </PrimaryButton>
      <FriendList />
    </ModalBody>
  </Modal>
</template>
