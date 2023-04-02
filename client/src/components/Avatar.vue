<script setup lang="ts">
interface IAvatar {
  src?: string;
  alt?: string;
  name?: string;
  status?: boolean;
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
      <div
        v-if="status"
        class="online-label"
      />
      <div
        v-else
        class="offline-label"
      />
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
    <div
      v-if="status"
      class="online-label"
    />
    <div
      v-else
      class="offline-label"
    />
  </div>
</template>

<style scoped>
.with-label {
  position: relative;
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
  position: relative;
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

.offline-label {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 100%;
  background: transparent;
  width: 10px;
  height: 10px;
}

.online-label {
  position: absolute;
  bottom: 5%;
  right: 5%;
  border-radius: 100%;
  border: 1px solid black;
  background: #10b981;
  width: 10px;
  height: 10px;
}
</style>
