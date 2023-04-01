<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from './hooks';

const route = useRoute();
const router = useRouter();
const { accessToken } = useAuth();
onMounted(() => {
  const path = route.fullPath;
  if (path === '/' && accessToken)
    router.replace({ path: '/@chat', replace: true });
  if (path === '/' && !accessToken)
    router.replace({ path: '/', replace: true });
});
</script>

<template>
  <RouterView />
</template>
