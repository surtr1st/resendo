<script setup lang="ts">
interface ISecondary {
  label?: string;
  disabled?: boolean;
  onAction?: () => void | Promise<void>;
  noContent?: boolean;
}
defineProps<ISecondary>();
</script>

<template>
  <button
    @click="onAction"
    class="secondary-btn"
  >
    <div
      v-if="noContent"
      class="content"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
        />
      </svg>
    </div>
    <div
      v-else
      class="transparent-content"
    >
      {{ label }}
    </div>
  </button>
</template>

<style scoped>
@import url('../assets/color.css');
.secondary-btn {
  background: transparent;
}

.secondary-btn:hover {
  background: var(--secondary);
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.15rem;
  background: inherit;
}
.transparent-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.15rem;
  background: transparent;
}
</style>
