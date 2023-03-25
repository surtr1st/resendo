<script lang="ts">
  import LinkButton from '../components/Button/LinkButton.svelte';
  import SendButton from '../components/Button/SendButton.svelte';
  import Input from '../components/Input/Input.svelte';
  import VerticalSpacing from '../components/Spacing/VerticalSpacing.svelte';
  import { useAuth, useUser } from '../services';
  import { useNavigate } from 'svelte-navigator';

  let isSignUp = false;
  const navigate = useNavigate();
  const { authorize } = useAuth();
  const { createUser } = useUser();
  const user = {
    fullname: '',
    email: '',
    password: '',
    reEnterPassword: '',
  };
  const DURATION = 500;

  function signin() {
    if (user.email.length === 0) return;
    const account = {
      email: user.email,
    };
    console.log(user.email);
    authorize(account)
      .then(() => setTimeout(() => navigate('/chat'), 500))
      .catch((err) => console.log(err));
  }

  function signup() {
    const { fullname, email, password, reEnterPassword } = user;
    if (fullname.length === 0) return;
    if (email.length === 0) return;
    if (password.length === 0) return;
    if (reEnterPassword.includes(password)) return;

    const account = {
      fullname,
      email,
      password,
    };
    createUser(account)
      .then(() => (isSignUp = false))
      .catch((err) => console.log(err));
  }
</script>

<div class="login-bg">
  <div class="login">
    {#if isSignUp}
      <VerticalSpacing>
        <h2>SIGN UP</h2>
        <Input
          name="fullname"
          label="Fullname"
          bind:inputValue={user.fullname}
          onEnter={signup}
        />
        <Input
          name="email"
          label="Email"
          bind:inputValue={user.email}
          onEnter={signup}
        />
        <Input
          type="password"
          name="password"
          label="Password"
          bind:inputValue={user.password}
          onEnter={signup}
        />
        <Input
          type="password"
          name="re-enter-password"
          label="Re-enter Password"
          bind:inputValue={user.reEnterPassword}
          onEnter={signup}
        />
        <SendButton
          label="Registrate"
          onSend={signup}
        />
        <LinkButton
          label="Already have an account? Sign in here!"
          onNavigate={() => {
            isSignUp = false;
          }}
        />
      </VerticalSpacing>
    {/if}
    {#if !isSignUp}
      <VerticalSpacing>
        <Input
          name="email"
          label="Email"
          bind:inputValue={user.email}
          onEnter={signin}
        />
        <SendButton
          label="Log in"
          onSend={signin}
        />
        <LinkButton
          label="Doesn't have an account? Sign up here!"
          onNavigate={() => {
            isSignUp = true;
          }}
        />
      </VerticalSpacing>
    {/if}
  </div>
</div>

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
</style>
