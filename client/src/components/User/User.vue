<script setup lang="ts">
import { ref } from 'vue';
import { useAuth, useFriend } from '../../services';
import SendButton from '../Button/SendButton.vue';

type Props = {
  name?: string;
  avatarSrc?: string;
  addFriend?: () => void | Promise<void>;
  uid?: string;
  isSelf?: boolean;
};
const props = defineProps<Props>();
const isAdded = ref();

const { checkIfAdded } = useFriend();
const { userId } = useAuth();

checkIfAdded(userId, props.uid as string)
  .then((res) => {
    isAdded.value = res;
  })
  .catch((err) => console.log(err));
</script>

<template>
  <div className="user">
    <h4>{{ name!.length > 12 ? `${name?.slice(0, 12)}...` : name }}</h4>
    <SendButton
      v-if="!isSelf && !isAdded"
      label="Add"
      :on-send="addFriend"
    />
    <div
      v-else-if="isSelf"
      class="self-label"
    >
      <h4>Self</h4>
    </div>
    <div
      v-else
      className="added"
    >
      <h4>Added</h4>
    </div>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
