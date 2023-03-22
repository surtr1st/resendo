<script setup lang="ts">
import ClearButton from '../Button/ClearButton.vue';
import { ref } from 'vue';

type Props = {
  type?: 'text' | 'password' | 'email';
  label?: string;
  name?: string;
  inputValue?: string;
  clearable?: boolean;
  onEnter?: () => void;
  onKeyDown?: () => void;
  onKeyUp?: () => void;
  onChange?: (e: Event) => void;
  onClear?: () => void;
};
const props = defineProps<Props>();
defineEmits(['update:inputValue']);

const input = ref<HTMLInputElement | null>(null);
function handleEnter(event: KeyboardEvent) {
  const ENTER = 'Enter';
  if (event.key === ENTER) {
    event.preventDefault();
    if (props.onEnter) props.onEnter();
  }
}
</script>

<template>
  <div class="chat-box-input">
    <div class="input-label">
      <label
        v-show="label"
        :for="name"
      >
        {{ label }}</label
      >
    </div>
    <div class="chat-input">
      <input
        :type="type"
        :id="name"
        :name="name"
        :value="inputValue"
        @input="
          $emit('update:inputValue', ($event.target as HTMLInputElement).value)
        "
        ref="input"
        class="text"
        @change="onChange"
        @keydown="handleEnter"
      />
      <slot />
      <ClearButton
        v-show="clearable"
        :on-clear="() => onClear!()"
      />
    </div>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
