<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import SecondaryButton from '../SecondaryButton.vue';

interface IModal {
  title?: string;
  open?: boolean;
  name?: string;
  onClose?: () => void | Promise<void>;
  nested?: boolean;
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
    <Transition name="md-fade">
      <div
        v-if="open"
        :id="name"
      >
        <div
          :id="!nested ? 'modal' : 'nested-modal'"
          ref="modal"
        >
          <span class="modal-header">
            <h3>{{ title }}</h3>
            <SecondaryButton
              no-content
              @action="onClose"
            />
          </span>
          <slot />
        </div>
      </div>
    </Transition>
    <div
      v-if="open"
      :class="!nested ? 'modal-backdrop' : 'nested-modal-backdrop'"
      @click="onClose"
    />
  </Teleport>
</template>

<style>
@import url('./style.css');
</style>
