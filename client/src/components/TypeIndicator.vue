<script setup lang="ts">
import { computed } from 'vue';

type UserTyping = {
  [key: string]: {
    fullname: string;
    isTyping: boolean;
  };
};
interface IIndicator {
  isTyping?: boolean;
  who?: string;
  users?: UserTyping;
}
const { users } = defineProps<IIndicator>();

const computedIsTyping = computed((): number => {
  const typings = [];
  for (const key in users) if (users[key].isTyping) typings.push(users[key]);
  return typings.length;
});
</script>

<template>
  <Transition name="slide-fade">
    <template v-if="users">
      <h4
        class="group-indicator"
        v-show="computedIsTyping > 0"
      >
        <span
          ref="span"
          v-for="user in users"
          :key="user.fullname"
          v-show="user.isTyping"
        >
          {{ `${user.fullname}` }}
        </span>
        <span>
          {{ computedIsTyping > 1 ? 'are typing...' : 'is typing...' }}
        </span>
      </h4>
    </template>
    <template v-else>
      <h4
        v-show="isTyping"
        class="indicator"
      >
        {{ who }} is typing...
      </h4>
    </template>
  </Transition>
</template>

<style scoped>
@import url('../assets/animations.css');

.indicator {
  position: absolute;
  top: -32%;
  left: 0.3%;
  background: #1e1e1e;
  z-index: 1;
  border-radius: 7px;
  padding: 0.5rem;
  font-style: italic;
  font-weight: bold;
}

.group-indicator {
  position: absolute;
  top: -32%;
  left: 0.3%;
  z-index: 1;
  border-radius: 7px;
  padding: 0.5rem;
  font-style: italic;
  font-weight: bold;
}

.group-indicator > * {
  background: #1e1e1e;
  font-weight: bold;
}

.slide-fade-enter-active {
  animation: slide-fade-up 250ms cubic-bezier(0.62, -0.01, 0.09, 0.96);
}
.slide-fade-leave-active {
  animation: slide-fade-down 150ms cubic-bezier(1, 0.01, 0.26, 0.82);
}
</style>
