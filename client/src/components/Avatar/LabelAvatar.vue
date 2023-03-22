<script setup lang="ts">
type LabelProps = {
  src?: string;
  alt?: string;
};
defineProps<LabelProps>();
</script>

<template>
  <div class="with-label">
    <img
      :src="src"
      :alt="alt"
    />
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
