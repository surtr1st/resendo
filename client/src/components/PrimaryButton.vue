<script setup lang="ts">
interface IButton {
  label?: string;
  disabled?: boolean;
  onAction?: () => void | Promise<void>;
}
interface IPrimary extends IButton {
  transparent?: boolean;
}
defineProps<IPrimary>();
</script>

<template>
  <button
    :disabled="disabled"
    :class="transparent ? 'primary-btn-transparent' : 'primary-btn'"
    @click="onAction"
  >
    <div class="content">
      <slot />
      {{ label }}
    </div>
  </button>
</template>

<style scoped>
@import url('../assets/color.css');
.primary-btn {
  background: var(--primary);
}
.primary-btn:hover {
  background: var(--primary-hover);
}
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.15rem;
  background: inherit;
}
.primary-btn-transparent {
  background: transparent;
}

.primary-btn-transparent:hover {
  background: var(--secondary);
}
</style>
