<script setup lang="ts">
import ClearButton from '../Button/ClearButton.vue';
import { ref } from 'vue';

type Props = {
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

const search = ref<HTMLInputElement | null>(null);

function handleEnter(event: KeyboardEvent) {
  const ENTER = 'Enter';
  if (event.key === ENTER) {
    event.preventDefault();
    if (props.onEnter) props.onEnter();
  }
}
</script>

<template>
  <div className="chat-box-input">
    <div class="input-label">
      <label
        v-show="label"
        :for="name"
      >
        {{ label }}</label
      >
    </div>

    <div className="chat-input">
      <input
        :id="name"
        :name="name"
        :value="inputValue"
        ref="search"
        class="text"
        type="text"
        @change="onChange"
        @keydown="handleEnter"
        @input="
          $emit('update:inputValue', ($event.target as HTMLInputElement).value)
        "
      />
      <slot />
      <ClearButton
        v-show="clearable"
        :on-clear="onClear"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m18.9 20.3l-5.6-5.6q-.75.6-1.725.95Q10.6 16 9.5 16q-2.725 0-4.612-1.887Q3 12.225 3 9.5q0-2.725 1.888-4.613Q6.775 3 9.5 3t4.613 1.887Q16 6.775 16 9.5q0 1.1-.35 2.075q-.35.975-.95 1.725l5.625 5.625q.275.275.275.675t-.3.7q-.275.275-.7.275q-.425 0-.7-.275ZM9.5 14q1.875 0 3.188-1.312Q14 11.375 14 9.5q0-1.875-1.312-3.188Q11.375 5 9.5 5Q7.625 5 6.312 6.312Q5 7.625 5 9.5q0 1.875 1.312 3.188Q7.625 14 9.5 14Z"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
