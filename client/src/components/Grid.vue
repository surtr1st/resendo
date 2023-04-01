<template>
  <div class="grid">
    <slot />
  </div>
</template>

<style scoped>
@import url('../assets/color.css');
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  position: relative;
}
</style>
