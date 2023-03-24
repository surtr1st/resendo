<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from './services';

const { accessToken, isAuth } = useAuth();
const router = useRouter();

onMounted(() => {
  const { fullPath } = router.currentRoute.value;
  if ((isAuth || accessToken) && fullPath === '/')
    router.replace({ path: '/chat', replace: true });
  if ((!isAuth || !accessToken) && fullPath === '/')
    router.replace({ path: '/', replace: true });
});
</script>

<template>
  <RouterView />
</template>
