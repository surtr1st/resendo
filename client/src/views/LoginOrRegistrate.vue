<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import LogInIcon from '../components/Icon/LogInIcon.vue';
import RegistrateIcon from '../components/Icon/RegistrateIcon.vue';
import PasswordField from '../components/Input/PasswordField.vue';
import TextField from '../components/Input/TextField.vue';
import SwapLoading from '../components/Loading/SwapLoading.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import VerticalSpacing from '../components/Spacing/VerticalSpacing.vue';
import SuccessNotify from '../components/Toasty/SuccessNotify.vue';
import ErrorNotify from '../components/Toasty/ErrorNotify.vue';
import { DEBOUNCE_DURATION } from '../helpers';
import { useAuth, useUser } from '../hooks';

const isSignUp = ref(false);
const isLoading = ref(false);
const isSuccess = ref(false);
const isError = ref(false);
const responseMessage = ref('');

const router = useRouter();
const { authorize, setAuthorizing } = useAuth();
const { createUser } = useUser();
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
      responseMessage.value = 'Authorized';
      isSuccess.value = true;
      setTimeout(() => {
        isLoading.value = false;
        router.replace({ path: '/@chat', replace: true });
      }, 500);
    } catch (err) {
      isError.value = true;
      isLoading.value = false;
      responseMessage.value = `${err}`;
    }
  })();
}
const debounceLogin = useDebounceFn(signin, DEBOUNCE_DURATION);

const removeLastSymbol = (text: string) => text.replace(/.$/, '');

function convertCamelCaseToNormal(text: string) {
  // Split the string by capital letters and join with a space
  const sequence = text.split(/(?=[A-Z])/).join(' ');
  // Capitalize the first letter
  const firstLetterCapitalized =
    sequence.charAt(0).toUpperCase() + sequence.slice(1);
  return firstLetterCapitalized;
}

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
      errors += `${convertCamelCaseToNormal(`${[field]}`)}, `;
    if (field === 'reEnterPassword') errors += 'Re-enter password, ';
  }
  if (errors.length === 0) return false;
  responseMessage.value = `${removeLastSymbol(errors.trimEnd())} is empty`;
  isError.value = true;
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
      <SuccessNotify
        v-show="isSuccess"
        :message="responseMessage"
        :duration="3000"
        @reset="isSuccess = false"
      />
      <ErrorNotify
        v-show="isError"
        :message="responseMessage"
        :duration="3000"
        @reset="isError = false"
      />
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

h2 {
  font-weight: bold;
}
a {
  text-decoration: none;
}
</style>
