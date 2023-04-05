<script setup lang="ts">
import Avatar from '../Avatar.vue';
import { ref } from 'vue';

interface IReceiver {
  author?: string;
  content?: string;
  mediaSrc?: string;
  authorAvatarSrc?: string;
}
defineProps<IReceiver>();

const viewMedia = ref(false);
</script>

<template>
  <div class="author-avatar">
    <Avatar
      v-if="authorAvatarSrc"
      :src="authorAvatarSrc"
    />
    <Avatar
      v-else
      no-avatar
      :name="author"
    />
    <div class="receiver">
      <h5
        v-if="author"
        class="receiver-label"
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
          :src="mediaSrc"
        />
        <ImageViewer
          :src="mediaSrc"
          :view="viewMedia"
          @close="viewMedia = false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
