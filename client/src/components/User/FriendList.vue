<script setup lang="ts">
import PrimaryButton from '../PrimaryButton.vue';
interface IStranger {
  name?: string;
  avatarSrc?: string;
  onAction?: () => void | Promise<void>;
  uid?: string;
  isSelf?: boolean;
  temporaryDisabled?: boolean;
}
defineProps<IStranger>();
</script>

<template>
  <div class="user">
    <h4>{{ name!.length > 12 ? `${name!.slice(0, 12)}...` : name }}</h4>
    <PrimaryButton
      :label="temporaryDisabled ? 'Added' : 'Add'"
      @action="onAction"
    >
    </PrimaryButton>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
