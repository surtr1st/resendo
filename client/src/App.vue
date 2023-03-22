<script setup lang="ts">
import Chat from './views/Chat/Chat.vue';
import LoginOrRegistrate from './views/LoginOrRegistrate/LoginOrRegistrate.vue';
import { useAuth } from './services';
const { isAuth } = useAuth();
</script>

<template>
  <LoginOrRegistrate v-if="!isAuth" />
  <Chat v-else />
</template>
