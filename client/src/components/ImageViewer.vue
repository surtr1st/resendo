<script setup lang="ts">
import SecondaryButton from './SecondaryButton.vue';

interface IViewer {
  src?: string;
  view?: boolean;
  onClose?: () => void;
}
defineProps<IViewer>();
</script>

<template>
  <Transition name="iv-fade">
    <div
      v-if="view"
      class="image-viewer"
      @click="onClose"
    >
      <div class="section-1">
        <SecondaryButton
          no-content
          @action="onClose"
        />
      </div>
      <div class="section-2">
        <img
          :src="src"
          loading="lazy"
          alt="#"
        />
        <div class="image-viewer-backdrop" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@import url('../assets/animations.css');
.image-viewer {
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  background: transparent;
}

.section-1 {
  display: flex;
  justify-content: flex-end;
  background: inherit;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
}
.section-2 {
  width: 100%;
  height: 100%;
  background: inherit;
  display: grid;
  place-items: center;
}
.section-2 > img {
  z-index: 100;
}

.image-viewer-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.iv-fade-enter-active {
  animation: fadein 120ms;
  animation-fill-mode: forwards;
}

.iv-fade-leave-active {
  animation: fadeout 120ms;
  animation-fill-mode: forwards;
}
</style>
