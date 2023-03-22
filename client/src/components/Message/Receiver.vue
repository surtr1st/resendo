<script setup lang="ts">
type Props = {
  content: string;
};
defineProps<Props>();
</script>

<template>
  <div class="receiver">
    <p>{{ content }}</p>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
