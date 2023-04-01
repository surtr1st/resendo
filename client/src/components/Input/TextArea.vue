<script setup lang="ts">
import { ref } from 'vue';

interface ITextArea {
  label?: string;
  name?: string;
  value?: string;
  error?: string;
  onEnter?: () => void;
}
const { onEnter } = defineProps<ITextArea>();
const emit = defineEmits(['update:value']);

const text = ref<HTMLTextAreaElement | null>(null);

function handleInput(e: Event) {
  if (text.value) {
    text.value.style.height = 'auto';
    text.value.style.height = `${
      (e.target as HTMLTextAreaElement).scrollHeight - 16
    }px`;
    emit('update:value', (e.target as HTMLTextAreaElement).value);
  }
}
function handleEnter(event: KeyboardEvent) {
  const ENTER = 'Enter';
  if (event.key === ENTER) {
    event.preventDefault();
    onEnter!();
  }
}
</script>

<template>
  <div className="chat-box">
    <div class="input-label">
      <label
        v-if="label"
        :for="name"
      >
        {{ label }}
      </label>
      <div className="chat-input">
        <textarea
          :id="name"
          ref="text"
          :name="name"
          :value="value"
          :cols="10"
          :rows="1"
          @input="handleInput"
          @keydown="handleEnter"
        />
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
