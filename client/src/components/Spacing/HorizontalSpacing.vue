<script setup lang="ts">
interface ISpacing {
  floated?: boolean;
}
defineProps<ISpacing>();
</script>

<template>
  <div
    v-if="!floated"
    class="h-space"
  >
    <slot />
  </div>
  <div
    v-else
    class="h-space floated"
  >
    <slot />
  </div>
</template>

<style scoped>
@import url('../../assets/color.css');
.h-space {
  margin: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.floated {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  background: var(--darker-bg);
  width: 96%;
  height: 8vh;
  border-radius: 10px;
}
</style>
