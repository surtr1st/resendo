<script setup lang="ts">
import PrimaryButton from '../PrimaryButton.vue';
import { onMounted, ref } from 'vue';
import { useAuth, useFriend, useFriendQueue } from '../../hooks';
import FilledPersonAddIcon from '../Icon/FilledPersonAddIcon.vue';

interface IStranger {
  name?: string;
  avatarSrc?: string;
  onAction?: () => void | Promise<void>;
  uid?: string;
  isSelf?: boolean;
  temporaryDisabled?: boolean;
  temporaryLabel?: string;
}
const { uid } = defineProps<IStranger>();

const isAdded = ref(false);
const isRequestSent = ref(false);
const { checkIfAdded: isFriendAdded } = useFriend();
const { userId } = useAuth();
const { checkIfRequestSent } = useFriendQueue();

onMounted(() => {
  checkIfRequestSent(userId, uid as string)
    .then((res) => (isRequestSent.value = res))
    .catch((err) => console.log(err));
  isFriendAdded(userId, uid as string)
    .then((res) => (isAdded.value = res))
    .catch((err) => console.log(err));
});
</script>

<template>
  <div class="user">
    <h4>{{ name!.length > 12 ? `${name!.slice(0, 12)}...` : name }}</h4>
    <div
      v-if="temporaryLabel"
      class="self-label"
    >
      <h4>{{ temporaryLabel }}</h4>
    </div>
    <template v-else>
      <div
        v-if="!isSelf && !isAdded && isRequestSent"
        class="self-label"
      >
        <h4>Sent Request</h4>
      </div>
      <div
        v-else-if="!isSelf && isAdded && isRequestSent"
        class="self-label"
      >
        <h4>Added</h4>
      </div>
      <PrimaryButton
        v-else-if="!isSelf && !isAdded && !isRequestSent"
        label="Add friend"
        @action="onAction"
      >
        <FilledPersonAddIcon />
      </PrimaryButton>
      <div
        v-if="isSelf"
        class="self-label"
      >
        <h4>Self</h4>
      </div>
    </template>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
