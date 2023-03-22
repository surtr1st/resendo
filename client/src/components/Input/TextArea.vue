<script setup lang="ts">
import { ref } from 'vue';
type TextAreaProps = {
  label?: string;
  name?: string;
  content?: string;
  onEnter?: () => void;
  onKeyDown?: () => void;
  onKeyUp?: () => void;
  onChange?: (e: Event) => void;
};
const props = defineProps<TextAreaProps>();
const emits = defineEmits(['update:content']);

const text = ref<HTMLTextAreaElement | null>(null);

function handleInput(e: Event) {
  const scrollHeight = (e.target as HTMLTextAreaElement).scrollHeight;
  if (text.value) {
    text.value!.style.height = 'auto';
    text.value!.style.height = `${scrollHeight - 16}px`;
  }
  emits('update:content', text.value?.value);
}
function handleEnter(event: KeyboardEvent) {
  const ENTER = 'Enter';
  if (props.onKeyDown) props.onKeyDown();
  if (event.key === ENTER) {
    event.preventDefault();
    if (props.onEnter) props.onEnter();
  }
}
</script>

<template>
  <div class="chat-box">
    <div class="input-label">
      <label
        v-show="label"
        :for="name"
      >
        {{ label }}</label
      >
    </div>
    <div class="chat-input">
      <textarea
        :id="name"
        :name="name"
        :value="content"
        cols="10"
        rows="1"
        ref="text"
        @change="onChange"
        @input="handleInput"
        @keydown="handleEnter"
        @keyup="onKeyUp"
      ></textarea>
      <slot />
    </div>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
