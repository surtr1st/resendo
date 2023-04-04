<script setup lang="ts">
import SecondaryButton from './SecondaryButton.vue';
import { onMounted, ref } from 'vue';

interface IDrawer {
  open?: boolean;
  onClose?: () => void;
}
defineProps<IDrawer>();
const drawer = ref<HTMLDivElement | null>(null);
onMounted(() => {
  if (drawer.value) {
    drawer.value.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }
});
</script>

<template>
  <Transition name="t-drawer">
    <div
      v-show="open"
      class="drawer-container"
      @click="onClose"
    >
      <div
        id="drawer"
        ref="drawer"
      >
        <span class="drawer-header">
          <SecondaryButton
            no-content
            @action="onClose"
          />
        </span>
        <div class="drawer-body">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
  <div
    v-show="open"
    class="drawer-backdrop"
  />
</template>

<style scoped>
@import url('../assets/color.css');

#drawer {
  width: 225px;
  height: 100vh;
  position: fixed;
  background: var(--dark-bg);
  z-index: 10000;
  top: 0;
  left: 0;
}
.drawer-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  z-index: 10000;
}

.t-drawer-enter-active {
  animation: drawer-left-in 450ms;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0.62, -0.01, 0.09, 0.96);
}
.t-drawer-leave-active {
  animation: drawer-left-out 350ms;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(1, 0.01, 0.26, 0.82);
}
.drawer-header {
  display: flex;
  justify-content: flex-end;
}
.drawer-backdrop {
  background: black;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  opacity: 0.3;
}

@keyframes drawer-left-in {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0%);
  }
}
@keyframes drawer-left-out {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
