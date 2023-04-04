<script setup lang="ts">
import PrimaryButton from '../PrimaryButton.vue';
interface IStranger {
  name?: string;
  avatarSrc?: string;
  onAction?: () => void | Promise<void>;
  uid?: string;
  isSelf?: boolean;
  label?: string;
  disabled?: boolean;
}
defineProps<IStranger>();
</script>

<template>
  <div class="user">
    <h4>{{ name!.length > 12 ? `${name!.slice(0, 12)}...` : name }}</h4>
    <PrimaryButton
      :label="label"
      @action="onAction"
      :disabled="disabled"
    />
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
