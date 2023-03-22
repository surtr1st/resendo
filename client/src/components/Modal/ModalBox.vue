<script setup lang="ts">
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
</script>

<template>
  <Teleport to="body">
    <div v-show="open">
      <div
        ref="modal"
        class="modal"
      >
        <span class="modal-header">
          <h3>{{ title }}</h3>
          <CloseButton :on-close="onClose" />
        </span>
        <slot />
      </div>
      <div class="modal-backdrop" />
    </div>
  </Teleport>
</template>

<style>
@import url('./style.css');
</style>
