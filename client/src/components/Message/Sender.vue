<script setup lang="ts">
interface ISender {
  author?: string;
  content?: string;
  mediaSrc?: string;
}
defineProps<ISender>();
</script>

<template>
  <div class="sender">
    <h5
      v-if="author"
      class="sender-label"
    >
      {{ author }}
    </h5>
    <p v-if="content">{{ content }}</p>
    <div
      v-if="mediaSrc"
      class="img-container"
    >
      <img
        loading="lazy"
        :src="`${mediaSrc}.png`"
      />
    </div>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
