<script setup lang="ts">
import AcceptButton from '../Button/AcceptButton.vue';
import CancelButton from '../Button/CancelButton.vue';
import CloseButton from '../Button/CloseButton.vue';

type Props = {
  title?: string;
  open?: boolean;
  onClose?: () => void | boolean | Promise<void | boolean>;
  content?: string;
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
        class="modal"
        @keydown="closeOnEsc"
      >
        <span class="modal-header">
          <h3>{{ title }}</h3>
          <CloseButton :on-close="onClose" />
        </span>
        <div class="modal-body">
          <p>{{ content }}</p>
        </div>
        <div class="modal-footer">
          <AcceptButton
            label="Accept"
            :on-accept="onClose"
          />
          <CancelButton
            label="Cancel"
            :on-cancel="onClose"
          />
        </div>
      </div>
      <div class="modal-backdrop" />
    </div>
  </Teleport>
</template>

<style scoped>
@import url('./style.css');
</style>
