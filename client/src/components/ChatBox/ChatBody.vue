<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { state } from '../../state';

const chatBody = ref<HTMLDivElement | null>(null);
function onScrollDown() {
  if (!chatBody.value) return;
  chatBody.value.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'nearest',
  });
}
watch(
  () => state.messages,
  (newData, oldData) => {
    if (newData.length > oldData.length) onScrollDown();
  },
  {
    deep: true,
  },
);

watch(
  () => state.groupMessages,
  (newData, oldData) => {
    if (newData.length > oldData.length) onScrollDown();
  },
  {
    deep: true,
  },
);
onMounted(() => onScrollDown());
</script>

<template>
  <div class="inner-box">
    <div
      ref="chatBody"
      class="chat"
    >
      <slot />
    </div>
  </div>
</template>
