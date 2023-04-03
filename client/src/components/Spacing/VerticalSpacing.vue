<script setup lang="ts">
interface ISpacing {
  floated?: boolean;
  grid?: boolean;
}
defineProps<ISpacing>();
</script>

<template>
  <div
    v-if="!floated && !grid"
    class="v-space"
  >
    <slot />
  </div>
  <div
    v-else-if="floated"
    class="v-space floated"
  >
    <slot />
  </div>
  <div
    v-else-if="grid"
    class="v-grid-space"
  >
    <slot />
  </div>
</template>

<style scoped>
@import url('../../assets/color.css');
.v-space {
  margin: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 0.5rem;
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
.v-grid-space {
  display: grid;
  margin: 0.3rem;
  row-gap: 0.5rem;
}
</style>
