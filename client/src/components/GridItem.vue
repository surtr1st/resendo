<script setup lang="ts">
interface IGridItem {
  col?:
    | 'col-1'
    | 'col-2'
    | 'col-3'
    | 'col-4'
    | 'col-5'
    | 'col-6'
    | 'col-7'
    | 'col-8'
    | 'col-9'
    | 'col-10'
    | 'col-11'
    | 'col-12';
  type: 'side' | 'article';
}
defineProps<IGridItem>();
</script>

<template>
  <div :class="type">
    <slot />
  </div>
</template>

<style scoped>
.side {
  grid-area: 1 / 1 / 2 / 3;
}
.article {
  grid-area: 1 / 3 / 2 / 13;
  background: var(--darker-bg);
}
</style>
