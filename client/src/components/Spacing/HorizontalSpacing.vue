<template>
  <div class="h-space">
    <slot />
  </div>
</template>

<style scoped>
.h-space {
  margin: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  column-gap: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
