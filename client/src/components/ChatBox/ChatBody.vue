<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { triggerScrollDown } from '../../helpers';

const chatBody = ref<HTMLDivElement | null>(null);
function onScrollDown() {
  chatBody.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'nearest',
  });
}
watch(triggerScrollDown, () => {
  onScrollDown();
});
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
