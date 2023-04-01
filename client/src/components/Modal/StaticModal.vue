<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import PrimaryButton from '../PrimaryButton.vue';
import SecondaryButton from '../SecondaryButton.vue';

interface IModal {
  title?: string;
  open?: boolean;
  onClose?: () => void | Promise<void>;
}
const { onClose } = defineProps<IModal>();
const modal = ref<HTMLDivElement | null>(null);
const ESCAPE = 'Escape';
function closeOnEsc(e: KeyboardEvent) {
  if (e.key === ESCAPE) {
    e.preventDefault();
    onClose!();
  }
}
onMounted(() => {
  if (!modal.value) return;
  modal.value.focus();
  modal.value.addEventListener('focus', (e: Event) => {
    e.stopPropagation();
  });
  window.addEventListener('keydown', closeOnEsc);
});
onUnmounted(() => {
  if (!modal.value) return;
  modal.value.removeEventListener('focus', (e: Event) => {
    e.stopPropagation();
  });
  window.removeEventListener('keydown', closeOnEsc);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-show="open"
        id="modal"
        ref="modal"
      >
        <span class="modal-header">
          <h3>{title}</h3>
          <SecondaryButton :action="onClose" />
        </span>
        <div class="modal-body">
          <p>{content}</p>
        </div>
        <div class="modal-footer">
          <PrimaryButton
            label="Accept"
            :action="onClose"
          />
          <PrimaryButton
            label="Cancel"
            :action="onClose"
          />
        </div>
      </div>
      <div class="modal-backdrop" />
    </Transition>
  </Teleport>
</template>

<style>
@import url('./style.css');
</style>
