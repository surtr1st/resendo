<script setup lang="ts">
import { onMounted, onUnmounted, ref, Transition } from 'vue';
import CloseButton from '../Button/CloseButton.vue';

type Props = {
  title?: string;
  open?: boolean;
  onClose?: () => void | boolean | Promise<void | boolean>;
};
const props = defineProps<Props>();

function closeOnEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault();
    if (props.onClose) props.onClose();
  }
}
onMounted(() => window.addEventListener('keydown', closeOnEsc));
onUnmounted(() => window.removeEventListener('keydown', closeOnEsc));
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-show="open">
        <div class="modal">
          <span class="modal-header">
            <h3>{{ title }}</h3>
            <CloseButton :on-close="onClose" />
          </span>
          <slot />
        </div>
        <div class="modal-backdrop" />
      </div>
    </Transition>
  </Teleport>
</template>

<style>
@import url('./style.css');
</style>
