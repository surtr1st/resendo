<script setup lang="ts">
interface IInput {
  label?: string;
  name?: string;
  clearable?: boolean;
  error?: string;
}
defineProps<IInput>();
defineEmits(['upload']);
</script>

<template>
  <div class="chat-box-input">
    <label
      class="file-label"
      :for="name"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m12 12.586l4.243 4.242l-1.415 1.415L13 16.415V22h-2v-5.587l-1.828 1.83l-1.415-1.415L12 12.586zM12 2a7.001 7.001 0 0 1 6.954 6.194a5.5 5.5 0 0 1-.953 10.784L18 17a6 6 0 0 0-11.996-.225L6 17v1.978a5.5 5.5 0 0 1-.954-10.784A7 7 0 0 1 12 2z"
        />
      </svg>
      {{ label }}
    </label>
    <input
      type="file"
      :id="name"
      :name="name"
      class="text"
      @change="$emit('upload', ($event.target as HTMLInputElement).files)"
    />
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
