<script setup lang="ts">
import Drawer from '../components/Drawer.vue';
import VerticalSpacing from '../components/Spacing/VerticalSpacing.vue';
import FindPeople from './FindPeople.vue';
import GroupCreator from './GroupCreator.vue';
import ProfileSettings from './ProfileSettings.vue';
import { InsensitiveResponseUserInfo } from '../types';

interface IMenu {
  open?: boolean;
  friends?: InsensitiveResponseUserInfo[];
  onCallback?: () => void | boolean;
}
defineProps<IMenu>();
</script>
<template>
  <Drawer
    :open="open"
    @close="onCallback"
  >
    <VerticalSpacing grid>
      <FindPeople />
      <GroupCreator />
      <ProfileSettings />
    </VerticalSpacing>
  </Drawer>
</template>
