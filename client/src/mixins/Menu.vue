<script setup lang="ts">
import Drawer from '../components/Drawer.vue';
import VerticalSpacing from '../components/Spacing/VerticalSpacing.vue';
import FindPeople from './FindPeople.vue';
import GroupCreator from './GroupCreator.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import LogoutIcon from '../components/Icon/LogoutIcon.vue';
import ProfileSettings from './ProfileSettings.vue';
import { InsensitiveResponseUserInfo } from '../types';
import { useAuth } from '../hooks';

interface IMenu {
  open?: boolean;
  friends?: InsensitiveResponseUserInfo[];
  onCallback?: () => void | boolean;
}
defineProps<IMenu>();
const { logout } = useAuth();
</script>
<template>
  <Drawer
    :open="open"
    @close="onCallback"
  >
    <VerticalSpacing grid>
      <FindPeople />
      <GroupCreator :friends="friends" />
      <ProfileSettings />
      <PrimaryButton
        label="Log out"
        @action="logout"
      >
        <LogoutIcon />
      </PrimaryButton>
    </VerticalSpacing>
  </Drawer>
</template>
