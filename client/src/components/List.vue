<template>
  <ul>
    <slot />
  </ul>
</template>

<style scoped>
@import url('../assets/color.css');

ul {
  display: block;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: center;
  list-style: none;
  padding-top: 0.1rem;
  position: relative;
}
</style>
