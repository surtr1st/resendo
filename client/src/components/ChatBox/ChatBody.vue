<script setup lang="ts">
import { tryOnMounted } from '@vueuse/core';
import { ref, watch } from 'vue';
import { state } from '../../state';

const chatBody = ref<HTMLDivElement | null>(null);
function onScrollDown() {
  setTimeout(() => {
    if (chatBody.value)
      chatBody.value.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
  }, 0);
}
watch(
  () => state.messages,
  () => onScrollDown(),
  { deep: true },
);
watch(
  () => state.groupMessages,
  () => onScrollDown(),
  { deep: true },
);
tryOnMounted(() => {
  onScrollDown();
});
</script>

<template>
  <div class="inner-box">
    <div
      id="chatBody"
      ref="chatBody"
      class="chat"
    >
      <slot />
      <div id="hidden-element" />
    </div>
  </div>
</template>
