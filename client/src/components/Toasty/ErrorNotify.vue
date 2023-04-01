<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface INotify {
  message?: string;
  duration?: number;
  onReset?: () => void;
}
const { duration, onReset } = defineProps<INotify>();

const notify = ref<HTMLDivElement | null>(null);

setTimeout(() => {
  if (notify.value) {
    notify.value.classList.remove('show', 'error');
    notify.value.classList.add('hidden', 'error');
  }
  setTimeout(() => {
    if (onReset) onReset();
  }, 250);
}, duration);

onMounted(() => {
  if (!notify.value) return;
  notify.value.classList.add('show', 'error');
});
</script>

<template>
  <div
    id="notify"
    ref="notify"
  >
    <span class="content">
      <h3>{{ message }}</h3>
    </span>
  </div>
</template>

<style>
@import url('../../assets/animations.css');

#notify {
  position: fixed;
  visibility: hidden;
  top: 25px;
  left: 50%;
  margin-left: -125px;
  min-width: 250px;
  padding: 0.7rem;
  border-radius: 7px;
  font-size: 12px;
  z-index: 10000;
}
#notify.show {
  visibility: visible;
  animation: slide-fade-down;
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.62, -0.01, 0.09, 0.96);
  animation-fill-mode: forwards;
}
#notify.hidden {
  visibility: visible;
  animation: slide-fade-up;
  animation-duration: 200ms;
  animation-timing-function: cubic-bezier(1, 0.01, 0.26, 0.82);
  animation-fill-mode: forwards;
}
.error {
  background: #ff5765;
  border: 3px solid #420006;
}
.error > .content > h3 {
  background: #ff5765;
  color: #571c21;
}
</style>
