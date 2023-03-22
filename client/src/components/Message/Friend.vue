<script setup lang="ts">
type CardProps = {
  avatarSrc?: string;
  opponentName?: string;
  latestMessage?: string;
  onAction?: () => void;
};
defineProps<CardProps>();
</script>

<template>
  <div
    class="card"
    @click="onAction"
  >
    <div class="card-image">
      <img
        :src="avatarSrc"
        alt="#"
      />
    </div>
    <span className="card-detail">
      <h3>
        {{
          opponentName!.length > 12
            ? `${opponentName!.substring(0, 12)}...`
            : opponentName
        }}
      </h3>
      <h5>
        {{
          latestMessage!.length > 10
            ? `${latestMessage!.slice(0, 10)}...`
            : latestMessage
        }}
      </h5>
    </span>
  </div>
</template>
;

<style scoped>
@import url('./style.css');
</style>
