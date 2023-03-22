<script setup lang="ts">
import LinkButton from '../../components/Button/LinkButton.vue';
import SendButton from '../../components/Button/SendButton.vue';
import Input from '../../components/Input/Input.vue';
import VerticalSpacing from '../../components/Spacing/VerticalSpacing.vue';
import { useDebounceFn } from '@vueuse/core';
import { reactive, ref } from 'vue';
import { useAuth, useUser } from '../../services';

const isSignUp = ref(false);
const { authorize } = useAuth();
const { createUser } = useUser();
const user = ref({
  fullname: '',
  email: '',
  password: '',
  reEnterPassword: '',
});
const DURATION = 500;

function signin() {
  if (user.value.email.length === 0) return;
  const account = {
    email: `${user.value.email}`,
    // password: `${password.current?.value}`
  };
  console.log(user.value.email);
  authorize(account)
    .then(() => setTimeout(() => location.reload(), 500))
    .catch((err) => console.log(err));
}
const debounceLogin = useDebounceFn(signin, DURATION);

function signup() {
  const { fullname, email, password, reEnterPassword } = user.value;
  if (fullname.length === 0) return;
  if (email.length === 0) return;
  if (password.length === 0) return;
  if (`${reEnterPassword}`.includes(`${password}`)) return;

  const account = {
    fullname,
    email,
    password,
  };
  createUser(account)
    .then(() => (isSignUp.value = false))
    .catch((err) => console.log(err));
}
const debounceRegistrate = useDebounceFn(signup, DURATION);
</script>

<template>
  <div class="login-bg">
    <div class="login">
      <VerticalSpacing v-if="isSignUp">
        <h2>SIGN UP</h2>
        <Input
          type="text"
          name="fullname"
          label="Fullname"
          v-model:input-value="user.fullname"
          :on-enter="debounceRegistrate"
        />
        <Input
          type="text"
          name="email"
          label="Email"
          v-model:input-value="user.email"
          :on-enter="debounceRegistrate"
        />
        <Input
          type="password"
          name="password"
          label="Password"
          v-model:input-value="user.password"
          :on-enter="debounceRegistrate"
        />
        <Input
          type="password"
          name="re-enter-password"
          label="Re-enter Password"
          v-model:input-value="user.reEnterPassword"
          :on-enter="debounceRegistrate"
        />
        <SendButton
          label="Registrate"
          :on-send="debounceRegistrate"
        />
        <LinkButton
          label="Already have an account? Sign in here!"
          :on-navigate="
            () => {
              isSignUp = false;
            }
          "
        />
      </VerticalSpacing>
      <VerticalSpacing v-else>
        <Input
          type="text"
          name="email"
          label="Email"
          v-model:input-value="user.email"
          :on-enter="debounceLogin"
        />
        <SendButton
          label="Log in"
          :on-send="debounceLogin"
        />
        <LinkButton
          label="Doesn't have an account? Sign up here!"
          :on-navigate="
            () => {
              isSignUp = true;
            }
          "
        />
      </VerticalSpacing>
    </div>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
