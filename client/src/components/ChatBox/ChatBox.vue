<script setup lang="ts">
type Props = {
  type?: 'container' | 'fluid';
  triggerScrollDown?: boolean;
};
defineProps<Props>();
</script>

<template>
  <div
    v-if="type === 'container'"
    class="container"
  >
    <slot />
  </div>
  <div
    v-else
    class="container"
  >
    <slot />
  </div>
</template>

<style>
@import url('./style.css');
</style>
