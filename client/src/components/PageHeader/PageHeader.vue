<script setup lang="ts">
import LabelAvatar from '../Avatar/LabelAvatar.vue';
import NoneLabelAvatar from '../Avatar/NoneLabelAvatar.vue';

type Props = {
  author?: string;
  avatarSrc?: string;
};
defineProps<Props>();
</script>

<template>
  <div class="page-header">
    <LabelAvatar
      v-if="avatarSrc"
      :src="avatarSrc"
      :alt="avatarSrc"
    />
    <NoneLabelAvatar
      v-else
      name="T"
    />
    <h2>{{ author }}</h2>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
