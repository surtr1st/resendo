<script setup lang="ts">
import Avatar from './Avatar.vue';

interface IPageHeader {
  author?: string;
  avatarSrc?: string;
}
defineProps<IPageHeader>();
</script>

<template>
  <div class="page-header">
    <Avatar
      v-if="!avatarSrc"
      no-avatar
    />
    <Avatar
      v-else
      :src="avatarSrc"
      alt="#"
    />
    <h2>{{ author }}</h2>
  </div>
</template>

<style scoped>
@import url('../assets/color.css');

.page-header {
  background: var(--darker-bg);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 10vh;
  padding-left: 0.5rem;
  gap: 1rem;
}

.page-header > h2 {
  border-radius: 10px;
  padding: 0.5rem;
}
</style>
