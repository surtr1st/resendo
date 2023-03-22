<script setup lang="ts">
type NoneLabelProps = {
  name?: string;
};
defineProps<NoneLabelProps>();
</script>

<template>
  <div class="without-label">
    <div
      class="none-label"
      :title="name"
    >
      <h3>{{ name!.slice(0, 1).toUpperCase() }}</h3>
    </div>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
