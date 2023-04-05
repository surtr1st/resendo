<script setup lang="ts">
interface IEmpty {
  content?: string;
}
defineProps<IEmpty>();
</script>

<template>
  <div class="empty">
    <h3>{{ content }}</h3>
  </div>
</template>

<style scoped>
.empty {
  height: 100vh;
  display: grid;
  place-items: center;
  background: transparent;
}

.empty > h3 {
  background: inherit;
  font-weight: bold;
}
</style>
