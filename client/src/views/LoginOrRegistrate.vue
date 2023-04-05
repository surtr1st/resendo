<script setup lang="ts">
import LogInIcon from '../components/Icon/LogInIcon.vue';
import RegistrateIcon from '../components/Icon/RegistrateIcon.vue';
import PasswordField from '../components/Input/PasswordField.vue';
import TextField from '../components/Input/TextField.vue';
import SwapLoading from '../components/Loading/SwapLoading.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import VerticalSpacing from '../components/Spacing/VerticalSpacing.vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';
import { useAuth, useToast, useUser } from '../hooks';
import {
  convertCamelCaseToSentence,
  DEBOUNCE_DURATION,
  removeLastSymbol,
} from '../helpers';

const isSignUp = ref(false);
const isLoading = ref(false);

const router = useRouter();
const { authorize, setAuthorizing } = useAuth();
const { createUser } = useUser();
const { onSuccess, onError } = useToast();
const account = reactive({
  fullname: '',
  email: '',
  password: '',
  reEnterPassword: '',
});

function signin() {
  isLoading.value = true;
  (async () => {
    try {
      const response = await authorize({ email: account.email });
      const data = await response.json();
      if (response.status === 500) throw new Error(data.message);
      setAuthorizing(data);
      onSuccess('Authorized');
      setTimeout(() => {
        router.replace({ path: '/@chat', replace: true });
      }, 500);
    } catch (err) {
      isLoading.value = false;
      onError(`${err}`);
    }
  })();
}
const debounceLogin = useDebounceFn(signin, DEBOUNCE_DURATION);

function isEmptyProperties() {
  const user: {
    [key: string]: any;
  } = {
    fullname: account.fullname,
    email: account.email,
    password: account.password,
    reEnterPassword: account.reEnterPassword,
  };
  let errors = '';
  for (const field in user) {
    if (!user[field] && field !== 'reEnterPassword')
      errors += `${convertCamelCaseToSentence(`${[field]}`)}, `;
    if (!user[field] && field === 'reEnterPassword')
      errors += 'Re-enter password, ';
  }
  if (errors.length === 0) return false;
  onError(`${removeLastSymbol(errors.trimEnd())} is empty`);
  return true;
}

function signup() {
  if (isEmptyProperties()) return;
  const register = {
    fullname: account.fullname,
    email: account.email,
    password: account.password,
  };
  createUser(register)
    .then(() => (isSignUp.value = false))
    .catch((err) => console.log(err));
}
const debounceRegistrate = useDebounceFn(signup, DEBOUNCE_DURATION);
</script>

<template>
  <div class="login-bg">
    <div class="login">
      <SwapLoading v-if="isLoading" />
      <template v-else>
        <VerticalSpacing v-if="isSignUp">
          <h2>SIGN UP</h2>
          <TextField
            name="fullname"
            label="Fullname"
            v-model:value="account.fullname"
            @enter="debounceRegistrate"
          />
          <TextField
            name="email"
            label="Email"
            v-model:value="account.email"
            @enter="debounceRegistrate"
          />
          <PasswordField
            name="password"
            label="Password"
            v-model:value="account.password"
            @enter="debounceRegistrate"
          />
          <PasswordField
            name="reenterpassword"
            label="Re-enter Password"
            v-model:value="account.reEnterPassword"
            @enter="debounceRegistrate"
          />
        </VerticalSpacing>
        <VerticalSpacing v-else>
          <h2>SIGN IN</h2>
          <TextField
            name="email"
            label="Email"
            v-model:value="account.email"
            @enter="debounceLogin"
          />
        </VerticalSpacing>
        <VerticalSpacing v-if="isSignUp">
          <PrimaryButton
            label="Registrate"
            @action="debounceRegistrate"
          >
            <RegistrateIcon />
          </PrimaryButton>
          <SecondaryButton
            no-element
            label="Already have an account? Sign in here."
            @action="isSignUp = false"
          />
        </VerticalSpacing>
        <VerticalSpacing v-else>
          <PrimaryButton
            label="Log in"
            @action="debounceLogin"
          >
            <LogInIcon />
          </PrimaryButton>
          <SecondaryButton
            no-element
            label="Doesn't have an account? Sign up here."
            @action="isSignUp = true"
          />
        </VerticalSpacing>
      </template>
    </div>
  </div>
</template>

<style>
.login-bg {
  width: 100%;
  display: grid;
  place-items: center;
  height: 100vh;
}

.login {
  padding: 1rem;
  border-radius: 7px;
  width: 500px;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
