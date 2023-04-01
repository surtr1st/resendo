<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { ScrollState } from '../../helpers';

const chatBody = ref<HTMLDivElement | null>(null);
function onScrollDown() {
  if (!chatBody.value) return;
  chatBody.value.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'nearest',
  });
}
onMounted(() => onScrollDown());
watch(
  () => ScrollState.trigger,
  () => {
    onScrollDown();
  },
);
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
