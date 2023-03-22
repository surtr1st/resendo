<script setup lang="ts">
type LinkProps = {
  label?: string;
  onNavigate?: () => void | boolean | Promise<void | boolean>;
};
defineProps<LinkProps>();
</script>

<template>
  <button
    @click="onNavigate"
    class="close"
  >
    <div class="transparent-content">{{ label }}</div>
  </button>
</template>

<style scoped>
@import url('./style.css');
</style>
