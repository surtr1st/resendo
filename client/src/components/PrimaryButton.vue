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
  <div
    v-if="disabled"
    class="disabled-label"
  >
    <slot />
    <h4>{{ label }}</h4>
  </div>
  <button
    v-else
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
  gap: 0.35rem;
  background: inherit;
}
.primary-btn-transparent {
  background: transparent;
}

.primary-btn-transparent:hover {
  background: var(--secondary);
}
.disabled-label {
  height: 2.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  border-radius: 0.3rem;
  border: 0px;
  transition: 250ms ease-in-out all;
  background: var(--darker-bg);
  color: black;
  display: grid;
  place-items: center;
}
.disabled-label > * {
  background: inherit;
}
</style>
