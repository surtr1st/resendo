<script setup lang="ts">
import Avatar from './Avatar.vue';
interface IFriend {
  avatarSrc?: string;
  opponentName?: string;
  latestMessage?: string;
  invisible?: boolean;
  onAction?: () => void;
}
defineProps<IFriend>();
</script>

<template>
  <div
    :class="invisible ? 'invisible' : 'card'"
    @click="onAction"
  >
    <div class="card-image">
      <Avatar
        v-if="avatarSrc"
        :src="avatarSrc"
        alt="#"
      />
      <Avatar
        v-else
        :name="opponentName"
      />
    </div>
    <span class="card-detail">
      <h3
        v-if="opponentName && opponentName.length > 12"
        :style="{ 'font-weight': 'bold' }"
      >
        {{ `${opponentName.substring(0, 12)}...` }}
      </h3>
      <h3
        v-else
        :style="{ 'font-weight': 'bold' }"
      >
        {{ opponentName }}
      </h3>
      <h5
        v-if="latestMessage && latestMessage.length > 20"
        style="
           {
            color: '#6b7280';
          }
        "
      >
        {{ `${latestMessage.slice(0, 20)}...` }}
      </h5>
      <h5
        v-else
        style="
           {
            color: '#6b7280';
          }
        "
      >
        {{ latestMessage }}
      </h5>
    </span>
  </div>
</template>

<style scoped>
@import url('../assets/color.css');
@import url('../assets/animations.css');
.card {
  display: flex;
  justify-content: space-evenly;
  gap: 1rem;
  align-items: center;
  border: 1px solid var(--border-alternative-color);
  border-radius: 0.3rem;
  padding: 0.5rem;
  background-color: transparent;
  transition: 150ms ease-in-out all;
  height: 10vh;
  margin: 0.15rem;
  animation-name: fadedown;
  animation-duration: 150ms;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}

.card:hover {
  cursor: pointer;
  background-color: var(--secondary);
}

.invisible {
  display: flex;
  justify-content: space-evenly;
  visibility: hidden;
  align-items: center;
  height: 9vh;
}

.card-image {
  display: grid;
  background: inherit;
}

.card-detail {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: start;
  gap: 0.2rem;
  background-color: inherit;
  width: 70%;
}

.card-detail > h3 {
  background-color: inherit;
  color: inherit;
}
</style>
