<script setup lang="ts">
interface IChatBox {
  type?: 'container' | 'fluid';
}
defineProps<IChatBox>();
</script>

<template>
  <div
    v-if="type === 'container'"
    class="container"
  >
    <slot />
  </div>
  <div
    v-else
    class="fluid"
  >
    <slot />
  </div>
</template>

<style>
@import url('./style.css');
</style>
