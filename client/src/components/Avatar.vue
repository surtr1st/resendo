<script setup lang="ts">
interface IAvatar {
  src?: string;
  alt?: string;
  name?: string;
}
defineProps<IAvatar>();
const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
</script>

<template>
  <div
    v-if="!src"
    class="without-label"
  >
    <div
      class="none-label"
      :title="name"
      :style="{ background: randomColor }"
    >
      <h3>{{ name && name.slice(0, 1).toUpperCase() }}</h3>
    </div>
  </div>
  <div
    v-else
    class="with-label"
  >
    <img
      :src="src"
      :alt="alt"
    />
  </div>
</template>

<style scoped>
.with-label {
  border: 0px;
  background: inherit;
}

.with-label > img {
  border-radius: 100%;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid black;
}

.without-label {
  border: 0px;
  background: inherit;
}

.none-label {
  border-radius: 100%;
  display: grid;
  place-items: center;
  font-weight: bolder;
  width: 48px;
  height: 48px;
  border: 1px solid black;
}

.none-label > h3 {
  color: black;
  background: inherit;
}
</style>
