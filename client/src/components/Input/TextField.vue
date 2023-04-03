<script setup lang="ts">
import SecondaryButton from '../SecondaryButton.vue';

interface IInput {
  label?: string;
  name?: string;
  value?: string;
  clearable?: boolean;
  error?: string;
  readonly?: boolean;
  onEnter?: () => void;
  onClear?: () => void;
}
const { onEnter } = defineProps<IInput>();
defineEmits(['update:value']);

function handleEnter(event: KeyboardEvent) {
  const ENTER = 'Enter';
  if (event.key === ENTER) {
    event.preventDefault();
    onEnter!();
  }
}
</script>

<template>
  <div class="chat-box-input">
    <div class="input-label">
      <label
        v-if="label"
        :for="name"
      >
        {{ label }}
      </label>
    </div>
    <div class="chat-input">
      <input
        :id="name"
        ref="ref"
        :name="name"
        :value="value"
        @input="
          $emit('update:value', ($event.target as HTMLInputElement).value)
        "
        @keydown="handleEnter"
        class="text"
        :readonly="readonly"
      />
      <slot />
      <SecondaryButton
        v-show="clearable"
        :action="onClear"
      />
    </div>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
