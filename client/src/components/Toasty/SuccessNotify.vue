<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface INotify {
  message?: string;
  duration?: number;
  onReset?: () => void;
}
const { duration, onReset } = defineProps<INotify>();

const notify = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!notify.value) return;
  notify.value.classList.add('show', 'success');
  setTimeout(() => {
    if (notify.value) {
      notify.value.classList.remove('show', 'success');
      notify.value.classList.add('hidden', 'success');
    }
    setTimeout(() => {
      if (onReset) onReset();
    }, 250);
  }, duration);
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

<style scoped>
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
.success {
  background: #03fc9d;
  border: 3px solid #00ab69;
  color: #00452a;
}
.success > .content > h3 {
  background: #03fc9d;
  color: #00452a;
}
</style>
