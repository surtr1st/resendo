<script setup lang="ts">
interface IInput {
  label?: string;
  name?: string;
  value?: string;
  error?: string;
  onEnter?: () => void;
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
        type="password"
        :name="name"
        :value="value"
        @input="
          $emit('update:value', ($event.target as HTMLInputElement).value)
        "
        @keydown="handleEnter"
        class="text"
      />
      <slot />
    </div>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
