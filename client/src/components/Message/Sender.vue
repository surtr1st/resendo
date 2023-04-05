<script setup lang="ts">
import { ref } from 'vue';
import ImageViewer from '../ImageViewer.vue';

interface ISender {
  author?: string;
  content?: string;
  mediaSrc?: string;
}
defineProps<ISender>();

const viewMedia = ref(false);
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
        :src="mediaSrc"
        loading="lazy"
        @click="viewMedia = true"
      />
      <ImageViewer
        :src="mediaSrc"
        :view="viewMedia"
        @close="viewMedia = false"
      />
    </div>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
