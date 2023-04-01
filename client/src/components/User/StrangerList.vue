<script setup lang="ts">
import PrimaryButton from '../PrimaryButton.vue';
import SecondaryButton from '../SecondaryButton.vue';
import { ref } from 'vue';
import { useAuth, useFriend } from '../../hooks';

interface IStranger {
  name?: string;
  avatarSrc?: string;
  onAction?: () => void | Promise<void>;
  uid?: string;
  isSelf?: boolean;
  temporaryDisabled?: boolean;
}
const { uid } = defineProps<IStranger>();

const isAdded = ref(false);
const { checkIfAdded: isFriendAdded } = useFriend();
const { userId } = useAuth();

isFriendAdded(userId, uid as string)
  .then((res) => (isAdded.value = res))
  .catch((err) => console.log(err));
</script>

<template>
  <div class="user">
    <h4>{{ name!.length > 12 ? `${name!.slice(0, 12)}...` : name }}</h4>
    <PrimaryButton
      v-if="!isSelf && !isAdded"
      label="Add"
      @action="onAction"
    >
    </PrimaryButton>
    <div
      v-else-if="!isSelf && isAdded"
      class="self-label"
    >
      <h4>Added</h4>
    </div>
    <div
      v-if="isSelf"
      class="self-label"
    >
      <h4>Self</h4>
    </div>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
